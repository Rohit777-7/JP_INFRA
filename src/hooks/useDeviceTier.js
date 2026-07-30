import { useEffect, useState } from "react";

const LOW_TIER_MAX_WIDTH = 767; // just under Tailwind's md breakpoint

function computeTier() {
  if (typeof window === "undefined") {
    return { tier: "high", isNarrow: false, prefersReducedMotion: false };
  }
  const isNarrow = window.matchMedia(`(max-width: ${LOW_TIER_MAX_WIDTH}px)`).matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return { tier: isNarrow || prefersReducedMotion ? "low" : "high", isNarrow, prefersReducedMotion };
}

// Single shared perf-tier signal for the whole app — gates expensive 3D
// rendering (postprocessing, reflections, shadows) on narrow/reduced-motion
// devices, and is meant to be reused by future scroll/animation-heavy pages
// rather than each one re-deriving its own thresholds.
export function useDeviceTier() {
  const [state, setState] = useState(computeTier);

  useEffect(() => {
    const widthQuery = window.matchMedia(`(max-width: ${LOW_TIER_MAX_WIDTH}px)`);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setState(computeTier());
    widthQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);
    return () => {
      widthQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  return state;
}
