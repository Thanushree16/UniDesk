import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LeftPanel } from "../components/LeftPanel";
import { Topbar } from "../components/Topbar";
import { IoIosArrowBack } from "react-icons/io";

export function SubjectFilesPage() {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubject() {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/subjects/${subjectId}`,
        );

        setSubject(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSubject();
  }, [subjectId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-layout">
      <LeftPanel />
      <main className="main">
        <Topbar />
        <button className="back-btn" onClick={() => navigate("/resources")}>
          <IoIosArrowBack />
        </button>

        <h2 className="subject-title">Files</h2>

        <h2>
          {subject.subjectName} ({subject.subjectCode})
        </h2>

        

        {subject.files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          subject.files.map((file) => (
            <div key={file._id}>
              <h4>{file.fileName}</h4>
              <p>
                {file.fileType} • {file.fileSize}
              </p>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
