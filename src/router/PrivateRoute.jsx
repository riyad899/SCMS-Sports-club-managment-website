// Example RequireAuth component
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Component/hooks/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login and save current location in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute;
