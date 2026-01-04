import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LeftPanel } from "../components/LeftPanel";
import { Topbar } from "../components/Topbar";
import { useSubjects } from "../context/SubjectsContext";
import { LuUpload } from "react-icons/lu";
import "./UploadPage.css";

export function UploadPage() {
  const navigate = useNavigate();
  const { subjects, addFileToSubject } = useSubjects();

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [recentFiles, setRecentFiles] = useState([]);

  useEffect(() => {
    document.title = "Upload Files | UniDesk";
  }, []);

  function handleFileChange(e) {
    setSelectedFile(e.target.files[0]);
  }

  function handleUpload() {
    if (!selectedFile || !selectedSubjectId) return;

    const subject = subjects.find((s) => s.id === selectedSubjectId);

    const newFile = {
      id: crypto.randomUUID(),
      name: selectedFile.name,
      type: selectedFile.type.split("/")[1]?.toUpperCase() || "FILE",
      size: `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`,
    };

    addFileToSubject(selectedSubjectId, newFile);

    setRecentFiles((prev) => [
      {
        ...newFile,
        subject: subject.subjectCode,
      },
      ...prev,
    ]);

    setSelectedFile(null);
    setSelectedSubjectId("");
  }

  return (
    <div className="dashboard-layout">
      <LeftPanel />

      <main className="main">
        <Topbar />

        <h2 className="page-title">Upload Your Files</h2>

        {/* Upload Box */}
        <div className="upload-dropzone">
          <LuUpload />
          <p>
            Drag & Drop or to upload 
          </p>
          {" "}
            <label className="choose-text">
              Choose file
              <input type="file" hidden onChange={handleFileChange} />
            </label>{" "}
        </div>

        {/* Subject Select */}
        <div className="subject-select">
          <label>Select Subject</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
          >
            <option value="">Choose subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.subjectName} ({subject.subjectCode})
              </option>
            ))}
          </select>
        </div>

        {/* Upload Button */}
        <button
          className="upload-btn"
          disabled={!selectedFile || !selectedSubjectId}
          onClick={handleUpload}
        >
          Upload
        </button>

        {/* Recently Uploaded */}
        {recentFiles.length > 0 && (
          <>
            <h3 className="recent-title">Uploaded Files</h3>

            <div className="recent-files">
              {recentFiles.map((file) => (
                <div className="recent-file-card" key={file.id}>
                  <div className="file-type">{file.type}</div>
                  <div className="file-details">
                    <h4>{file.name}</h4>
                    <p>Uploaded in {file.subject} (Subject)</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
