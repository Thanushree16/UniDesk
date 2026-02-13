import { useEffect, useState } from "react";
import axios from "axios";
import { LeftPanel } from "../components/LeftPanel";
import { Topbar } from "../components/Topbar";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/notifications",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(res.data);
    }

    fetchNotifications();
  }, []);

  async function markRead(id) {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/notifications/${id}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  }

  return (
    <div className="dashboard-layout">
      <LeftPanel />
      <main className="main">
        <Topbar />

        <h2>Notifications</h2>

        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              style={{
                padding: "12px",
                marginBottom: "10px",
                background: n.isRead ? "#0b1e3d" : "#1e3a8a",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => markRead(n._id)}
            >
              {n.message}
            </div>
          ))
        )}
      </main>
    </div>
  );
}
