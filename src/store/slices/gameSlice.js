// src/store/slices/gameSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, handleError } from '../../helpers/api';
import AuthService from '../../services/authService';

const initialState = {
  gameStatus: 'idle', // 'idle' | 'starting' | 'active' | 'round_end' | 'game_end' | 'error'
  currentRound: 0,
  totalRounds: 0,
  currentPlayer: null,
  timeRemaining: 0,
  prompt: '',
  imageUrl: '',
  playerGuesses: {},
  scores: {},
  error: null,
};

export const submitPrompt = createAsyncThunk(
  'game/submitPrompt',
  async (prompt, { getState, rejectWithValue }) => {
    try {
      const { lobby } = getState();
      const token = await AuthService.getSessionToken();
      
      const response = await api.post(`/games/${lobby.lobbyCode}/prompt`, { prompt }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return {
        prompt,
        imageUrl: response.data.imageUrl
      };
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const submitGuess = createAsyncThunk(
  'game/submitGuess',
  async (guess, { getState, rejectWithValue }) => {
    try {
      const { lobby } = getState();
      const token = await AuthService.getSessionToken();
      
      const response = await api.post(`/games/${lobby.lobbyCode}/guess`, { guess }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    resetGameState: () => initialState,
    setGameError: (state, action) => {
      state.error = action.payload;
      state.gameStatus = 'error';
    },
    clearGameError: (state) => {
      state.error = null;
    },
    startRound: (state, action) => {
      const { currentRound, currentPlayer, timeRemaining } = action.payload;
      state.gameStatus = 'active';
      state.currentRound = currentRound;
      state.currentPlayer = currentPlayer;
      state.timeRemaining = timeRemaining;
      state.prompt = '';
      state.imageUrl = '';
      state.playerGuesses = {};
    },
    updateTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    receiveGuess: (state, action) => {
      const { playerId, guess } = action.payload;
      state.playerGuesses[playerId] = guess;
    },
    endRound: (state, action) => {
      state.gameStatus = 'round_end';
      state.scores = { ...state.scores, ...action.payload.scores };
    },
    endGame: (state, action) => {
      state.gameStatus = 'game_end';
      state.scores = action.payload.finalScores;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Prompt Cases
      .addCase(submitPrompt.fulfilled, (state, action) => {
        state.prompt = action.payload.prompt;
        state.imageUrl = action.payload.imageUrl;
      })
      .addCase(submitPrompt.rejected, (state, action) => {
        state.error = action.payload || 'Failed to generate image from prompt';
      })
      
      // Submit Guess Cases
      .addCase(submitGuess.fulfilled, (state, action) => {
        // This would typically be handled via WebSockets for all players
        // But for now we'll update the local state
        const { playerId, guess } = action.payload;
        state.playerGuesses[playerId] = guess;
      })
      .addCase(submitGuess.rejected, (state, action) => {
        state.error = action.payload || 'Failed to submit guess';
      });
  },
});

export const {
  resetGameState,
  setGameError,
  clearGameError,
  startRound,
  updateTimeRemaining,
  receiveGuess,
  endRound,
  endGame
} = gameSlice.actions;

export default gameSlice.reducer;