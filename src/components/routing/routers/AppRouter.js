import React from "react";
import { Route, Routes } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import { LoggedInGuard } from "../routeProtectors/LoggedInGuard";
import Login from "../../views/Login"; // Import the wrapper component
import Register from "../../views/Register";
import Home from "../../views/Home";
import LobbyCreate from "../../views/LobbyCreate";
import LobbyHost from "../../views/LobbyHost";
import LobbyJoin from "../../views/LobbyJoin";
import LobbyJoined from "../../views/LobbyJoined";
import GameCreate from "../../views/GameCreate";
import GameGuess from "../../views/GameGuess";
import Scoreboard from "../../views/Scoreboard";
import HomePage from "../../views/HomePage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/user/*" element={<GameGuard />}>
        {/* <Route index element={<Navigate to="" replace />} /> */}
        <Route path="*" element={<GameRouter />} />
      </Route>
      <Route element={<LoggedInGuard redirectTo="login" />}>
        <Route path="/home" element={<Home />} />
        <Route path="/lobby/create" element={<LobbyCreate />} />
        <Route path="/lobby/join" element={<LobbyJoin />} />
        <Route path="/lobby/joined/:id" element={<LobbyJoined />} />
        <Route path="/lobby/host/:id" element={<LobbyHost />} />
        <Route path="/game/create/:id" element={<GameCreate />} />
        <Route path="/game/guess/:id" element={<GameGuess />} />
      </Route>
      <Route path="/game/scoreboard/:id" element={<Scoreboard />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<LoginGuard />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default AppRouter;