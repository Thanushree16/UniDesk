import api from "../services/api";
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
  const navigate = useNavigate();

  const branches = ["CSE", "IT", "CSE-DS", "AI", "AI-ML", "ECE", "MECH", "EEE"];

  const initialYear = Number(searchParams.get("year")) || 4;
  const initialSem = Number(searchParams.get("semester")) || 7;

  const [branch, setBranch] = useState(branches[0]);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedSemester, setSelectedSemester] = useState(initialSem);
  const [fileCounts, setCounts] = useState({});
  const [showModal, setShowModal] = useState(false);

  const { subjects, setSubjects } = useSubjects();

  const yearSemesterMap = {
    1: [1, 2],
    2: [3, 4],
    3: [5, 6],
    4: [7, 8],
  };

  useEffect(() => {
    setSearchParams({
      year: selectedYear,
      semester: selectedSemester,
    });
  }, [selectedYear, selectedSemester, setSearchParams]);

  useEffect(() => {
    document.title = "Resources | UniDesk";
  }, []);

 
  useEffect(() => {
    async function fetchFilteredSubjects() {
      try {
        const res = await api.get(
          `/api/subjects?branch=${branch}&year=${selectedYear}&semester=${selectedSemester}`,
        );
        setSubjects(res.data);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    }

    if (branch && selectedYear && selectedSemester) {
      fetchFilteredSubjects();
    }
  }, [branch, selectedYear, selectedSemester, setSubjects]);

  
  useEffect(() => {
    async function fetchCounts() {
      try {
        const countsObj = {};

        await Promise.all(
          subjects.map(async (sub) => {
            const res = await api.get(`/api/files/count/${sub._id}`);
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

  const [newSubject, setNewSubject] = useState({
    subjectName: "",
    subjectCode: "",
    branch: branches[0],
    year: 1,
    semester: 1,
  });

  async function handleCreateSubject() {
    try {
      const res = await api.post("/api/subjects", newSubject);

      setShowModal(false);

      const formattedSubject = {
        ...res.data,
        id: res.data._id,
      };

      setSubjects((prev) => [...prev, formattedSubject]);

      setNewSubject({
        subjectName: "",
        subjectCode: "",
        branch: branches[0],
        year: 1,
        semester: 1,
      });

      toast.success("Subject created");
    } catch (err) {
      console.error(
        "Create subject error:",
        err?.response?.data || err.message,
      );
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
            <label>Branch</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="filter-select"
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

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

        {subjects.length > 0 ? (
          <div className="subjects-list">
            {subjects.map((subject) => (
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
                      await api.delete(`/api/subjects/${subject._id}`);
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
                  <select
                    value={newSubject.branch}
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        branch: e.target.value,
                      })
                    }
                  >
                    {branches.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>

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
