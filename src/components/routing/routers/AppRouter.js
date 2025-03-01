import React, { useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import { LoggedInGuard } from "../routeProtectors/LoggedInGuard";
import Login from "../../views/Login";
import Register from "../../views/Register";
import Home from "../../views/Home";
import LobbyHost from "../../views/LobbyHost";
import LobbyJoined from "../../views/LobbyJoined";
import GameGuess from "../../views/GameGuess";
import Scoreboard from "../../views/Scoreboard";
import HomePage from "../../views/HomePage";
import About from "../../About/About";
import { useAuth } from "../../context/AuthContext";
import HomePageAuth from "../../HomePageAuth/HomePageAuth";
import CreateGameLobby from "../../CreateGameLobby/CreateGameLobby";
import JoinLobby from "../../JoinLobby/JoinLobby";
import CreatingGame from "../../CreatingAGame/CreatingGame";
import { socketActions } from "../../../store";
import { useAppDispatch } from "../../../store/hooks";
import LobbyPage from "../../LobbyPage/LobbyPage";

/**
 * Main application router that handles all routes and authentication protection
 * Integrates with Redux for state management and WebSocket connection handling
 */
const AppRouter = () => {
  const { isAuthenticated, isLoading, clerkUser } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Initialize WebSocket connection when authenticated user is available
  useEffect(() => {
    const initializeWebSocket = async () => {
      if (isAuthenticated && clerkUser) {
        try {
          // Get token from your auth service
          const token = await clerkUser.getToken();
          
          // Connect to WebSocket using Redux action
          dispatch(socketActions.connect(token));
          
          // Clean up WebSocket connection on unmount
          return () => {
            dispatch(socketActions.disconnect());
          };
        } catch (error) {
          console.error("Failed to initialize WebSocket connection:", error);
        }
      }
    };
    
    initializeWebSocket();
  }, [isAuthenticated, clerkUser, dispatch]);

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
        <Route path="/lobby/create" element={<CreatingGame />} />
        <Route path="/lobby/join" element={<JoinLobby />} />
        <Route path="/lobby/joined/:id" element={<LobbyJoined />} />
        <Route path="/lobby/waiting-room/:id" element={<LobbyPage />} />
        <Route path="/lobby/host/:id" element={<CreateGameLobby />} />
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