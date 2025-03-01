import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Header from "./components/layout/Header";
import AppRouter from "./components/routing/routers/AppRouter";
import { WebSocketProvider } from "./helpers/WebSocketContext";
import { AuthProvider } from "./components/context/AuthContext";
import { AuthReduxBridge } from "./components/context/AuthReduxBridge";
import { WebSocketReduxBridge } from "./helpers/WebSocketReduxBridge";
import Footer from "./components/layout/Footer";
import "./App.scss";

/**
 * Main App component that sets up the application with all necessary providers
 * Provider hierarchy:
 * 1. Redux Provider (global state management)
 * 2. WebSocketProvider (real-time communication)
 * 3. BrowserRouter (routing)
 * 4. AuthProvider (authentication)
 * 5. Integration bridges (connecting contexts with Redux)
 */
const App = () => {
  // Define the app content
  const appContent = (
    <WebSocketProvider>
      <BrowserRouter>
        <AuthProvider>
          {/* Bridge components to integrate contexts with Redux */}
          <AuthReduxBridge>
            <WebSocketReduxBridge>
              <div className="app-container">
                <Header />
                <main className="main-content">
                  <AppRouter />
                </main>
                <Footer />
              </div>
            </WebSocketReduxBridge>
          </AuthReduxBridge>
        </AuthProvider>
      </BrowserRouter>
    </WebSocketProvider>
  );

  // Render with children as the third argument to React.createElement
  return React.createElement(
    Provider,
    { store: store },
    appContent
  );
};

export default App;