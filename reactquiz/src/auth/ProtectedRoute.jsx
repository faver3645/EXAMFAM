import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>; // eller en spinner

  if (!user) {
    // Ikke logget inn
    return <Navigate to="/login" replace />;
  }

  // Case-insensitiv rolle-sjekk
  const hasAccess = allowedRoles.some(
    (role) => role.toLowerCase() === user.role?.toLowerCase()
  );

  if (!hasAccess) {
    // Rollen har ikke tilgang
    return <Navigate to="/" replace />;
  }

  // Bruker har tilgang
  return <Outlet />;
};

export default ProtectedRoute;
