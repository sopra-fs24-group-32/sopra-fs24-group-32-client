// src/store/lobbySlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for the lobby state
export interface Player {
  id: string;
  username: string;
  isHost: boolean;
  isReady: boolean;
  avatarUrl?: string;
}

export interface LobbyState {
  lobbyCode: string;
  lobbyName: string;
  numberOfRounds: number;
  timeLimit: number;
  maxPlayers: number;
  isPrivate: boolean;
  password?: string;
  difficulty: "easy" | "medium" | "hard";
  gameSettings: string[];
  players: Player[];
  isLoading: boolean;
  error: string | null;
}

// Define initial state
const initialState: LobbyState = {
  lobbyCode: "",
  lobbyName: "",
  numberOfRounds: 3,
  timeLimit: 60,
  maxPlayers: 4,
  isPrivate: false,
  difficulty: "medium",
  gameSettings: ["standard"],
  players: [],
  isLoading: false,
  error: null
};

// Create the lobby slice
const lobbySlice = createSlice({
  name: "Lobby",
  initialState,
  reducers: {
    // Setting lobby details from form data
    setLobbyDetails: (state, action: PayloadAction<{
      lobbyName: string;
      numberOfRounds: number;
      timeLimit: number;
      maxPlayers: number;
      isPrivate: boolean;
      password?: string;
      difficulty: "easy" | "medium" | "hard";
      gameSettings: string[];
    }>) => {
      return {
        ...state,
        ...action.payload
      };
    },
    
    // Set lobby code (typically set after lobby creation)
    setLobbyCode: (state, action: PayloadAction<string>) => {
      state.lobbyCode = action.payload;
    },
    
    // Add player to the lobby
    addPlayer: (state, action: PayloadAction<Player>) => {
      // Check if player already exists
      const playerExists = state.players.some(player => player.id === action.payload.id);
      if (!playerExists) {
        state.players.push(action.payload);
      }
    },
    
    // Remove player from the lobby
    removePlayer: (state, action: PayloadAction<string>) => {
      state.players = state.players.filter(player => player.id !== action.payload);
    },
    
    // Update player ready status
    updatePlayerReadyStatus: (state, action: PayloadAction<{ playerId: string; isReady: boolean }>) => {
      const player = state.players.find(player => player.id === action.payload.playerId);
      if (player) {
        player.isReady = action.payload.isReady;
      }
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Set error message
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Reset the lobby state
    resetLobby: () => initialState
  }
});

// Export actions and reducer
export const { 
  setLobbyDetails, 
  setLobbyCode, 
  addPlayer, 
  removePlayer, 
  updatePlayerReadyStatus, 
  setLoading, 
  setError, 
  resetLobby 
} = lobbySlice.actions;

export default lobbySlice.reducer;