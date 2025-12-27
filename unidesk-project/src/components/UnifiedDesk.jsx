import './UnifiedDesk.css';

export function UnifiedDesk(){
  return (
    <section className="unified-desk-section" id="who">
      <h2>A Unified Desk for everyone</h2>
      <p>
        Whether you&apos;re a student, teacher, or working, UniDesk provides the tools
        you need to succeed.
      </p>

      <div className="categories-grid">
        <div className="category-card">
          <div className="category-icon">👨‍🎓</div>
          <h3>For Students</h3>
          <p>
            Access comprehensive study materials, AI-powered learning
            assistance, and collaborative tools designed to enhance your
            academic journey.
          </p>
        </div>

        <div className="category-card">
          <div className="category-icon">👨‍🏫</div>
          <h3>For Educators</h3>
          <p>
            Create engaging content, track student progress, and utilize
            advanced teaching tools to deliver exceptional educational
            experiences.
          </p>
        </div>

        <div className="category-card">
          <div className="category-icon">💼</div>
          <h3>For Professionals</h3>
          <p>
            Enhance your skills with professional development resources,
            industry insights, and continuous learning opportunities.
          </p>
        </div>
      </div>
    </section>
  );
};

