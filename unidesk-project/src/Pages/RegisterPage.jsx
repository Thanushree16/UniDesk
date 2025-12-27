import { Link } from "react-router-dom";
import { useEffect } from "react";
import "./RegisterPage.css";
import "../styles/auth.css";

export function RegisterPage() {
  useEffect(() => {
    document.title = "Register | UniDesk";
  }, []);

  return (
    <div className="auth-page">
      <div className="welcome-banner">
        Step Into Smart Studying with UniDesk.
      </div>

      <div className="container">
        <div className="left-panel">
          <img
            className="main-image"
            src="/assets/images/register.gif"
            alt="Register Animation"
          />
        </div>

        <div className="right-panel">
          <div className="logo">
            <img
              src="/assets/images/Logo.png"
              alt="UniDesk Logo"
              className="logo-icon"
            />
          </div>

          <div className="register-box">
            <h2>Register</h2>

            <form autoComplete="off">
              <label>Email Address</label>
              <input type="email" required />

              <label>Roll Number</label>
              <input type="text" required />

              <label>Create Password</label>
              <input type="password" required />

              <label>Confirm Password</label>
              <input type="password" required />

              <button type="submit">Register</button>
            </form>

            <div className="login-link">
              Already have an account?
              <Link to="/login"><u> Login</u></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
