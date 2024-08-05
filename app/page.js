"use client";

import React from "react";
import "./App.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import ReactDOM from "react-dom/client";

function Page() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
}

export default Page;
