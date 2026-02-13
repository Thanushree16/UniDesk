import { useEffect, useState } from "react";
import axios from "axios";
import { LeftPanel } from "../components/LeftPanel";
import { Topbar } from "../components/Topbar";
import {
  MdInsertDriveFile,
  MdNotifications,
  MdOpenInNew,
} from "react-icons/md";
import "./Dashboard.css";

export function Dashboard() {
  const [totalFiles, setTotalFiles] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [recentFile, setRecentFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard | UniDesk";

    const token = localStorage.getItem("token");
    const API = import.meta.env.VITE_API_URL;

    async function fetchData() {
      try {
        const filesRes = await axios.get(`${API}/api/files/total-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTotalFiles(filesRes.data.count);

        // unread notifications
        const notifRes = await axios.get(
          `${API}/api/notifications/unread-count`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setUnreadNotifications(notifRes.data.count);

        // recent file from localStorage
        const stored = localStorage.getItem("recentFile");
        if (stored) setRecentFile(JSON.parse(stored));
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <LeftPanel />
        <main className="main">
          <Topbar />
          <div className="loading-state">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <LeftPanel />

      <main className="main">
        <Topbar />

        <div className="welcome-section">
          <h1 className="page-title">Welcome back !</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon files-icon">
              <MdInsertDriveFile size={28} />
            </div>
            <div className="stat-content">
              <h3>Total Files</h3>
              <p className="stat-value">{totalFiles}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon notifications-icon">
              <MdNotifications size={28} />
            </div>
            <div className="stat-content">
              <h3>Unread Notifications</h3>
              <p className="stat-value">{unreadNotifications}</p>
            </div>
          </div>
        </div>

        <div className="recent-section">
          <h2 className="section-title">Recently Opened File</h2>

          {recentFile ? (
            <div className="recent-card">
              <div className="recent-file-icon">
                <MdInsertDriveFile size={24} />
              </div>

              <div className="recent-file-info">
                <h4>{recentFile.name}</h4>
                <p>Last opened file</p>
              </div>

              <button
                onClick={() => window.open(recentFile.url, "_blank")}
                className="open-file-btn"
              >
                <span>Open</span>
                <MdOpenInNew size={18} />
              </button>
            </div>
          ) : (
            <div className="no-recent">
              <div className="no-recent-icon">📄</div>
              <p>No recent file opened</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
