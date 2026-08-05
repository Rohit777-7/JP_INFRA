import React from "react";
import ReactDOM from "react-dom/client";
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/cursor/CustomCursor";
import App from "./App";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SmoothScroll />
    <CustomCursor />
    <App />
  </React.StrictMode>
);