import React from "react";
import Header from "./components/layout/Header";
import AppRouter from "./components/routing/routers/AppRouter";
import { WebSocketProvider } from "./helpers/WebSocketContext";
import { AuthProvider } from "./components/context/AuthContext";
import Footer from "components/layout/Footer";
import "./App.scss";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <WebSocketProvider>
      <BrowserRouter>
        <AuthProvider>
          <div className="app-container">
            <Header />
            <main className="main-content">
              <AppRouter />
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </WebSocketProvider>
  );
};

export default App;