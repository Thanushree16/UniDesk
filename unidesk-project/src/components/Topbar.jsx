import { BiBell, BiSearch } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Topbar.css";

export function Topbar() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchCount() {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/notifications/unread-count",
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setCount(res.data.count);
      } catch (err) {
        console.error(err);
      }
    }

    fetchCount();
  }, []);

  return (
    <div className="topbar">
      <div className="search-box">
        <BiSearch className="search-icon" />
        <input type="text" placeholder="Search for files or subjects..." />
      </div>
      <div className="top-icons">
        <div
          className="notification-bell"
          onClick={() => navigate("/notifications")}
        >
          <BiBell />
          {count > 0 && <span className="notif-badge">{count}</span>}
        </div>

        <button className="profile-icon" onClick={() => navigate("/profile")}>
          <CgProfile />
        </button>
      </div>
    </div>
  );
}
