import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { SubjectsProvider } from "./context/SubjectsContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SubjectsProvider>
        <App />
      </SubjectsProvider>
    </BrowserRouter>
  </StrictMode>
);
