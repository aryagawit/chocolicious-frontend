import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import "../styles/protected.css";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="protected-wrapper">
        <div className="protected-card">
          <h2>Please login first 🔒</h2>
          <p>You must be logged in to access checkout.</p>
          <Navigate to="/login" replace />
        </div>
      </div>
    );
  }

  return children;
}
