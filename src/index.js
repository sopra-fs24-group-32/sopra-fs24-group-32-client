import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.scss";
import App from "./App"; 
import { ClerkProvider } from '@clerk/clerk-react'

const container = document.getElementById("app");
const root = createRoot(container); 

const PUBLISHABLE_KEY=process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>,
);
