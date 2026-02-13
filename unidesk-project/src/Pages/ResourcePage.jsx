import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdDelete, MdAdd } from "react-icons/md";
import { GiBookshelf } from "react-icons/gi";
import { LeftPanel } from "../components/LeftPanel";
import { Topbar } from "../components/Topbar";
import { useSubjects } from "../context/SubjectsContext";
import toast from "react-hot-toast";
import "./ResourcePage.css";

export function ResourcePage() {
  
  const [searchParams, setSearchParams] = useSearchParams();

  const initialYear = Number(searchParams.get("year")) || 4;
  const initialSem = Number(searchParams.get("semester")) || 7;

  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedSemester, setSelectedSemester] = useState(initialSem);

  useEffect(() => {
    setSearchParams({
      year: selectedYear,
      semester: selectedSemester,
    });
  }, [selectedYear, selectedSemester]);

  const navigate = useNavigate();
  const [fileCounts, setCounts] = useState({});

  const yearSemesterMap = {
    1: [1, 2],
    2: [3, 4],
    3: [5, 6],
    4: [7, 8],
  };


  const { subjects, setSubjects } = useSubjects();

  useEffect(() => {
    async function fetchCounts() {
      try {
        const token = localStorage.getItem("token");

        const countsObj = {};

        await Promise.all(
          subjects.map(async (sub) => {
            const res = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/files/count/${sub._id}`,
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
    // if (!newSubject.subjectName.trim() || !newSubject.subjectCode.trim()) {
    //   toast.error("Please fill all fields");
    //   return;
    // }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/subjects`,
        newSubject,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setShowModal(false);

      // instantly add to UI
      setSubjects((prev) => [...prev, res.data]);

      toast.success("Subject created");
    } catch (err) {
      console.error("Create subject error:",err?.response?.data || err.message);
      toast.error("Creation failed");
    }
  }

  return (
    <div className="dashboard-layout">
      <LeftPanel />

      <main className="main">
        <Topbar />

        <div className="resources-header">
          <div>
            <h1 className="page-title">Subjects</h1>
            <p className="page-subtitle">
              Manage your study materials and subjects
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="add-subject-btn"
          >
            <MdAdd size={20} />
            <span>Add Subject</span>
          </button>
        </div>

        <div className="filter-bar">
          <div className="filter-group">
            <label>Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="filter-select"
            >
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="filter-select"
            >
              {yearSemesterMap[selectedYear].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredSubjects.length > 0 ? (
          <div className="subjects-list">
            {filteredSubjects.map((subject) => (
              <div className="subject-card" key={subject._id}>
                <div
                  className="subject-content"
                  onClick={() =>
                    navigate(
                      `/resources/${subject._id}?year=${selectedYear}&semester=${selectedSemester}`,
                    )
                  }
                >
                  <div className="subject-header">
                    <h3 className="subject-name">{subject.subjectName}</h3>
                    <span className="subject-code">{subject.subjectCode}</span>
                  </div>
                  <div className="subject-footer">
                    <span className="file-count">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <polyline
                          points="13 2 13 9 20 9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {fileCounts[subject._id] || 0}{" "}
                      {fileCounts[subject._id] === 1 ? "File" : "Files"}
                    </span>
                  </div>
                </div>

                <button
                  className="delete-btn"
                  onClick={async (e) => {
                    e.stopPropagation();

                    if (
                      !window.confirm("Delete this subject and all its files?")
                    )
                      return;

                    try {
                      const token = localStorage.getItem("token");

                      await axios.delete(
                        `http://localhost:5000/api/subjects/${subject._id}`,
                        { headers: { Authorization: `Bearer ${token}` } },
                      );

                      setSubjects((prev) =>
                        prev.filter((s) => s._id !== subject._id),
                      );

                      toast.success("Subject deleted");
                    } catch (err) {
                      console.error(err);
                      toast.error("Delete failed");
                    }
                  }}
                >
                  <MdDelete size={25} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <GiBookshelf />
            </div>
            <h3>No subjects found</h3>
            <p>Add your first subject to get started</p>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add New Subject</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Subject Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Data Structures"
                    value={newSubject.subjectName}
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        subjectName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Subject Code</label>
                  <input
                    type="text"
                    placeholder="e.g., DS"
                    value={newSubject.subjectCode}
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        subjectCode: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <select
                      value={newSubject.year}
                      onChange={(e) =>
                        setNewSubject({
                          ...newSubject,
                          year: Number(e.target.value),
                        })
                      }
                    >
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <select
                      value={newSubject.semester}
                      onChange={(e) =>
                        setNewSubject({
                          ...newSubject,
                          semester: Number(e.target.value),
                        })
                      }
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleCreateSubject}
                  disabled={!newSubject.subjectName || !newSubject.subjectCode}
                >
                  Create Subject
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
