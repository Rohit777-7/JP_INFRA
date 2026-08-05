import { useEffect, useRef } from "react";
import gsap from "gsap";

// Pointer-attraction hover: the element eases toward the cursor while
// hovered (capped by `strength`) and springs back to rest on leave. Used on
// primary CTAs/cards rather than every small icon button — see useDeviceTier
// for the broader low-tier gate this respects.
//
// No-ops entirely on coarse pointers (touch) or prefers-reduced-motion, so
// it never fights tap targets on mobile.
export function useMagnetic({ strength = 0.35, scale = 1.04 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const scaleTo = gsap.quickTo(el, "scale", { duration: 0.4, ease: "power3.out" });

    function onMove(event) {
      const rect = el.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    }

    function onEnter() {
      scaleTo(scale);
    }

    function onLeave() {
      xTo(0);
      yTo(0);
      scaleTo(1);
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      gsap.set(el, { x: 0, y: 0, scale: 1 });
    };
  }, [strength, scale]);

  return ref;
}
