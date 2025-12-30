import { useEffect, useState } from "react";
import { LeftPanel } from "../components/LeftPanel";
import { Topbar } from "../components/Topbar";
import "./ResourcePage.css";


export function ResourcePage() {
  {/*Year and semester array */}
  const yearSemesterMap = {
    1: [1, 2],
    2: [3, 4],
    3: [5, 6],
    4: [7, 8],
  };

  {/*Year and semester selected*/}
  const [selectedYear, setSelectedYear] = useState(4);
  const [selectedSemester, setSelectedSemester] = useState(
    yearSemesterMap[4][0]
  );

  {/* Subject data - updated soon*/}
  const [subjects, setSubjects] = useState([
    {
      subjectName: "Big Data Analytics",
      subjectCode: "BDA",
      id: crypto.randomUUID(),
      year: 4,
      semester: 7,
      files: 4,
    },
    {
      subjectName: "Internet Of Things",
      subjectCode: "IOT",
      id: crypto.randomUUID(),
      year: 4,
      semester: 7,
      files: 4,
    },
    {
      subjectName: "Natural Language Processing",
      subjectCode: "NLP",
      id: crypto.randomUUID(),
      year: 4,
      semester: 7,
      files: 4,
    },
    {
      subjectName: "Cloud Computing & Security",
      subjectCode: "CC&S",
      id: crypto.randomUUID(),
      year: 4,
      semester: 7,
      files: 4,
    },
    {
      subjectName: "Fundamentals Of Entrepreneurship",
      subjectCode: "FE",
      id: crypto.randomUUID(),
      year: 4,
      semester: 7,
      files: 4,
    },
  ]);

  {/* Auto reset of the semester, when the year is changed*/}
  useEffect(() => {
    setSelectedSemester(yearSemesterMap[selectedYear][0]);
  }, [selectedYear]);

  {/* Filtering the subjects according to the selected year and semester*/}
  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.year === selectedYear && 
      subject.semester === selectedSemester
  );


  useEffect(() => {
    document.title = "Resources | UniDesk";
  }, []);

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

        <h2 className="subject-title">Subjects</h2>

        {/* List of Subjects to appear according to selected details*/}
        <div className="subjects-grid">
          {filteredSubjects.map((subject) => (
            <div className="subject-wrapper" key={subject.id}>
              <div className="subject-card">
                <div className="file-count">{subject.files}Files</div>
                <div className="subject-code">{subject.subjectCode}</div>
                <div className="subject-strip"></div>
              </div>
              <p className="subject-name">{subject.subjectName}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
