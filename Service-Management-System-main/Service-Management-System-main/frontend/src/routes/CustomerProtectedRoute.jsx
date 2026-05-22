import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function CustomerProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or spinner
  }

  if (!user) {
    return <Navigate to="/customer/login" replace />;
  }

  if (user.role !== "CUSTOMER") {
    return <Navigate to="/" replace />;
  }

  return children;
}
