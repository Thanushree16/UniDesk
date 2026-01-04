import { createContext, useContext, useEffect, useState } from "react";
import { getSubjects, saveSubjects, addFile } from "../services/subjectServices";

const SubjectsContext = createContext();

export function SubjectsProvider({ children }) {
  const [subjects, setSubjects] = useState(() => getSubjects());

  useEffect(() => {
    saveSubjects(subjects);
  }, [subjects]);

  function addFileToSubject(subjectId, file) {
    setSubjects((prev) => addFile(prev, subjectId, file));
  }

  return (
    <SubjectsContext.Provider value={{ subjects, addFileToSubject }}>
      {children}
    </SubjectsContext.Provider>
  );
}

export function useSubjects() {
  return useContext(SubjectsContext);
}
