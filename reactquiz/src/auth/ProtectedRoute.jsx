import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = allowedRoles.some(
    (role) => role.toLowerCase() === user.role?.toLowerCase()
  );

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
