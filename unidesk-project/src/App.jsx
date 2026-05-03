import { Routes, Route, useLocation } from "react-router-dom";
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
import { ResetPasswordPage } from "./Pages/ResetPasswordPage";
import { ProtectedRoute } from "./components/protectedRoute";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
import { Toaster } from "react-hot-toast";

import "./App.css";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot"];

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");

      const isPublic =
        PUBLIC_ROUTES.includes(location.pathname) ||
        location.pathname.startsWith("/reset-password");

      if (!token) {
        if (!isPublic) {
          navigate("/login");
        }
        return;
      }

      try {
        await api.get("/api/auth/me");

        if (isPublic) {
          navigate("/dashboard");
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
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
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><ResourcePage /></ProtectedRoute>} />
        <Route path="/resources/:subjectId" element={<ProtectedRoute><SubjectFilesPage /></ProtectedRoute>} />
        <Route path="/assistant" element={<ProtectedRoute><AiPage /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
}

export default App;