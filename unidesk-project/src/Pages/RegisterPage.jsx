import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./RegisterPage.css";
import "../styles/auth.css";

export function RegisterPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register | UniDesk";
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
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

            <form autoComplete="off" onSubmit={handleLogin}>
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
