// Example RequireAuth component
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../Component/hooks/AuthContext";
import Loading from "../Component/Loading/Loading";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading while authentication is being checked
  if (loading) {
    return <Loading />;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute;
