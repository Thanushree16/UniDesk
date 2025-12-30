import { useEffect } from "react";
import { LeftPanel } from "../components/LeftPanel";
import { Topbar } from "../components/Topbar";
import "./Dashboard.css";

export function Dashboard() {
  useEffect(() => {
    document.title = "Dashboard | UniDesk";
  }, []);

  return (
    <div className="dashboard-layout">
      <LeftPanel />

      <main className="main">
        <Topbar />

        {/* GREETING */}
        <h2 className="greeting">Welcome there!</h2>

        {/* TIMETABLE */}
        <section className="timetable">
          <div className="date-strip">
            <span>September 9th, 2025 • Tuesday</span>
            <span>IV-I CSE-B</span>
          </div>

          <div className="class-cards">
            <div className="class-card">
              <h3>NLP</h3>
              <p>9:20 AM – 10:10 AM</p>
            </div>

            <div className="class-card">
              <h3>IOT Lab</h3>
              <p>10:10 AM – 12:40 PM</p>
            </div>
          </div>

          <button className="view-btn">View full Time Table</button>
        </section>

        {/* BOTTOM GRID */}
        <section className="bottom-grid">
          <div className="recent-file">
            <h4>Your recently accessed file</h4>
            <div className="file-card">
              <span>NLP Unit-1.pdf</span>
              <button>Open File</button>
            </div>
          </div>

          <div className="exam-panel">
            <h4>Exam Timetable</h4>
            <p>MID-1 Examination</p>
            <span>0 / 5 Exams Completed</span>
          </div>
        </section>
      </main>
    </div>
  );
}
