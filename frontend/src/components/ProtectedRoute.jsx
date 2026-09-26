import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// role: optional, "student" | "recruiter" — restricts the route to that role
export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}