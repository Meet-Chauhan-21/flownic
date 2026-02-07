import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMe } from "../services/authService.js";

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    const validate = async () => {
      try {
        await getMe();
        if (active) {
          setStatus("ok");
        }
      } catch (error) {
        if (active) {
          setStatus("denied");
        }
      }
    };

    validate();

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return <div className="page center">Checking session...</div>;
  }

  if (status === "denied") {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
