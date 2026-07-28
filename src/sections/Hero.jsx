import { useState } from "react";
import LandingSplash from "./LandingSplash";
import HoverNav from "../components/layout/HoverNav";

// Home's landing flow — a full-screen 3D splash first (matching the
// reference's turntable + "Enter Experience" pattern), then the
// hover-preview navigation card once you click through. No scroll either
// way; clicking is what moves you from one screen to the other.
function Hero() {
  const [entered, setEntered] = useState(false);

  return entered ? (
    <HoverNav onBack={() => setEntered(false)} />
  ) : (
    <LandingSplash onEnter={() => setEntered(true)} />
  );
}

export default Hero;
