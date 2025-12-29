import "./LoginPage.css";
import "../styles/auth.css";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | UniDesk";
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    // later you will add API validation here
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="left-panel">
          <img
            className="main-image"
            src="/assets/images/animated.gif"
            alt="Login Animation"
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

          <div className="login-box">
            <h2>Login</h2>
            <p>Good to see you here again!</p>

            <form autoComplete="off" onSubmit={handleLogin}>
              <label htmlFor="roll">Enter your roll number</label>
              <input type="text" id="roll" required />

              <label htmlFor="password">Enter your password</label>
              <input type="password" id="password" required />

              <div className="options-row">
                <label>
                  <input type="checkbox" /> Stay signed in
                </label>
                <Link to="/forgot">
                  <u>Forgot password?</u>
                </Link>
              </div>

              <button type="submit">Login</button>
            </form>

            <div className="signup-link">
              Don&apos;t have an account?
              <Link to="/register">
                <u>Sign up</u>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
