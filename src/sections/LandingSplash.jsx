import { Suspense, lazy } from "react";
import { useGsap } from "../hooks/useAnimation";
import { useMagnetic } from "../hooks/useMagnetic";
import UtilityBar from "../components/layout/UtilityBar";
import { BRAND } from "../utils/constants";

// Three.js + fiber/drei/postprocessing are the single heaviest slice of the
// whole app's JS. Splitting them into their own chunk lets the background,
// heading, and buttons on this first screen paint immediately instead of
// waiting on that bundle to download and parse — the 3D scene then streams
// in behind the gradient without a visible pop, since the two share the
// same navy backdrop.
const TowerViewer = lazy(() => import("../three/TowerViewer"));

// The very first screen on Home — a live, drag-to-rotate 3D render of the
// towers (not a static photo), project name + tagline, and an "Enter"
// button that reveals the hover-preview navigation underneath.
function LandingSplash({ onEnter }) {
  const enterRef = useMagnetic({ strength: 0.35, scale: 1.06 });

  const scope = useGsap((gsap, root) => {
    const tl = gsap.timeline({ delay: 0.2, defaults: { ease: "expo.out" } });
    tl.from(root.querySelectorAll("[data-splash-in]"), {
      y: 24,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
    }).fromTo(
      root.querySelector("[data-splash-title]"),
      { clipPath: "inset(0 0 100% 0)", opacity: 0, filter: "blur(10px)", scale: 1.04 },
      { clipPath: "inset(0 0 0% 0)", opacity: 1, filter: "blur(0px)", scale: 1, duration: 1.1, ease: "power4.out" },
      "-=0.7"
    );
  }, []);

  return (
    <div
      ref={scope}
      className="relative h-full w-full overflow-hidden bg-navy-950"
    >
      <Suspense fallback={null}>
        <TowerViewer />
      </Suspense>
      <div
        className="pointer-events-none absolute inset-0
bg-gradient-to-t
from-[#12375d]/70
via-[#12375d]/15
to-transparent"
      />
      <p
        data-splash-in
        className="absolute top-24 right-6 text-xs font-semibold tracking-[0.3em] text-white/60 uppercase md:top-28 md:right-16"
      >
        360° · Turntable
      </p>

      <div
        data-splash-in
        className="absolute bottom-44 left-1/2 -translate-x-1/2 md:bottom-56"
      >
        <span className="flex items-center gap-2 rounded-full bg-white/90 px-5 py-2.5 text-xs font-semibold tracking-[0.15em] text-navy-900 uppercase shadow-lg">
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M9 6l-6 6 6 6M15 6l6 6-6 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Drag to Rotate
        </span>
      </div>

      <div
        data-splash-in
        className="absolute bottom-24 left-6 md:left-16 3xl:bottom-28"
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-brand-red uppercase 3xl:text-sm">
          {BRAND.developer}
        </p>
        <p data-splash-title className="font-display text-5xl text-white md:text-7xl 3xl:text-8xl">
          {BRAND.project}
        </p>
        <p className="mt-1 text-sm text-white/60 md:text-base 3xl:text-lg">
          {BRAND.subline}
        </p>
      </div>

      <button
        ref={enterRef}
        data-splash-in
        data-cursor="view"
        onClick={onEnter}
        className="group absolute right-6 bottom-10 flex items-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-semibold tracking-[0.15em] text-navy-900 uppercase shadow-lg transition-shadow duration-300 will-change-transform hover:shadow-[0_12px_40px_-6px_rgba(255,255,255,0.5)] md:right-16 3xl:bottom-14 3xl:px-8 3xl:py-4 3xl:text-sm"
      >
        Enter Experience
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M5 12h14M13 6l6 6-6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <UtilityBar />
    </div>
  );
}

export default LandingSplash;
