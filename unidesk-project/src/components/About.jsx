import "./About.css";

export function About() {
  return (
    <section className="main-card-section" id="about">
      <div className="main-card">
        <div className="card-content">
          <div className="card-left">
            <h2>About UniDesk</h2>
            <p>
              UniDesk is a smart study hub that lets students seamlessly
              organize notes, PDFs, and presentations, streamline exam prep, and
              stay on track with structured tools for efficient learning
            </p>

            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">🤖</span>
                <span>Study smarter, all in one place</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📚</span>
                <span>Interactive Digital Library</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📈</span>
                <span>AI-Powered Study Assistant</span>
              </div>
            </div>
          </div>

          <div className="card-right">
            <div className="robot-container">
              <img
                src="/assets/images/Robot.png"
                alt="UniDesk Robot"
                className="robot-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
