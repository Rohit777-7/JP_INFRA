import { useGsap } from "../hooks/useAnimation";
import TowerViewer from "../three/TowerViewer";
import { BRAND } from "../utils/constants";

// The very first screen on Home — a live, drag-to-rotate 3D render of the
// towers (not a static photo), project name + tagline, and an "Enter"
// button that reveals the hover-preview navigation underneath.
function LandingSplash({ onEnter }) {
  const scope = useGsap((gsap, root) => {
    gsap.from(root.querySelectorAll("[data-splash-in]"), {
      y: 24,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.1,
      delay: 0.2,
    });
  }, []);

  return (
    <div ref={scope} className="relative h-full w-full overflow-hidden bg-navy-950">
      <TowerViewer />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/10 to-transparent" />

      <p
        data-splash-in
        className="absolute top-24 right-6 text-xs font-semibold tracking-[0.3em] text-white/60 uppercase md:top-28 md:right-16"
      >
        360° · Turntable
      </p>

      <div data-splash-in className="absolute bottom-44 left-1/2 -translate-x-1/2 md:bottom-56">
        <span className="flex items-center gap-2 rounded-full bg-white/90 px-5 py-2.5 text-xs font-semibold tracking-[0.15em] text-navy-900 uppercase shadow-lg">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Drag to Rotate
        </span>
      </div>

      <div data-splash-in className="absolute bottom-10 left-6 md:left-16 3xl:bottom-14">
        <p className="text-xs font-semibold tracking-[0.3em] text-brand-red uppercase 3xl:text-sm">{BRAND.developer}</p>
        <p className="font-display text-6xl text-white md:text-8xl 3xl:text-9xl">{BRAND.project}</p>
        <p className="mt-1 text-sm text-white/60 md:text-base 3xl:text-lg">{BRAND.subline}</p>
      </div>

      <button
        data-splash-in
        onClick={onEnter}
        className="group absolute right-6 bottom-10 flex items-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-semibold tracking-[0.15em] text-navy-900 uppercase shadow-lg transition-transform hover:scale-105 md:right-16 3xl:bottom-14 3xl:px-8 3xl:py-4 3xl:text-sm"
      >
        Enter Experience
        <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export default LandingSplash;
