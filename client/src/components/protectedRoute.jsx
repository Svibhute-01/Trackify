import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role && userRaw) {
    try {
      const user = JSON.parse(userRaw);
      if (user.role !== role) {
        return <Navigate to="/login" />;
      }
    } catch {
      return <Navigate to="/login" />;
    }
  }

  return children;
};

export default ProtectedRoute;
