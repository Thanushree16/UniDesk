import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TfiControlBackward } from "react-icons/tfi";
import { BiShow, BiHide } from "react-icons/bi";
import { useSubjects } from "../context/SubjectsContext";
import api from "../services/api";
import "./RegisterPage.css";
import toast from "react-hot-toast";

export function RegisterPage() {
  const { refreshSubjects } = useSubjects();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    document.title = "Register | UniDesk";
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await api.post("/api/auth/register", {
        name: rollNumber,
        email,
        rollNumber,
        password,
      });

      await refreshSubjects();

      toast.success("Registered successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      {/* Navbar */}
      <nav className="auth-navbar">
        <Link to="/" className="nav-back-btn">
          <TfiControlBackward />
          Back to Home
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
        {/* Register Card */}
        <div className="register-card">
          <h2>Create Account</h2>
          <p className="subtitle">Sign up to get started with UniDesk</p>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

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
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? <BiHide /> : <BiShow />}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  type={showConfirm ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowConfirm((p) => !p)}
                >
                  {showConfirm ? <BiHide /> : <BiShow />}
                </span>
              </div>
            </div>

            <button type="submit" className="register-btn">
              Create Account
            </button>
          </form>

          <div className="login-link">
            Already have an account?{" "}
            <Link to="/login" className="login-link-text">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
