import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./Pages/LoginPage";
import { ForgotPage } from "./Pages/ForgotPage";
import { RegisterPage } from "./Pages/RegisterPage";
import { Home } from "./Pages/Home";
import { Dashboard } from "./Pages/Dashboard";

import "./App.css";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot" element={<ForgotPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />


    </Routes>
  );
}

export default App;
