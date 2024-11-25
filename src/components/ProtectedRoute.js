import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, children }) {
  if (!user || !user.token) {
    return <Navigate to="/" />;
  }
  return children;
}

export default ProtectedRoute;
