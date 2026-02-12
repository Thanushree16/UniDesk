import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LeftPanel } from "../components/LeftPanel";
import { Topbar } from "../components/Topbar";
import { IoIosArrowBack } from "react-icons/io";

export function SubjectFilesPage() {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const [files, setFiles] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");

        const [filesRes, subjectRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/files/subject/${subjectId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5000/api/subjects/${subjectId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setFiles(filesRes.data);
        setSubject(subjectRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [subjectId]);

  
function openFile(fileId) {
  const token = localStorage.getItem("token");

  if (!fileId) return;

  window.open(
    `http://localhost:5000/api/files/open/${fileId}?token=${token}`,
    "_blank"
  );
}


  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-layout">
      <LeftPanel />

      <main className="main">
        <Topbar />

        <button className="back-btn" onClick={() => navigate("/resources")}>
          <IoIosArrowBack />
        </button>

        {subject && (
          <h2 className="subject-title">
            {subject.subjectName} ({subject.subjectCode})
          </h2>
        )}

        {files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          files.map((file) => (
            <div key={file._id}>
              <h4>{file.fileName}</h4>
              <p>{file.fileSize}</p>

              <button
                onClick={() => openFile(file._id)}
                className="open-btn"
              >
                Open File
              </button>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
