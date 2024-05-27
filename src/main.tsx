import "./index.css";
import { ChatApp } from "./ChatApp";
import React from "react";
import ReactDOM from "react-dom/client";
import "react-big-calendar/lib/css/react-big-calendar.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChatApp />
  </React.StrictMode>
);
