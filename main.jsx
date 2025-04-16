import React from "react";
import ReactDOM from "react-dom/client";
import ChatUI from "./ChatUI.jsx";

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ChatUI />
  </React.StrictMode>
);