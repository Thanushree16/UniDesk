import "./LoginPage.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TfiControlBackward } from "react-icons/tfi";
import { useSubjects } from "../context/SubjectsContext";
import api from "../services/api";
import toast from "react-hot-toast";

export function LoginPage() {
  const { refreshSubjects } = useSubjects();

  const navigate = useNavigate();

  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.title = "Login | UniDesk";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("api/auth/login", {
        rollNumber,
        password,
      });

      localStorage.setItem("token", data.token);

       await refreshSubjects();

      toast.success("Login Successful !");
      navigate("/resources");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="auth-page">
      {/* Navbar */}
      <nav className="auth-navbar">
        <Link to="/" className="nav-back-btn">
          <TfiControlBackward />Back to Home
        </Link>
        <div className="nav-logo">
          <img
            src="/assets/images/Logo.png"
            alt="UniDesk Logo"
            className="nav-logo-icon"
          />
          <span className="nav-logo-text">UniDesk</span>
        </div>
      </nav>

      <div className="auth-container">
        {/* Login Card */}
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to continue to your dashboard</p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="roll">Roll Number</label>
              <input
                type="text"
                id="roll"
                placeholder="Enter your roll number"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="options-row">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="login-btn">
              Sign In
            </button>
          </form>

          <div className="signup-link">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="signup-link-text">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}