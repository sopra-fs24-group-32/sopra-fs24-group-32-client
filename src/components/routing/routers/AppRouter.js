import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import { LoggedInGuard } from "../routeProtectors/LoggedInGuard";
import Login from "../../views/Login";
import Register from "../../views/Register";
import Home from "../../views/Home";
import LobbyCreate from "../../views/LobbyCreate";
import LobbyHost from "../../views/LobbyHost";
import LobbyJoin from "../../views/LobbyJoin";
import LobbyJoined from "../../views/LobbyJoined";
import GameCreate from "../../views/GameCreate";
import GameGuess from "../../views/GameGuess";
import Scoreboard from "../../views/Scoreboard";
import Header from "../../views/Header";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Header height="100" />
      <Routes>
        <Route path="/game/*" element={<GameGuard />}>
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

        <Route path="/login" element={<LoginGuard />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

/*
 * Don't forget to export your component!
 */
export default AppRouter;
