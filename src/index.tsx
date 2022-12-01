import ReactDOM from "react-dom/client";
import "./styles/tailwind.css";
import App from "./App";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
