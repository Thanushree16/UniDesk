import { useEffect } from "react";
import { LeftPanel } from "../components/LeftPanel";
import { Topbar } from "../components/Topbar";
import "./ResourcePage.css";

export function ResourcePage() {
  useEffect(() => {
    document.title = "Resources | UniDesk";
  }, []);

  return (
    <div className="dashboard-layout">
      <LeftPanel />

      <main className="main">
        <Topbar />

        <h2 className="subject-title">Subjects</h2>

        <div className="subjects-grid">
          <div className="subject-wrapper">
            <div className="subject-card">
              <div className="file-count">4 files</div>
              <div className="subject-code">BDA</div>
              <div className="subject-strip"></div>
            </div>
            <p className="subject-name">Big Data Analytics</p>
          </div>

          <div className="subject-wrapper">
            <div className="subject-card">
              <div className="file-count">2 files</div>
              <div className="subject-code">IOT</div>
              <div className="subject-strip"></div>
            </div>
            <p className="subject-name">Internet Of Things</p>
          </div>

          <div className="subject-wrapper">
            <div className="subject-card">
              <div className="file-count">3 files</div>
              <div className="subject-code">NLP</div>
              <div className="subject-strip"></div>
            </div>
            <p className="subject-name">Natural Language Processing</p>
          </div>

          <div className="subject-wrapper">
            <div className="subject-card">
              <div className="file-count">6 files</div>
              <div className="subject-code">CC&S</div>
              <div className="subject-strip"></div>
            </div>
            <p className="subject-name">Cloud Computing & Security</p>
          </div>

          <div className="subject-wrapper">
            <div className="subject-card">
              <div className="file-count">4 files</div>
              <div className="subject-code">FE</div>
              <div className="subject-strip"></div>
            </div>
            <p className="subject-name">Fundamentals Of Entrepreneurship</p>
          </div>
        </div>
      </main>
    </div>
  );
}
