import "./ForgotPage.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export function ForgotPage() {
  useEffect(() => {
    document.title = "Forgot Password | UniDesk";
  }, []);

  return (
    <div className="auth-page">
      <header className="auth-navbar">
        <Link to="/" className="nav-back-btn">← Back</Link>
        <div className="nav-logo">
          <img src="/assets/images/Logo.png" alt="UniDesk Logo" className="nav-logo-icon" />
          <span className="nav-logo-text">UniDesk</span>
        </div>
      </header>

      <div className="auth-container">
        <div className="forgot-card">
          <h2>Forgot Password</h2>
          <p className="subtitle">Enter your email address to reset your password.</p>

          <form>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="Enter your email" required />
            </div>
            <button type="submit" className="reset-btn">Reset Password</button>
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