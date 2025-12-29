
import { useEffect } from "react";
import "./Dashboard.css";

export function Dashboard() {
  useEffect(() => {
    document.title = "Dashboard | UniDesk";
  }, []);

  return (
    <div className="container">
      <div className="left-panel">
        <div className="logo">
          <img
            src="/assets/images/Logo.png"
            alt="UniDesk Logo"
            className="logo-icon"
          />
          <span>UniDesk</span>
        </div>
        <div className="dashboard-menu-icon">
          <img
            src="/assets/images/menu-wider.svg"
            alt="Dashboard menu icon"
            className="menu-icon"
          />
        </div>
        <div className="dashbord-menu">
          <div className="dashboard-menu-item">
            <img
              src="/assets/images/dashboard.svg"
              alt="dashboard icon"
              className="dashboard-icon"
            />
            <span>Dashboard</span>
          </div>
           <div className="resourceLibrary-menu-item">
            <img
              src="/assets/images/folder.svg"
              alt="resource library icon"
              className="resource-library-icon"
            />
            <span>Resource library</span>
          </div>
            <div className="aiAssistant-menu-item">
            <img
              src="/assets/images/ai.svg"
              alt="ai icon"
              className="ai-icon"
            />
            <span>AI Assistant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
