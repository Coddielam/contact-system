import ReactDOM from "react-dom/client";
import "./styles/tailwind.css";
import App from "./App";
import React from "react";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
