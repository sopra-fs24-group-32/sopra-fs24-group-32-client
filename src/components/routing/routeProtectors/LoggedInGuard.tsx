import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface LoggedInGuardProps {
  redirectTo: string;
}

/**
 * Component to protect routes that require authentication
 * If the user is not authenticated, they are redirected to the specified route
 */
export const LoggedInGuard: React.FC<LoggedInGuardProps> = ({ redirectTo }) => {
  // Use the authentication context instead of just Clerk's session
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while authentication is being determined
  if (isLoading) {
    return <div>Loading authentication status...</div>;
  }

  // Redirect if not authenticated, otherwise render child routes
  return isAuthenticated ? <Outlet /> : <Navigate to={`/${redirectTo}`} />;
};