import { useEffect } from "react";
import { useGsap } from "../../hooks/useAnimation";
import HoverNav from "./HoverNav";
import { cx } from "../../utils/helpers";

// Full-screen modal wrapper around HoverNav for every page except Home,
// where the same panel is shown in-line instead (see sections/Hero.jsx) so
// it's visible immediately with no click needed.
//
// Stays mounted at all times (just toggling opacity/pointer-events) rather
// than mounting on open and unmounting after a fade-out — that avoids the
// whole "two renders to get a real transition frame" dance entirely.
function MenuOverlay({ open, onClose }) {
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
      if (!open) return;
      gsap.from(root.querySelectorAll("[data-menu-row]"), {
        x: -24,
        opacity: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.15,
      });
      gsap.from(root.querySelector("[data-menu-card]"), {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: "power3.out",
      });
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
