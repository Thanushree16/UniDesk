import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { LeftPanel } from "../components/LeftPanel";
import { Topbar } from "../components/Topbar";
import { BiSend, BiPlus, BiX } from "react-icons/bi";
import ReactMarkdown from "react-markdown";
import api from "../services/api";
import toast from "react-hot-toast";
import "./AiPage.css";

function CustomSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value == value);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="custom-select" ref={ref}>
      <div className="custom-select-trigger" onClick={() => setOpen((p) => !p)}>
        <span>{selected?.label}</span>
        <span className={`custom-select-arrow ${open ? "open" : ""}`}>▾</span>
      </div>
      {open && (
        <div className="custom-select-dropdown">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`custom-select-option ${opt.value == value ? "selected" : ""}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

CustomSelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
};

export function AiPage() {
  const branches = ["CSE", "IT", "CSE-DS", "AI", "AI-ML", "ECE", "MECH", "EEE"];
  const yearSemesterMap = { 1: [1, 2], 2: [3, 4], 3: [5, 6], 4: [7, 8] };

  const [branch, setBranch] = useState("CSE");
  const [year, setYear] = useState(4);
  const [semester, setSemester] = useState(7);

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedSubjectName, setSelectedSubjectName] = useState("");

  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerStep, setPickerStep] = useState(1);
  const pickerRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => { document.title = "AI Assistant | UniDesk"; }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await api.get(
          `/api/subjects?branch=${branch}&year=${year}&semester=${semester}`
        );
        setSubjects(res.data);
      } catch (error) { console.error(error); }
    }
    if (pickerStep === 2) fetchSubjects();
  }, [branch, year, semester, pickerStep]);

  useEffect(() => {
    async function fetchFiles() {
      if (!selectedSubjectId) return;
      try {
        const res = await api.get(`/api/files/subject/${selectedSubjectId}`);
        setFiles(res.data);
      } catch (error) { console.error(error); }
    }
    fetchFiles();
  }, [selectedSubjectId]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
        setPickerStep(1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubjectSelect(subject) {
    setSelectedSubjectId(subject._id);
    setSelectedSubjectName(subject.subjectName);
    setSelectedFileId("");
    setSelectedFileName("");
    setPickerStep(3);
  }

  function handleFileSelect(file) {
    setSelectedFileId(file._id);
    setSelectedFileName(file.fileName);
    setShowPicker(false);
    setPickerStep(1);
  }

  function clearSelection() {
    setSelectedFileId("");
    setSelectedFileName("");
    setSelectedSubjectId("");
    setSelectedSubjectName("");
  }

  async function handleAsk() {
    if (!selectedFileId || !prompt.trim()) {
      toast.error("Select a file and enter a prompt");
      return;
    }
    try {
      setLoading(true);
      setMessages((prev) => [...prev, { role: "user", text: prompt }]);
      const res = await api.post("/api/ai/ask", { fileId: selectedFileId, prompt });
      setMessages((prev) => [...prev, { role: "ai", text: res.data.answer }]);
      setPrompt("");
      clearSelection();
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

          {/* CHAT */}
          <div className="ai-chat">
            {messages.length === 0 && (
              <div className="chat-empty">
                <p>Press <strong>+</strong> to select a PDF and start asking questions</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble ${msg.role === "user" ? "user" : "ai"}`}>
                {msg.role === "ai" && <div className="ai-name">Unify AI</div>}
                {msg.role === "ai" ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  <p style={{ margin: 0 }}>{msg.text}</p>
                )}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble ai">
                <div className="ai-name">Unify AI</div>
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="ai-input-area" ref={pickerRef}>

            {/* FILE PICKER DROPDOWN */}
            {showPicker && (
              <div className="file-picker">
                {pickerStep === 1 && (
                  <>
                    <div className="picker-label">Select Branch / Year / Semester</div>
                    <div className="picker-filters">
                      <CustomSelect
                        value={branch}
                        onChange={setBranch}
                        options={branches.map((b) => ({ label: b, value: b }))}
                      />
                      <CustomSelect
                        value={year}
                        onChange={(v) => setYear(Number(v))}
                        options={[
                          { label: "1st Year", value: 1 },
                          { label: "2nd Year", value: 2 },
                          { label: "3rd Year", value: 3 },
                          { label: "4th Year", value: 4 },
                        ]}
                      />
                      <CustomSelect
                        value={semester}
                        onChange={(v) => setSemester(Number(v))}
                        options={yearSemesterMap[year].map((sem) => ({ label: `Sem ${sem}`, value: sem }))}
                      />
                    </div>
                    <button className="picker-next" onClick={() => setPickerStep(2)}>
                      Next →
                    </button>
                  </>
                )}

                {pickerStep === 2 && (
                  <>
                    <div className="picker-label">
                      <button className="picker-back" onClick={() => setPickerStep(1)}>← Back</button>
                      <span>Select Subject</span>
                    </div>
                    {subjects.length === 0 ? (
                      <div className="picker-empty">No subjects found</div>
                    ) : (
                      subjects.map((subject) => (
                        <div key={subject._id} className="picker-item" onClick={() => handleSubjectSelect(subject)}>
                          <span className="picker-icon">📚</span>
                          <span>{subject.subjectName}</span>
                        </div>
                      ))
                    )}
                  </>
                )}

                {pickerStep === 3 && (
                  <>
                    <div className="picker-label">
                      <button className="picker-back" onClick={() => setPickerStep(2)}>← {selectedSubjectName}</button>
                    </div>
                    {files.length === 0 ? (
                      <div className="picker-empty">No files in this subject</div>
                    ) : (
                      files.map((file) => (
                        <div key={file._id} className="picker-item" onClick={() => handleFileSelect(file)}>
                          <span className="picker-icon">📄</span>
                          <span>{file.fileName}</span>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            )}

            {/* SELECTED FILE TAG */}
            {selectedFileName && (
              <div className="selected-file-tag">
                <span>📄 {selectedFileName}</span>
                <BiX className="clear-file" onClick={clearSelection} />
              </div>
            )}

            {/* INPUT BAR */}
            <div className="ai-input">
              <button className="attach-btn" onClick={() => { setShowPicker((p) => !p); setPickerStep(1); }}>
                <BiPlus />
              </button>
              <input
                type="text"
                placeholder="Ask questions from selected PDF..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !loading) handleAsk(); }}
              />
              <BiSend className="send-icon" onClick={handleAsk} style={{ cursor: "pointer" }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}