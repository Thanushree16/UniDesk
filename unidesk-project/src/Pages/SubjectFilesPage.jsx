import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { LeftPanel } from "../components/LeftPanel";
import { Topbar } from "../components/Topbar";
import { IoIosArrowBack } from "react-icons/io";
import { MdInsertDriveFile, MdDelete } from "react-icons/md";
import { FaFolder } from "react-icons/fa";
import "./SubjectFilesPage.css";

export function SubjectFilesPage() {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const [searchParams] = useSearchParams();
  const year = searchParams.get("year");
  const sem = searchParams.get("semester");

  const [files, setFiles] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [filesRes, subjectRes] = await Promise.all([
          api.get(`/api/files/subject/${subjectId}`),
          api.get(`/api/subjects/${subjectId}`),
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

  function openFile(url, fileName) {
    if (!url) return;
    localStorage.setItem("recentFile", JSON.stringify({ name: fileName, url }));
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function deleteFile(fileId) {
    try {
      await api.delete(`/api/files/${fileId}`);
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
      toast.success("File deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-layout">
      <LeftPanel />

      <main className="main">
        <Topbar />

        <button
          className="back-btn"
          onClick={() => navigate(`/resources?year=${year}&semester=${sem}`)}
        >
          <IoIosArrowBack size={20} />
          <span>Back</span>
        </button>

        {subject && (
          <h2 className="page-title">
            {subject.subjectName} ({subject.subjectCode})
          </h2>
        )}

        {files.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FaFolder />
            </div>
            <h3>No files uploaded yet</h3>
            <p>Upload your first file to get started</p>
          </div>
        ) : (
          <div className="files-list">
            {files.map((file) => (
              <div key={file._id} className="file-card">
                <div className="file-icon">
                  <MdInsertDriveFile size={24} />
                </div>

                <div className="file-info">
                  <h4>{file.fileName}</h4>
                  <p>{file.fileSize}</p>
                </div>

                <div className="file-actions">
                  <button
                    onClick={() => openFile(file.fileUrl, file.fileName)}
                    className="open-btn"
                  >
                    Open
                  </button>

                  <button
                    onClick={() => deleteFile(file._id)}
                    className="delete-btn"
                  >
                    <MdDelete size={22} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}