import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LeftPanel } from "../components/LeftPanel";
import { Topbar } from "../components/Topbar";
import { IoIosArrowBack } from "react-icons/io";
import { useSubjects } from "../context/SubjectsContext";
import "./SubjectFilesPage.css";

export function SubjectFilesPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const { subjects } = useSubjects();

  // Find subject using subjectId
  const subject = subjects.find((s) => s.id === subjectId);

  useEffect(() => {
    document.title = `${subject.subjectName}`;
  }, [subject]);

  if (!subject) {
    return (
      <div className="dashboard-layout">
        <LeftPanel />
        <main className="main">
          <Topbar />
          <p>Subject not found.</p>
        </main>
      </div>
    );
  }
  //<IoIosArrowBack />
  return (
    <div className="dashboard-layout">
      <LeftPanel />

      <main className="main">
        <Topbar />

        <div className="subject-header">
          <button className="back-btn" onClick={() => navigate("/resources")}>
            <IoIosArrowBack />
          </button>
        </div>

        <h2 className="subject-title">
          {subject.subjectName} ({subject.subjectCode})
        </h2>

        <div className="files-list">
          {subject.files.map((file) => (
            <div className="file-card" key={file.id}>
              <div className="file-info">
                <h4>{file.name}</h4>
                <p>
                  {file.type} • {file.size}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
