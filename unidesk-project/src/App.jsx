import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./Pages/LoginPage";
import { ForgotPage } from "./Pages/ForgotPage";
import { RegisterPage } from "./Pages/RegisterPage";
import { Home } from "./Pages/Home";
import { Dashboard } from "./Pages/Dashboard";
import { ResourcePage } from "./Pages/ResourcePage";
import { AiPage } from "./Pages/AiPage";
import { UploadPage } from "./Pages/UploadPage";
import { SubjectFilesPage } from "./Pages/SubjectFilesPage";
import { ProfilePage } from "./Pages/ProfilePage";
import { NotificationsPage } from "./Pages/NotificationPage";
import { Logout } from "./components/Logout";
import { ProtectedRoute } from "./components/protectedRoute";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from"./services/api";
import { Toaster } from "react-hot-toast";

import "./App.css";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        await api.get("/api/auth/me");
        navigate("/dashboard");
      } catch (err) {
        localStorage.removeItem("token");
      }
    }

    checkAuth();
  }, []);

  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot" element={<ForgotPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/resources/:subjectId" element={<SubjectFilesPage />} />
        <Route path="/assistant" element={<AiPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/logout" element={<Logout />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <ResourcePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
