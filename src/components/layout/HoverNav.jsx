import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import Logo from "../common/Logo";
import { NAV_LINKS, BRAND } from "../../utils/constants";
import { TOWERS } from "../../data/floors";
import { cx } from "../../utils/helpers";
import HoverPreview from "./HoverPreviews";

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
          className="absolute top-16 right-6 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-lg backdrop-blur-sm transition-colors hover:bg-white md:top-20 md:right-16"
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
        <div
          data-menu-card
          className="w-full max-w-md border border-white/40 bg-sand-50/95 shadow-2xl backdrop-blur-md xl:max-w-lg 3xl:max-w-xl 4xl:max-w-2xl"
        >
          <div className="flex items-center justify-between gap-4 border-b border-navy-900/10 px-7 py-6 3xl:px-8 3xl:py-7">
            <Logo />
            <div className="text-right">
              <p className="font-display text-2xl leading-none text-navy-900 3xl:text-3xl">{BRAND.project}</p>
              <p className="text-xs tracking-wide text-navy-900/50 3xl:text-sm">{BRAND.subline}</p>
            </div>
          </div>

          <nav>
            {NAV_LINKS.map((link, i) => (
              <NavLink
                key={link.path}
                to={link.path}
                data-menu-row
                tabIndex={interactive ? 0 : -1}
                onClick={onNavigate}
                onMouseEnter={() => setActiveIndex(i)}
                className={() =>
                  cx(
                    "group relative flex items-center justify-between gap-4 border-b border-navy-900/10 px-7 py-4 transition-colors last:border-b-0 3xl:px-8 3xl:py-5",
                    i === activeIndex && "bg-navy-700/10"
                  )
                }
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-body text-xs text-navy-900/40 tabular-nums 3xl:text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p
                      className={cx(
                        "font-display text-2xl transition-colors 3xl:text-3xl",
                        i === activeIndex ? "text-navy-600" : "text-navy-900"
                      )}
                    >
                      {link.label}
                    </p>
                    <p className="text-xs text-navy-900/50 3xl:text-sm">{link.tagline}</p>
                  </div>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  className={cx(
                    "h-4 w-4 shrink-0 stroke-current transition-transform duration-300 group-hover:translate-x-1",
                    i === activeIndex ? "text-navy-600" : "text-navy-900/40"
                  )}
                  fill="none"
                  strokeWidth="1.5"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {i === activeIndex && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-navy-600" />
                )}
              </NavLink>
            ))}
          </nav>

          <div className="grid grid-cols-4 divide-x divide-navy-900/10 border-t border-navy-900/10">
            {[
              ["Height", BRAND.heightApprox],
              ["Levels", `${Math.max(...TOWERS.map((t) => t.totalFloors))}`],
              ["Config", BRAND.configShort],
              ["Possession", BRAND.possession],
            ].map(([label, value]) => (
              <div key={label} className="px-3 py-4 text-center 3xl:px-4 3xl:py-5">
                <p className="text-[10px] tracking-[0.15em] text-navy-900/40 uppercase 3xl:text-xs">{label}</p>
                <p className="mt-1 text-sm font-semibold text-navy-900 3xl:text-base">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HoverNav;
