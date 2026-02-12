import { useState, useEffect } from "react";
import { LeftPanel } from "../components/LeftPanel";
import { Topbar } from "../components/Topbar";
import { LuUpload } from "react-icons/lu";
import axios from "axios";
import toast from "react-hot-toast";
import "./UploadPage.css";

export function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);

  useEffect(() => {
    document.title = "Upload Files | UniDesk";

    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/subjects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error(err));
  }, []);

  function handleFileChange(e) {
    setSelectedFile(e.target.files[0]);
  }

  async function handleUpload() {
  if (!selectedFile || !selectedSubjectId) return;

  try {
    const formData = new FormData();
    formData.append("file", selectedFile);

    const token = localStorage.getItem("token");

    const res = await axios.post(
      `http://localhost:5000/api/files/upload/${selectedSubjectId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setRecentFiles((prev) => [res.data.file, ...prev]);

    setSelectedFile(null);
    setSelectedSubjectId("");

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

        <div className="upload-dropzone">
          <LuUpload />
          <p>Drag & Drop or</p>
          <label className="choose-text">
            Choose file
            <input type="file" hidden onChange={handleFileChange} />
          </label>
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

        <button
          className="upload-btn"
          disabled={!selectedFile || !selectedSubjectId}
          onClick={handleUpload}
        >
          Upload
        </button>

        {recentFiles.length > 0 && (
          <>
            <h3 className="recent-title">Uploaded Files</h3>

            <div className="recent-files">
              {recentFiles.map((file) => (
                <div className="recent-file-card" key={file._id}>
                  
                  <div className="file-details">
                    <h4>{file.fileName}</h4>
                    <p>{file.fileSize}</p>
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
