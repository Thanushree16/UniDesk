import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./Pages/LoginPage";
import { ForgotPage } from "./Pages/ForgotPage";
import { RegisterPage } from "./Pages/RegisterPage";
import { Home } from "./Pages/Home";
import { Dashboard } from "./Pages/Dashboard";
import { ResourcePage } from "./Pages/ResourcePage";
import { AiPage } from "./Pages/Aipage";
import { UploadPage } from "./Pages/UploadPage";
import { SubjectFilesPage } from "./Pages/SubjectFilesPage";
import { ProfilePage } from "./Pages/ProfilePage";
import { NotificationsPage } from "./Pages/NotificationPage";
import { ProtectedRoute } from "./components/protectedRoute";

import { Toaster } from "react-hot-toast";

import "./App.css";

function App() {
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
