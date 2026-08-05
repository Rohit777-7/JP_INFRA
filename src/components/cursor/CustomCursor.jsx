import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const INTERACTIVE_SELECTOR = "a, button, [role='button'], input, [data-cursor]";

// Premium dot + lagging-ring follower, mounted once at the app root.
// Entirely inert (renders nothing, touches no DOM) on touch devices and
// under prefers-reduced-motion — the native cursor is left alone in both
// cases. Hovering any interactive element (or anything carrying
// data-cursor="view|drag|text") swells the ring and, optionally, shows a
// short label from data-cursor-text.
function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [variant, setVariant] = useState(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");
    return () => document.documentElement.classList.remove("custom-cursor-active");
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let visible = false;

    function show() {
      if (visible) return;
      visible = true;
      gsap.to([dot, ring], { opacity: 1, duration: 0.25, ease: "power2.out" });
    }

    function hide() {
      visible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.2, ease: "power2.in" });
    }

    function onMove(event) {
      show();
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);

      const target = event.target.closest?.(INTERACTIVE_SELECTOR);
      if (target) {
        setVariant(target.dataset.cursor || "hover");
        setLabel(target.dataset.cursorText || "");
      } else {
        setVariant(null);
        setLabel("");
      }
    }

    function onDown() {
      gsap.to(ring, { scale: 0.85, duration: 0.2, ease: "power2.out" });
    }

    function onUp() {
      gsap.to(ring, { scale: 1, duration: 0.3, ease: "power3.out" });
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
    };
  }, [enabled]);

  if (!enabled) return null;

  const isHover = variant === "hover" || variant === "view";
  const isDrag = variant === "drag";
  const isText = variant === "text";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999]">
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-red opacity-0"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border opacity-0 transition-[width,height,background-color,border-color] duration-300 ease-out"
        style={{
          width: isHover || isDrag ? 64 : isText ? 88 : 36,
          height: isHover || isDrag ? 64 : isText ? 88 : 36,
          borderColor: isHover || isDrag ? "rgba(238,49,52,0.7)" : "rgba(255,255,255,0.5)",
          backgroundColor: isHover ? "rgba(238,49,52,0.08)" : "transparent",
          backdropFilter: isText ? "invert(1)" : "none",
        }}
      >
        {label && (
          <span className="text-[10px] font-semibold tracking-[0.2em] text-white uppercase">
            {label}
          </span>
        )}
        {isDrag && !label && (
          <span className="text-[9px] font-semibold tracking-[0.2em] text-white uppercase">Drag</span>
        )}
      </div>
    </div>
  );
}

export default CustomCursor;
