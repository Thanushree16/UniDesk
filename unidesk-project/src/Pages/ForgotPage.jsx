import "./ForgotPage.css";
import "../styles/auth.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export function ForgotPage() {
  useEffect(() => {
    document.title = "Forgot Password | UniDesk";
  }, []);

  return (
    <div className="auth-page">
      <div className="forgot-wrapper">
        <div className="forgot-password">
          <div className="logo">
            <img
              src="/assets/images/Logo.png"
              alt="UniDesk Logo"
              className="logo-icon"
            />
          </div>

          <h2>Forgot Password</h2>
          <p>Please enter your email address to reset your password.</p>

          <form>
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Reset Password</button>
          </form>

          <p>
            Remember your password? <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
