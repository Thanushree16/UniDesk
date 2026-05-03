import { useEffect, useState } from "react";
import { LeftPanel } from "../components/LeftPanel";
import { Topbar } from "../components/Topbar";
import { BiSend } from "react-icons/bi";
import api from "../services/api";
import toast from "react-hot-toast";
import "./AiPage.css";

export function AiPage() {
  const branches = ["CSE", "IT", "CSE-DS", "AI", "AI-ML", "ECE", "MECH", "EEE"];

  const yearSemesterMap = {
    1: [1, 2],
    2: [3, 4],
    3: [5, 6],
    4: [7, 8],
  };

  const [branch, setBranch] = useState("CSE");
  const [year, setYear] = useState(4);
  const [semester, setSemester] = useState(7);

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState("");

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "AI Assistant | UniDesk";
  }, []);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await api.get(
          `/api/subjects?branch=${branch}&year=${year}&semester=${semester}`
        );

        setSubjects(res.data);
        setSelectedSubjectId("");
        setFiles([]);
        setSelectedFileId("");
      } catch (error) {
        console.error(error);
      }
    }

    fetchSubjects();
  }, [branch, year, semester]);

  useEffect(() => {
    async function fetchFiles() {
      if (!selectedSubjectId) return;

      try {
        const res = await api.get(`/api/files/subject/${selectedSubjectId}`);
        setFiles(res.data);
        setSelectedFileId("");
      } catch (error) {
        console.error(error);
      }
    }

    fetchFiles();
  }, [selectedSubjectId]);

  async function handleAsk() {
    if (!selectedFileId || !prompt.trim()) {
      toast.error("Select file and enter prompt");
      return;
    }

    try {
      setLoading(true);

      const userMessage = {
        role: "user",
        text: prompt,
      };

      setMessages((prev) => [...prev, userMessage]);

      const res = await api.post("/api/ai/ask", {
        fileId: selectedFileId,
        prompt,
      });

      const aiMessage = {
        role: "ai",
        text: res.data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);

      setPrompt("");
    } catch (error) {
      console.error(error);
      toast.error("AI request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-layout">
      <LeftPanel />

      <main className="ai-main">

        <div className="ai-topbar-row">
        <Topbar />
        </div>

        <div className="ai-content">

        <h2 className="ai-title">AI Assistant</h2>

        {/* FILTERS */}
        <div className="ai-filters">
          <select value={branch} onChange={(e) => setBranch(e.target.value)}>
            {branches.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            <option value={1}>1st Year</option>
            <option value={2}>2nd Year</option>
            <option value={3}>3rd Year</option>
            <option value={4}>4th Year</option>
          </select>

          <select
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
          >
            {yearSemesterMap[year].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        {/* SUBJECT */}
        <select
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          style={{ marginBottom: "12px", width: "100%" }}
        >
          <option value="">Select Subject</option>

          {subjects.map((subject) => (
            <option key={subject._id} value={subject._id}>
              {subject.subjectName}
            </option>
          ))}
        </select>

        {/* FILE */}
        <select
          value={selectedFileId}
          onChange={(e) => setSelectedFileId(e.target.value)}
          style={{ marginBottom: "18px", width: "100%" }}
        >
          <option value="">Select Uploaded PDF</option>

          {files.map((file) => (
            <option key={file._id} value={file._id}>
              {file.fileName}
            </option>
          ))}
        </select>

        {/* QUICK ACTIONS */}
        <div className="ai-actions">
          <button onClick={() => setPrompt("Summarize this PDF clearly")}>
            Summarize
          </button>

          <button
            onClick={() =>
              setPrompt("Generate 10 expected semester exam questions")
            }
          >
            Questions
          </button>

          <button
            onClick={() =>
              setPrompt("Give important 5 mark questions from this PDF")
            }
          >
            5 Marks
          </button>

          <button
            onClick={() =>
              setPrompt("Explain this chapter in simple language")
            }
          >
            Explain
          </button>
        </div>

        {/* CHAT */}
        <div className="ai-chat">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble ${msg.role === "user" ? "user" : "ai"}`}
            >
              {msg.role === "ai" && (
                <div className="ai-name">Unify AI</div>
              )}

              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  margin: 0,
                }}
              >
                {msg.text}
              </pre>
            </div>
          ))}

          {loading && (
            <div className="chat-bubble ai">
              <div className="ai-name">Unify AI</div>
              Thinking...
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="ai-input">
          <input
            type="text"
            placeholder="Ask questions from selected PDF..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !loading) handleAsk();
            }}
          />

          <BiSend
            className="send-icon"
            onClick={handleAsk}
            style={{ cursor: "pointer" }}
          />
        </div>
        </div>
      </main>
    </div>
  );
}