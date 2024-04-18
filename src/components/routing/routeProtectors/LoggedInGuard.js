import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * Guard component to redirect based on authentication status.
 */
export const LoggedInGuard = ({ redirectTo }) => {
  const isAuth = localStorage.getItem("userToken");

  if (!isAuth) {
    return <Navigate to={`/${redirectTo}`} replace />;
  }

  return <Outlet />; // This ensures that nested routes are rendered
};

LoggedInGuard.propTypes = {
  children: PropTypes.node,
  redirectTo: PropTypes.string.isRequired,
};
