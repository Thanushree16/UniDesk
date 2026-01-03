/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const SubjectsContext = createContext();

export function SubjectsProvider({ children }) {
  const [subjects, setSubjects] = useState([
    {
      id: "bda",
      subjectName: "Big Data Analytics",
      subjectCode: "BDA",
      year: 4,
      semester: 7,
      files: [
        { id: "f1", name: "Unit-1 Notes.pdf", type: "PDF", size: "2.1 MB" },
        { id: "f2", name: "Unit-1 PPT.ppt", type: "PPT", size: "4.5 MB" },
      ],
    },
    {
      id: "iot",
      subjectName: "Internet Of Things",
      subjectCode: "IOT",
      year: 4,
      semester: 7,
      files: [
        { id: "f3", name: "IoT Basics.pdf", type: "PDF", size: "1.8 MB" },
      ],
    },
  ]);

  return (
    <SubjectsContext.Provider value={{ subjects, setSubjects }}>
      {children}
    </SubjectsContext.Provider>
  );
}

export function useSubjects() {
  return useContext(SubjectsContext);
}
