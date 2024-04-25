import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.scss";
import App from "./App"; // Assuming App or a separate file wraps the components with <BrowserRouter>

const container = document.getElementById("app");
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
  <React.StrictMode>
    <App tab="home" />
  </React.StrictMode>
);
