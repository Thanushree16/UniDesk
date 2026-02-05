import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import "./RegisterPage.css";
import "../styles/auth.css";

export function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    document.title = "Register | UniDesk";
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await api.post("/auth/register", {
        name: rollNumber, 
        email,
        rollNumber,
        password,
      });

      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="top-banner">Step Into Smarter Studying with UniDesk.</div>

      <div className="container">
        <div className="left-panel">
          <img
            className="main-image"
            src="/assets/images/register.gif"
            alt="Register Animation"
          />
        </div>

        <div className="right-panel">
          <div className="center-logo">
            <img
              src="/assets/images/Logo.png"
              alt="UniDesk Logo"
              className="center-logo-icon"
            />
            <span>UniDesk</span>
          </div>

          <div className="register-box">
            <h2>Register</h2>

            <form autoComplete="off" onSubmit={handleRegister}>
              <label>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label>Roll Number</label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
              />

              <label>Create Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label>Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button type="submit">Register</button>
            </form>

            <div className="login-link">
              Already have an account?
              <Link to="/login">
                <u> Login</u>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
