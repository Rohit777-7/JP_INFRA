import { useEffect, useRef, useState } from "react";

// Counts up/down to `value` whenever it changes instead of snapping —
// used for the per-category result counts in the Location sidebar.
function AnimatedCounter({ value, duration = 0.6 }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    let start;
    let frame;

    function tick(timestamp) {
      if (start === undefined) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else fromRef.current = to;
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <>{String(display).padStart(2, "0")}</>;
}

export default AnimatedCounter;
