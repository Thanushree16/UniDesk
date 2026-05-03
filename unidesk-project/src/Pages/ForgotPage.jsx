import "./ForgotPage.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Forgot Password | UniDesk";
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/api/auth/forgot-password", { email });
      toast.success("If that email exists, a reset link was sent.");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-navbar">
        <Link to="/" className="nav-back-btn">Back</Link>
        <div className="nav-logo">
          <img src="/assets/images/Logo.png" alt="UniDesk Logo" className="nav-logo-icon" />
          <span className="nav-logo-text">UniDesk</span>
        </div>
      </header>

      <div className="auth-container">
        <div className="forgot-card">
          <h2>Forgot Password</h2>
          <p className="subtitle">Enter your email address to reset your password.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="reset-btn" disabled={loading}>
              {loading ? "Sending..." : "Reset Password"}
            </button>
          </form>

          <p className="back-login">
            Remember your password?
            <Link to="/login" className="back-login-link">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}