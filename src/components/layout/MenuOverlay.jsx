import { useEffect, useRef } from "react";
import { useGsap } from "../../hooks/useAnimation";
import { useMenuOverlay } from "../../context/MenuOverlayContext";
import HoverNav from "./HoverNav";
import { cx } from "../../utils/helpers";

// Full-screen modal wrapper around HoverNav for every page except Home,
// where the same panel is shown in-line instead (see sections/Hero.jsx) so
// it's visible immediately with no click needed.
//
// Stays mounted at all times (just toggling opacity/pointer-events) rather
// than mounting on open and unmounting after a fade-out — that avoids the
// whole "two renders to get a real transition frame" dance entirely.
//
// Reads open/close from MenuOverlayContext rather than props — Layout
// mounts this once per page regardless of whether that page shows Navbar
// (hideNavbar), so every page's BackButton can open the same overlay.
function MenuOverlay() {
  const { open, closeMenu: onClose } = useMenuOverlay();
  // Distinguishes "user just closed the menu" from "this is the initial
  // mount, which happens to start closed" — only the former should play the
  // reverse-stagger close animation.
  const hasOpenedOnce = useRef(false);

  useEffect(() => {
    document.body.dataset.menuOpen = open ? "true" : "";
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const scope = useGsap(
    (gsap, root) => {
      const rows = root.querySelectorAll("[data-menu-row]");
      const titles = root.querySelectorAll("[data-row-title]");
      const card = root.querySelector("[data-menu-card]");

      if (open) {
        hasOpenedOnce.current = true;

        gsap.fromTo(
          rows,
          { x: -32, opacity: 0, filter: "blur(6px)" },
          { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, stagger: 0.07, ease: "expo.out", delay: 0.15 }
        );
        // Row titles wipe in left-to-right on top of the row's own fade —
        // a classic text-reveal instead of the title just fading with everything else.
        gsap.fromTo(
          titles,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.75, stagger: 0.07, ease: "power4.out", delay: 0.2 }
        );
        gsap.fromTo(
          card,
          { opacity: 0, y: 24, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "expo.out" }
        );
      } else if (hasOpenedOnce.current) {
        // Choreographed close: rows cascade back out in reverse order
        // (last row first) instead of the whole panel just flatly fading.
        // Kept fast enough (stagger + duration well under 300ms) to fully
        // play out inside the wrapper's own opacity fade below, rather
        // than getting cut off mid-cascade.
        gsap.to(rows, {
          x: -24,
          opacity: 0,
          duration: 0.22,
          stagger: { each: 0.015, from: "end" },
          ease: "power2.in",
        });
        gsap.to(card, { opacity: 0, y: 16, duration: 0.25, ease: "power2.in" });
      }
    },
    [open]
  );

  return (
    <div
      ref={scope}
      aria-hidden={!open}
      className={cx(
        "fixed inset-0 z-[200] transition-opacity duration-300",
        open ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <HoverNav interactive={open} onNavigate={onClose} />

      <button
        onClick={onClose}
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        className="absolute top-6 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-lg backdrop-blur-sm transition-colors hover:bg-white md:top-8 md:right-16"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export default MenuOverlay;
