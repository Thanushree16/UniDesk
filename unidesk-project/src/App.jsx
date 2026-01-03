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


import "./App.css";




function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot" element={<ForgotPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/resources" element={<ResourcePage />} />
      <Route path="/resources/:subjectId" element={<SubjectFilesPage />} />

      <Route path="/assistant" element={<AiPage />} />
      <Route path="/upload" element={<UploadPage />} />
      




    </Routes>
  );
}

export default App;
