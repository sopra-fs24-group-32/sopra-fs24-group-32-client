import React from "react";
import Header from "./components/views/Header";
import AppRouter from "./components/routing/routers/AppRouter";
import { WebSocketProvider } from "./helpers/WebSocketContext";


/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 * Updated by Marco Leder
 */
const App = () => {
  return (
    <WebSocketProvider>
      <div>
        <Header height="100" />
        <AppRouter />
      </div>
    </WebSocketProvider>
  );
};

export default App;

