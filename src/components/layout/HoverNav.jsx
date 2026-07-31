import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaCubes, FaImages, FaThLarge, FaMapMarkerAlt, FaFileAlt } from "react-icons/fa";
import Button from "../ui/Button";
import UtilityBar from "./UtilityBar";
import { NAV_LINKS, BRAND } from "../../utils/constants";
import { cx } from "../../utils/helpers";
import { useMouse } from "../../hooks/useMouse";
import { useDeviceTier } from "../../hooks/useDeviceTier";
import HoverPreview from "./HoverPreviews";

const ICONS = {
  "/": FaHome,
  "/showcase": FaCubes,
  "/gallery": FaImages,
  "/floor-plan": FaThLarge,
  "/location": FaMapMarkerAlt,
  "/brochure": FaFileAlt,
};

// Wraps just the nav card (not the rest of HoverNav — the live preview
// behind it, e.g. the ShowcasePreview 3D canvas, shouldn't re-render on
// every pointer move) so the card tilts slightly toward the cursor for a
// soft premium depth feel. Skipped for prefers-reduced-motion.
function TiltCard({ children, className, ...rest }) {
  const { x, y } = useMouse();
  const { prefersReducedMotion } = useDeviceTier();
  const rotateX = prefersReducedMotion ? 0 : -y * 4;
  const rotateY = prefersReducedMotion ? 0 : x * 4;

  return (
    <div
      className={className}
      style={{
        transform: `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 300ms ease-out",
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

// Shared visual for the hover-preview navigation: hovering a link shows that
// page's actual content full-bleed behind the card — real gallery photos,
// the real floor plate, the real map — so hovering alone is enough to see
// what's there, no click required. Clicking a row still navigates into the
// full page. Used both in-line as Home's hero (always visible, no click
// needed to open it) and inside MenuOverlay's full-screen modal chrome on
// every other page.
//
// onBack, when provided, shows a small circular button (matching the
// reference's home icon) that returns to whatever came before this screen —
// Home uses it to go back to the landing splash.
function HoverNav({ interactive = true, onNavigate, onBack, className = "" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={cx("relative h-full w-full overflow-hidden", className)}>
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back to landing"
          className="absolute top-24 right-6 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-lg backdrop-blur-sm transition-colors hover:bg-white md:top-28 md:right-16"
        >
          <FaHome className="h-4 w-4" />
        </button>
      )}

      <div className="pointer-events-none absolute inset-0">
        {NAV_LINKS.map((link, i) => (
          <div
            key={link.path}
            className={cx(
              "absolute inset-0 transition-opacity duration-500",
              i === activeIndex ? "opacity-100" : "opacity-0"
            )}
          >
            {/* Only mount the active preview — a live 3D canvas and a map
                iframe sitting in every other page's stack would burn GPU/
                network for no reason while off-screen. */}
            {i === activeIndex && <HoverPreview path={link.path} />}
          </div>
        ))}
      </div>

      <div className="relative z-10 flex h-full items-center px-6 pt-20 pb-6 md:px-16">
        <TiltCard
          data-menu-card
          className="w-72 border border-navy-900/10 bg-sand-50/95 shadow-2xl backdrop-blur-md sm:w-80 3xl:w-96"
        >
          <nav className="py-2">
            {NAV_LINKS.map((link, i) => {
              const Icon = ICONS[link.path] ?? FaHome;
              const active = i === activeIndex;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  data-menu-row
                  tabIndex={interactive ? 0 : -1}
                  onClick={onNavigate}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={() => cx("group flex items-center gap-3 px-4 py-2.5 transition-colors", active && "bg-navy-900/5")}
                >
                  <span
                    className={cx(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors",
                      active ? "bg-navy-700 text-white" : "bg-navy-900/5 text-navy-900/50 group-hover:text-navy-900"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span
                    data-row-title
                    className={cx("flex-1 text-sm font-semibold tracking-wide", active ? "text-navy-900" : "text-navy-900/70")}
                  >
                    {link.label}
                  </span>
                  {active && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-navy-700" />}
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-navy-900/10 p-3">
            <Button href={`tel:${BRAND.phone.replace(/\s/g, "")}`} variant="primary" className="!w-full !py-2.5 text-xs">
              Enquire Now
            </Button>
          </div>
        </TiltCard>
      </div>

      <UtilityBar />
    </div>
  );
}

export default HoverNav;
