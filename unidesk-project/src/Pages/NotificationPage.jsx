import { useEffect, useState } from "react";
import api from "../services/api";
import { LeftPanel } from "../components/LeftPanel";
import { Topbar } from "../components/Topbar";
import "./NotificationsPage.css";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await api.get("/api/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchNotifications();
  }, []);

  async function markRead(id) {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function markAllRead() {
  try {
    await api.put("/api/notifications/read-all"); 
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  } catch (err) {
    console.error(err);
  }
}
  async function clearAll() {
    try {
      await api.delete("/api/notifications/clear-all");
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="dashboard-layout">
      <LeftPanel />
      <main className="main">
        <Topbar />

        <div className="notifications-header">
          <h2>Notifications</h2>
          <div className="notification-actions">
            {unreadCount > 0 && (
              <button className="action-btn mark-read-btn" onClick={markAllRead}>
                Mark all as read
              </button>
            )}
            {notifications.length > 0 && (
              <button className="action-btn clear-btn" onClick={clearAll}>
                Clear all
              </button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p>No notifications</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`notification-item ${n.isRead ? "read" : "unread"}`}
                onClick={() => markRead(n._id)}
              >
                {!n.isRead && <span className="unread-indicator"></span>}
                <p>{n.message}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}