import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./Pages/LoginPage";
import { ForgotPage } from "./Pages/ForgotPage";
import { RegisterPage } from "./Pages/RegisterPage";
import { Home } from "./Pages/Home";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot" element={<ForgotPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
