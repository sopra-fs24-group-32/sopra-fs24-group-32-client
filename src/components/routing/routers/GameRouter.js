import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Game from "../../views/Game";
import UserDetail from "../../views/User";
import UserChange from "../../views/UserChange";

import PropTypes from "prop-types";

const GameRouter = ({ base }) => {
  return (
    <Routes>
      <Route path="dashboard" element={<Game />} />
      <Route path=":id" element={<UserDetail />} />
      <Route path=":id/change" element={<UserChange />} />
      <Route path="/" element={<Game />} />
    </Routes>
  );
};
/*
 * Don't forget to export your component!
 */

GameRouter.propTypes = {
  base: PropTypes.string,
};

export default GameRouter;
