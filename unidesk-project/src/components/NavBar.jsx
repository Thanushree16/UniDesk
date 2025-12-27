import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

export function NavBar() {

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById("navbar");
      if (!navbar) return;

      if (window.scrollY > 100) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="navbar" id="navbar">
      <div className="logo">
        <img src="/assets/images/Logo.png" alt="UniDesk Logo" />
        <span>UniDesk</span>
      </div>

      <nav className="nav-links">
        <a href="#about">About Us</a>
        <a href="#who">Who it&apos;s for</a>
        <a href="#how">How it works</a>
      </nav>

      <div className="nav-buttons">
        <Link to="/login" className="btn login">Login</Link>
        <Link to="/register" className="btn register">Register Now</Link>
      </div>
    </header>
  );
}
