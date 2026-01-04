import { RiRobot2Line, RiFilePaper2Fill } from "react-icons/ri";
import { FaFolder } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

import './HowItWorks.css';

export function HowItWorks () {
  return (
    <section className="future-learning-section" id="how">
      <h2>How UniDesk Works</h2>

      <div className="how-it-works-content">
        <p className="how-description">
          UniDesk is a comprehensive platform designed for university students
          to organize, share, and study their academic materials efficiently.
          Our AI-powered system helps you maximize your learning potential.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaFolder />
            </div>
            <h3>Upload & Organize</h3>
            <p>
              Students can easily upload PDFs, notes, PPTs, and other study
              materials organized by branches and semesters.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <RiRobot2Line />
            </div>
            <h3>AI-Powered Assistant</h3>
            <p>
              Get instant summaries, practice questions, and personalized study
              recommendations.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-icon">
              <RiFilePaper2Fill />
            </div>
            <h3>Exam Preparation</h3>
            <p>
              Generate quizzes, summaries, and AI-based exam questions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaSearch />
            </div>
            <h3>Smart Search</h3>
            <p>
              Search across all uploaded materials with intelligent filtering.
            </p>
          </div>

          
        </div>
      </div>
    </section>
  );
};


