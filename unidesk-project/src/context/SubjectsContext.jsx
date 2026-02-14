import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const SubjectsContext = createContext();

// eslint-disable-next-line react/prop-types
export function SubjectsProvider({ children }) {
  const [subjects, setSubjects] = useState([]);

  async function fetchSubjects() {
    try {

      const res = await api.get("/api/subjects");

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
