import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeftPanel } from "../components/LeftPanel";
import { Topbar } from "../components/Topbar";
import { useSubjects } from "../context/SubjectsContext";
import "./ResourcePage.css";

export function ResourcePage() {
  const navigate = useNavigate();
  const [fileCounts, setCounts] = useState({});

  //Year and semester array
  const yearSemesterMap = {
    1: [1, 2],
    2: [3, 4],
    3: [5, 6],
    4: [7, 8],
  };

  //Year and semester selected
  const [selectedYear, setSelectedYear] = useState(4);
  const [selectedSemester, setSelectedSemester] = useState(
    yearSemesterMap[4][0],
  );

  // Subject data - updated soon
  const { subjects } = useSubjects();

  // Auto reset of the semester, when the year is changed
  useEffect(() => {
    setSelectedSemester(yearSemesterMap[selectedYear][0]);
  }, [selectedYear]);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const token = localStorage.getItem("token");

        const countsObj = {};

        await Promise.all(
          subjects.map(async (sub) => {
            const res = await axios.get(
              `http://localhost:5000/api/files/count/${sub._id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );

            countsObj[sub._id] = res.data.count;
          }),
        );

        setCounts(countsObj);
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    }

    if (subjects.length) fetchCounts();
  }, [subjects]);

  //Filtering the subjects according to the selected year and semester
  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.year === selectedYear && subject.semester === selectedSemester,
  );

  useEffect(() => {
    document.title = "Resources | UniDesk";
  }, []);

  const [showModal, setShowModal] = useState(false);

  const [newSubject, setNewSubject] = useState({
    subjectName: "",
    subjectCode: "",
    year: 4,
    semester: 7,
  });

  async function handleCreateSubject() {
    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/subjects", newSubject, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowModal(false);
      window.location.reload(); // simple refresh for now
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="dashboard-layout">
      <LeftPanel />

      <main className="main">
        <Topbar />
        <div className="filter-bar">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            <option value={1}>1st Year</option>
            <option value={2}>2nd Year</option>
            <option value={3}>3rd Year</option>
            <option value={4}>4th Year</option>
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
          >
            {yearSemesterMap[selectedYear].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 className="subject-title">Subjects</h2>

          <button
            onClick={() => setShowModal(true)}
            className="add-subject-btn"
          >
            Add Subject
          </button>
        </div>

        {/* List of Subjects to appear according to selected details*/}
        <div className="subjects-grid">
          {(filteredSubjects || []).map((subject) => (
            <div className="subject-wrapper" key={subject._id}>
              <div
                className="subject-card"
                onClick={() => navigate(`/resources/${subject._id}`)}
              >
                <div className="file-count">
                  {fileCounts[subject._id] || 0} Files
                </div>
                <div className="subject-code">{subject.subjectCode}</div>
                <div className="subject-strip"></div>
              </div>
              <p className="subject-name">{subject.subjectName}</p>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add Subject</h3>

              <input
                placeholder="Subject Name"
                onChange={(e) =>
                  setNewSubject({ ...newSubject, subjectName: e.target.value })
                }
              />

              <input
                placeholder="Subject Code"
                onChange={(e) =>
                  setNewSubject({ ...newSubject, subjectCode: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Year"
                onChange={(e) =>
                  setNewSubject({ ...newSubject, year: Number(e.target.value) })
                }
              />

              <input
                type="number"
                placeholder="Semester"
                onChange={(e) =>
                  setNewSubject({
                    ...newSubject,
                    semester: Number(e.target.value),
                  })
                }
              />

              <button onClick={handleCreateSubject}>Create</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
