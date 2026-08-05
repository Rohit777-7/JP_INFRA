import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaCubes,
  FaImages,
  FaThLarge,
  FaMapMarkerAlt,
  FaFileAlt,
} from "react-icons/fa";
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

// A single, unconditional UtilityBar placement — used identically whether
// this HoverNav is Home's inline card (onBack present) or MenuOverlay's
// full-screen modal on every other page (onBack absent), so opening the
// menu never makes the bar jump to a different spot; it's the same rule
// either way.
//
// Below `lg` this is the same viewport corner it's always been. From `lg`
// up it instead attaches to the menu card itself: `top-full` + `left-1/2
// -translate-x-1/2` position it against the nearest positioned ancestor,
// which is the `lg:relative` wrapper around just the card (see below), not
// the viewport — so it moves with the card, with a flat ~32px gap, at every
// breakpoint from lg up. The `!` (important) variants on the four
// overriding utilities are defensive: without them, this rule and the base
// mobile rule have equal CSS specificity, so if anything else ever
// reorders these utilities' generated rules, the override could silently
// stop winning at lg+.
const MENU_UTILITY_BAR_POSITION = `
  bottom-6 left-4 md:left-10
  lg:!bottom-auto lg:!left-1/2 lg:!top-full lg:!-translate-x-1/2 lg:mt-8
`;

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
          data-cursor="view"
          className="absolute top-24 right-6 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-[0_0_24px_rgba(255,255,255,0.5)] md:top-28 md:right-16 lg:top-24 lg:right-10 lg:h-10 lg:w-10 xl:top-28 xl:right-12 xl:h-11 xl:w-11 2xl:right-16 2xl:h-12 2xl:w-12 3xl:top-32 3xl:right-20 3xl:h-14 3xl:w-14 4xl:top-36 4xl:right-28 4xl:h-16 4xl:w-16"
        >
          <FaHome className="h-4 w-4 lg:h-4 lg:w-4 2xl:h-[18px] 2xl:w-[18px] 3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6" />
        </button>
      )}

      <div className="pointer-events-none absolute inset-0">
        {NAV_LINKS.map((link, i) => (
          <div
            key={link.path}
            className={cx(
              "absolute inset-0 transition-opacity duration-500",
              i === activeIndex ? "opacity-100" : "opacity-0",
            )}
          >
            {/* Only mount the active preview — a live 3D canvas and a map
                iframe sitting in every other page's stack would burn GPU/
                network for no reason while off-screen. */}
            {i === activeIndex && <HoverPreview path={link.path} />}
          </div>
        ))}
      </div>

      <div
        className="
    relative z-10 flex h-full items-center
    px-6 pt-20 pb-6
    md:px-16
    lg:px-10 lg:pt-16 lg:pb-5
    xl:px-12 xl:pt-20 xl:pb-6
    2xl:px-14 2xl:pt-20 2xl:pb-8
    3xl:px-20 3xl:pt-24 3xl:pb-10
    4xl:px-28 4xl:pt-28 4xl:pb-12
  "
      >
        {/* Wraps just the card (not the whole padded row) so that, from lg
            up, the UtilityBar below can be positioned relative to the
            card's own box via top-full/left-1/2 instead of the viewport —
            same wrapper and same UtilityBar regardless of whether this
            HoverNav is Home's inline card or MenuOverlay's modal on every
            other page, so it never jumps position when the menu opens. No
            `relative` below lg — position:static there means the
            absolutely-positioned UtilityBar skips this wrapper and
            resolves against the outer root instead, keeping the existing
            mobile/tablet corner placement. */}
        <div className="lg:relative">
        <TiltCard
          data-menu-card
          className="
    w-72
    sm:w-80
    overflow-hidden
    rounded-[28px]
    border
    border-navy-900/10
    bg-sand-50/95
    backdrop-blur-xl
    shadow-[0_35px_90px_rgba(0,0,0,0.18)]
    lg:w-72 lg:rounded-[24px]
    xl:w-80 xl:rounded-[28px]
    2xl:w-80 2xl:rounded-[28px]
    3xl:w-96 3xl:rounded-[32px]
    4xl:w-[28rem] 4xl:rounded-[36px]
  "
        >
          <nav className="py-2 lg:py-1.5 xl:py-2 2xl:py-2 3xl:py-2.5 4xl:py-3">
            {NAV_LINKS.map((link, i) => {
              const Icon = ICONS[link.path] ?? FaHome;
              const active = i === activeIndex;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  data-menu-row
                  data-cursor="view"
                  data-cursor-text={link.label}
                  tabIndex={interactive ? 0 : -1}
                  onClick={onNavigate}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={() =>
                    cx(
                      "sheen group relative flex items-center gap-3 overflow-hidden px-4 py-2.5 transition-colors",
                      "lg:gap-2.5 lg:px-3.5 lg:py-2",
                      "xl:gap-3 xl:px-4 xl:py-2.5",
                      "2xl:gap-3 2xl:px-4 2xl:py-2.5",
                      "3xl:gap-3.5 3xl:px-5 3xl:py-3",
                      "4xl:gap-4 4xl:px-6 4xl:py-3.5",
                      active && "bg-navy-900/5",
                    )
                  }
                >
                  <span
                    className={cx(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-all duration-300 group-hover:scale-110",
                      "lg:h-8 lg:w-8 xl:h-9 xl:w-9 2xl:h-9 2xl:w-9 3xl:h-10 3xl:w-10 4xl:h-11 4xl:w-11",
                      active
                        ? "bg-navy-700 text-white shadow-[0_0_16px_rgba(41,106,168,0.55)]"
                        : "bg-navy-900/5 text-navy-900/50 group-hover:bg-navy-700/10 group-hover:text-navy-900",
                    )}
                  >
                    <Icon className="h-4 w-4 lg:h-3.5 lg:w-3.5 xl:h-4 xl:w-4 2xl:h-4 2xl:w-4 3xl:h-[18px] 3xl:w-[18px] 4xl:h-5 4xl:w-5" />
                  </span>
                  <span
                    data-row-title
                    className={cx(
                      "flex-1 text-sm font-semibold tracking-wide",
                      "lg:text-xs xl:text-sm 2xl:text-sm 3xl:text-[15px] 4xl:text-base",
                      active ? "text-navy-900" : "text-navy-900/70",
                    )}
                  >
                    {link.label}
                  </span>
                  {active && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-navy-700" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-navy-900/10 p-3 lg:p-2.5 xl:p-3 2xl:p-3 3xl:p-4 4xl:p-5">
            <Button
              href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
              variant="primary"
              className="
      !w-full
      !rounded-2xl
      !py-3
      !text-sm
      !font-semibold
      shadow-lg
      transition-all
      duration-300
      hover:scale-[1.02]
      hover:shadow-xl
      lg:!rounded-xl lg:!py-2.5 lg:!text-xs
      xl:!rounded-2xl xl:!py-3 xl:!text-sm
      2xl:!rounded-2xl 2xl:!py-3 2xl:!text-sm
      3xl:!rounded-2xl 3xl:!py-3.5 3xl:!text-[15px]
      4xl:!rounded-[20px] 4xl:!py-4 4xl:!text-base
    "
            >
              Enquire Now
            </Button>
          </div>
        </TiltCard>

        <UtilityBar position={MENU_UTILITY_BAR_POSITION} />
        </div>
      </div>
    </div>
  );
}

export default HoverNav;
