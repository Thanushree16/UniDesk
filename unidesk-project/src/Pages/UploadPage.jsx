import { useState, useEffect } from "react";
import { LeftPanel } from "../components/LeftPanel";
import { Topbar } from "../components/Topbar";
import { LuUpload } from "react-icons/lu";
import api from "../services/api";
import toast from "react-hot-toast";
import "./UploadPage.css";

export function UploadPage() {
  const branches = ["CSE", "IT", "CSE-DS", "AI", "AI-ML", "ECE", "MECH", "EEE"];

  const yearSemesterMap = {
    1: [1, 2],
    2: [3, 4],
    3: [5, 6],
    4: [7, 8],
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [branch, setBranch] = useState(branches[0]);
  const [year, setYear] = useState(4);
  const [semester, setSemester] = useState(7);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  useEffect(() => {
    document.title = "Upload Files | UniDesk";
  }, []);

  
  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await api.get(
          `/api/subjects?branch=${branch}&year=${year}&semester=${semester}`
        );
        console.log("Fetched subjects:", res.data);
        setSubjects(res.data);
        setSelectedSubjectId("");
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    }

    fetchSubjects();
  }, [branch, year, semester]);

  function handleFileChange(e) {
    setSelectedFile(e.target.files[0]);
  }

  async function handleUpload() {
    if (!selectedFile || !selectedSubjectId) {
      toast.error("Select subject and file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // eslint-disable-next-line no-unused-vars
      const res = await api.post(
        `/api/files/upload/${selectedSubjectId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSelectedFile(null);
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    }
  }

  return (
    <div className="dashboard-layout">
      <LeftPanel />
      <main className="main">
        <Topbar />

        <h2 className="page-title">Upload Your Files</h2>

        <div className="upload-filters">
          <select value={branch} onChange={(e) => setBranch(e.target.value)}>
            {branches.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>

          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
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

        
        <div className="subject-select">
          <label>Select Subject</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
          >
            <option value="">Choose subject</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.subjectName} ({subject.subjectCode})
              </option>
            ))}
          </select>
        </div>



        <div className="upload-dropzone">
          <div className="dropzone-inner">
            <LuUpload className="dropzone-icon" />
            <p className="dropzone-text">Drag & drop your file here</p>
            <span className="dropzone-or">or</span>
            <label className="dropzone-label">
              Browse File
              <input type="file" hidden onChange={handleFileChange} />
            </label>
            {selectedFile && (
              <p className="dropzone-selected">📄 {selectedFile.name}</p>
            )}
          </div>
        </div>

        <button
          className="upload-btn"
          disabled={!selectedFile || !selectedSubjectId}
          onClick={handleUpload}
        >
          Upload
        </button>
      </main>
    </div>
  );
}