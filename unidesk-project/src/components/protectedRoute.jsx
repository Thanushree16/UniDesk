import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
