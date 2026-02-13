import { useState } from "react";
import { BiGridAlt, BiFolder, BiBot, BiMenu, BiLogOut } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import "./LeftPanel.css";

export function LeftPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Top section */}
      <div className="top-section">
        {!collapsed && (
          <div className="logo">
            <img src="/assets/images/Logo.png" alt="UniDesk Logo" />
            <span>UniDesk</span>
          </div>
        )}

        <BiMenu
          className={`hamburger ${collapsed ? "collapsed-hamburger" : ""}`}
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Menu */}
      <nav className="menu">
        <button
          className={`menu-item ${
            location.pathname === "/dashboard" ? "active" : ""
          }`}
          onClick={() => navigate("/dashboard")}
        >
          <BiGridAlt />
          {!collapsed && <span>Dashboard</span>}
        </button>

        <button
          className={`menu-item ${
            location.pathname === "/resources" ? "active" : ""
          }`}
          onClick={() => navigate("/resources")}
        >
          <BiFolder />
          {!collapsed && <span>Resource Library</span>}
        </button>

        <button
          className={`menu-item ${
            location.pathname === "/assistant" ? "active" : ""
          }`}
          onClick={() => navigate("/assistant")}
        >
          <BiBot />
          {!collapsed && <span>AI Assistant</span>}
        </button>
      </nav>

      {/* Upload */}
      {!collapsed && (
        <button className="upload-btn" onClick={() => navigate("/upload")}>
          Upload files
        </button>
      )}

      {/* Logout */}
      <div className="logout" onClick={() => navigate("/logout")} >
        <BiLogOut />
        {!collapsed && <span>Logout</span>}
      </div>
    </aside>
  );
}
