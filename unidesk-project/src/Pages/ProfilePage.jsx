import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./ProfilePage.css";

export function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }

    fetchUser();
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    toast.success("Logged out");
    navigate("/login");
  }

  function handleBack() {
    navigate(-1);
  }

  if (!user) return <p style={{ padding: 40 }}>Loading profile...</p>;

  return (
    <div className="dashboard-layout">
      <main className="main">
        <div className="profile-page-wrapper">
          <h1 className="page-title">User Profile</h1>

         

          <div className="profile-card">
            <div className="profile-row">
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>

            <div className="profile-row">
              <span>Roll Number</span>
              <strong>{user.rollNumber}</strong>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
           <button className="back-btn" onClick={handleBack}>
            Back
          </button>
        </div>
        
      </main>
    </div>
  );
}
