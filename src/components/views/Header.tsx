import React from "react";
import { ReactLogo } from "../ui/ReactLogo";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../../styles/views/Header.scss";

const Header = (props) => {
  const navigate = useNavigate();

  const navigateToUser = () => {
    const id = localStorage.getItem("id");
    navigate(`/game/${id}`);
  };

  return (
    <div className="header container" style={{ height: props.height }}>
      <button
        className="header-button back-button"
        onClick={() => navigate(-1)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 back-arrow"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
        Back
      </button>
      <h1 onClick={() => navigate("/home")} className="header title">
        GPTuesser
      </h1>
      <button
        className="header-button profile-button"
        onClick={() => navigateToUser()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 user-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </button>
    </div>
  );
};

Header.propTypes = {
  height: PropTypes.string,
};

export default Header;
