import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  clearAccessToken,
  getAccessToken,
  isAccessTokenExpired,
  refreshAccessToken,
} from "../utils/tokenStorage";

function ProtectedRoute({ children, redirectTo }) {
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      const token = getAccessToken();

      if (!token) {
        setIsAuthenticated(false);
        setIsReady(true);
        return;
      }

      if (isAccessTokenExpired(token)) {
        try {
          await refreshAccessToken();
          setIsAuthenticated(true);
        } catch (error) {
          clearAccessToken();
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(true);
      }

      setIsReady(true);
    };

    validateSession();
  }, []);

  if (!isReady) {
    return null;
  }

  if (!isAuthenticated) {
    const fallback = location.pathname.startsWith("/student")
      ? "/student/login"
      : "/admin/login";
    return <Navigate to={redirectTo || fallback} replace />;
  }

  return children;
}

export default ProtectedRoute;
