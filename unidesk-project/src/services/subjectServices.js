const STORAGE_KEY = "unidesk_subjects";

export function getSubjects() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveSubjects(subjects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
}

export function addFile(subjects, subjectId, file) {
  return subjects.map((subject) =>
    subject.id === subjectId
      ? { ...subject, files: [...subject.files, file] }
      : subject
  );
}
