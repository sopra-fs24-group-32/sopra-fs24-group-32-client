import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import { LoggedInGuard } from "../routeProtectors/LoggedInGuard";
import Login from "../../views/Login";
import Register from "../../views/Register";
import Home from "../../views/Home";
import LobbyHost from "../../views/LobbyHost";
import LobbyJoined from "../../views/LobbyJoined";
import GameCreate from "../../views/GameCreate";
import GameGuess from "../../views/GameGuess";
import Scoreboard from "../../views/Scoreboard";
import HomePage from "../../views/HomePage";
import About from "../../About/About";
import { useAuth } from "../../context/AuthContext";
import HomePageAuth from "../../HomePageAuth/HomePageAuth";
import CreateGameLobby from "../../CreateGameLobby/CreateGameLobby";
import JoinLobby from "../../JoinLobby/JoinLobby";

const AppRouter = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading indicator while auth state is being determined
  if (isLoading) {
    return <div className="auth-loading">Loading authentication...</div>;
  }

  return (
    <Routes>
      <Route path="/user/*" element={<GameGuard />}>
        <Route path="*" element={<GameRouter />} />
      </Route>
      <Route path="/about" element={<About />} />
      <Route element={<LoggedInGuard redirectTo="login" />}>
        <Route path="/home" element={<HomePageAuth />} />
        <Route path="/lobby/create" element={<CreateGameLobby />} />
        <Route path="/lobby/join" element={<JoinLobby />} />
        <Route path="/lobby/joined/:id" element={<LobbyJoined />} />
        <Route path="/lobby/host/:id" element={<LobbyHost />} />
        <Route path="/game/create/:id" element={<GameCreate />} />
        <Route path="/game/guess/:id" element={<GameGuess />} />
      </Route>
      <Route path="/game/scoreboard/:id" element={<Scoreboard />} />
      
      {/* Conditional rendering for authenticated users */}
      <Route 
        path="/home" 
        element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
      />
      
      <Route path="/login" element={<LoginGuard />}>
        <Route path="/login" element={<Login />} />
      </Route>
      
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default AppRouter;