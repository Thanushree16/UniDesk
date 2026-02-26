import { PiStudentBold } from "react-icons/pi";
import './UnifiedDesk.css';

export function UnifiedDesk(){
  return (
    <section className="unified-desk-section" id="who">
      <h2>A Unified Desk for every student</h2>
      <p>
        Designed for students, UniDesk helps you organize, manage, and access all your academic resources in one place.
      </p>

      <div className="categories-grid">
        <div className="category-card">
          <div className="category-icon">
            <PiStudentBold />
          </div>
          <h3>For Students</h3>
          <p>
            Access comprehensive study materials, AI-powered learning
            assistance, and collaborative tools designed to enhance your
            academic journey.
          </p>
        </div>


        
      </div>
    </section>
  );
};

