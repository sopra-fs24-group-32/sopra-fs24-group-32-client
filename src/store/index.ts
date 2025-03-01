import { configureStore } from '@reduxjs/toolkit';
import lobbyReducer from './slices/lobbySlice';
import { combineReducers } from 'redux';
// import gameReducer from './slices/gameSlice';
// import userReducer from './slices/userSlice';
import socketMiddleware, { SOCKET_EVENTS } from './middleware/socket';

// Create a root reducer
const rootReducer = combineReducers({
    lobby: lobbyReducer,
    // user: userReducer,
    // game: gameReducer,
    // Add more reducers here as the application grows
  });

// Configure the Redux store
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore non-serializable values in specific action types
          ignoredActions: [SOCKET_EVENTS.CONNECT],
        },
      }).concat(socketMiddleware),
  });

// Create socket actions
export const socketActions = {
    connect: (token: string) => ({
      type: 'SOCKET_CONNECT',
      payload: { token }
    }),
    disconnect: () => ({
      type: 'SOCKET_DISCONNECT'
    }),
    joinLobby: (lobbyCode: string, password?: string) => ({
      type: 'SOCKET_JOIN_LOBBY',
      payload: { lobbyCode, password }
    }),
    leaveLobby: (lobbyCode: string) => ({
      type: 'SOCKET_LEAVE_LOBBY',
      payload: { lobbyCode }
    }),
    updateSettings: (lobbyCode: string, settings: any) => ({
      type: 'SOCKET_UPDATE_SETTINGS',
      payload: { lobbyCode, settings }
    }),
    startGame: (lobbyCode: string) => ({
      type: 'SOCKET_START_GAME',
      payload: { lobbyCode }
    })
  };
  
// Infer RootState and AppDispatch types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export common hooks for easier imports
export * from './hooks';

// Re-export slices for easier imports
export * from './slices/lobbySlice';

// Single export point for all store-related functionality
export default store;