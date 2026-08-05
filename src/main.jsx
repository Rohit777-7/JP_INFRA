import React from "react";
import ReactDOM from "react-dom/client";
import CustomCursor from "./components/cursor/CustomCursor";
import App from "./App";
import "./styles/globals.css";

// No Lenis/SmoothScroll: every page in this app is a fixed h-screen
// overflow-hidden view (no page ever scrolls the window), so it was just a
// requestAnimationFrame loop running forever with nothing to actually
// smooth-scroll — pure continuous main-thread cost competing with the
// custom cursor, GSAP, and Framer Motion animations that ARE doing
// something on every frame.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CustomCursor />
    <App />
  </React.StrictMode>
);