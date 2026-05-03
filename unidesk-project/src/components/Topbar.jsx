import { BiBell, BiSearch } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import "./Topbar.css";

export function Topbar() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ subjects: [], files: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);

  const debounceRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await api.get("/api/notifications/unread-count");
        setCount(res.data.count);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCount();
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults({ subjects: [], files: [] });
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setSearching(true);
        const res = await api.get(`/api/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults =
    results.subjects.length > 0 || results.files.length > 0;

  function handleSubjectClick(subject) {
    setShowDropdown(false);
    setQuery("");
    navigate(`/resources/${subject._id}`);
  }

  function handleFileClick(file) {
    setShowDropdown(false);
    setQuery("");
    navigate(`/resources/${file.subject._id}`);
  }

  return (
    <div className="topbar">
      <div className="search-box" ref={dropdownRef}>
        <BiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search for files or subjects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => hasResults && setShowDropdown(true)}
        />

        {showDropdown && (
          <div className="search-dropdown">
            {searching && (
              <div className="search-status">Searching...</div>
            )}

            {!searching && !hasResults && (
              <div className="search-status">No results found</div>
            )}

            {!searching && results.subjects.length > 0 && (
              <div className="search-group">
                <div className="search-group-label">Subjects</div>
                {results.subjects.map((subject) => (
                  <div
                    key={subject._id}
                    className="search-result-item"
                    onClick={() => handleSubjectClick(subject)}
                  >
                    <span className="result-icon">📚</span>
                    <div>
                      <div className="result-name">{subject.subjectName}</div>
                      <div className="result-meta">
                        {subject.branch} · Year {subject.year} · Sem {subject.semester}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!searching && results.files.length > 0 && (
              <div className="search-group">
                <div className="search-group-label">Files</div>
                {results.files.map((file) => (
                  <div
                    key={file._id}
                    className="search-result-item"
                    onClick={() => handleFileClick(file)}
                  >
                    <span className="result-icon">📄</span>
                    <div>
                      <div className="result-name">{file.fileName}</div>
                      <div className="result-meta">
                        {file.subject?.subjectName || "Unknown subject"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="top-icons">
        <div
          className="notification-bell"
          onClick={() => navigate("/notifications")}
        >
          <BiBell />
          {count > 0 && <span className="notif-badge">{count}</span>}
        </div>

        <button className="profile-icon" onClick={() => navigate("/profile")}>
          <CgProfile />
        </button>
      </div>
    </div>
  );
}