import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Component to protect login/register routes
 * If the user is already authenticated, they are redirected to the home page
 */
export const LoginGuard: React.FC = () => {
  // Use the authentication context instead of just Clerk's session
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while authentication is being determined
  if (isLoading) {
    return <div>Loading authentication status...</div>;
  }

  // If authenticated redirect to home, otherwise render the login/register page
  return isAuthenticated ? <Navigate to="/home" /> : <Outlet />;
};