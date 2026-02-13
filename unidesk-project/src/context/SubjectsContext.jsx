import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const SubjectsContext = createContext();

// eslint-disable-next-line react/prop-types
export function SubjectsProvider({ children }) {
  const [subjects, setSubjects] = useState([]);

  async function fetchSubjects() {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/subjects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formatted = res.data.map((s) => ({
        ...s,
        id: s._id, 
      }));

      setSubjects(formatted);
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  }

  useEffect(() => {
    fetchSubjects();
  }, []);

  async function refreshSubjects() {
    await fetchSubjects();
  }

  return (
    <SubjectsContext.Provider
      value={{
        subjects,
        setSubjects,
        refreshSubjects,
      }}
    >
      {children}
    </SubjectsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSubjects() {
  return useContext(SubjectsContext);
}
