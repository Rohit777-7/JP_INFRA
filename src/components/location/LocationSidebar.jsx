import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrain,
  FaGraduationCap,
  FaHospital,
  FaShoppingBag,
  FaBriefcase,
  FaMapMarkerAlt,
  FaSun,
  FaMoon,
} from "react-icons/fa";

import LocationCard from "./LocationCard";
import AnimatedCounter from "./AnimatedCounter";
import BackButton from "../common/BackButton";

const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: "spring", stiffness: 500, damping: 40 };

const ICONS = {
  All: FaMapMarkerAlt,
  Transit: FaTrain,
  Education: FaGraduationCap,
  Healthcare: FaHospital,
  Shopping: FaShoppingBag,
  Business: FaBriefcase,
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

function ThemeToggle({ theme, onChange }) {
  return (
    <div className="flex shrink-0 gap-1 rounded-full border border-white/10 bg-white/5 p-1">
      <button
        type="button"
        aria-label="Light map"
        aria-pressed={theme === "light"}
        onClick={() => onChange("light")}
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-300 xl:h-7 xl:w-7 3xl:h-8 3xl:w-8 ${
          theme === "light"
            ? "bg-brand-red text-white"
            : "text-white/50 hover:text-white"
        }`}
      >
        <FaSun className="h-2.5 w-2.5 xl:h-3 xl:w-3 3xl:h-3.5 3xl:w-3.5" />
      </button>
      <button
        type="button"
        aria-label="Dark map"
        aria-pressed={theme === "dark"}
        onClick={() => onChange("dark")}
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-300 xl:h-7 xl:w-7 3xl:h-8 3xl:w-8 ${
          theme === "dark"
            ? "bg-brand-red text-white"
            : "text-white/50 hover:text-white"
        }`}
      >
        <FaMoon className="h-2.5 w-2.5 xl:h-3 xl:w-3 3xl:h-3.5 3xl:w-3.5" />
      </button>
    </div>
  );
}

// `data-location-in` elements are animated in once by Location.jsx's GSAP
// timeline on mount (see useGsap there) — they intentionally carry no
// Framer Motion mount animation of their own, so nothing here replays on
// category/theme/selection updates. whileHover/whileTap stay on Framer
// Motion since those are genuinely per-interaction, not one-time entrance.
//
// Sizing note: every dimension below (width, height via top/right/bottom
// insets, padding, type scale) is intentionally restrained rather than
// growing toward the largest values Tailwind offers — this panel is a
// floating utility card over the map, not a full-bleed page section, so it
// should read as compact and premium at every breakpoint instead of
// ballooning to fill the viewport. Insets (not vh-based height) are used on
// lg+ specifically so the card's clearance from the top, right, and bottom
// (FooterBar included) stays consistent instead of drifting with viewport
// aspect ratio.
function LocationSidebar({
  categories,
  activeCategory,
  onCategoryChange,
  places,
  allPlaces,
  selectedPlaceId,
  onSelectPlace,
  theme,
  onThemeChange,
}) {
  return (
    <aside
      data-location-sidebar
      className="
    absolute inset-x-4 top-24 bottom-28 z-30 flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-navy-950/85 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur-[30px]
    lg:inset-x-auto lg:top-20 lg:right-6 lg:bottom-14 lg:w-[290px] lg:rounded-2xl
    xl:top-24 xl:right-8 xl:bottom-16 xl:w-[320px] xl:rounded-2xl
    2xl:top-28 2xl:right-10 2xl:bottom-20 2xl:w-[350px] 2xl:rounded-[26px]
    3xl:top-32 3xl:right-12 3xl:bottom-24 3xl:w-[380px] 3xl:rounded-[28px]
    4xl:top-36 4xl:right-16 4xl:bottom-28 4xl:w-[420px] 4xl:rounded-[32px]
  "
    >
      <div className="flex h-full flex-col p-5 lg:p-4 xl:p-5 2xl:p-5 3xl:p-6 4xl:p-7">
        <div data-location-in className="flex items-center justify-between gap-3">
          <BackButton size="sm" />
          <ThemeToggle theme={theme} onChange={onThemeChange} />
        </div>

        <p
          data-location-in
          className="mt-3 text-[9px] font-semibold tracking-[0.3em] text-white/50 uppercase xl:text-[10px] 3xl:text-[11px]"
        >
          Curated Neighbourhood Access
        </p>

        <h1
          data-location-in
          className="font-display mt-1.5 text-xl leading-none text-white xl:text-2xl 3xl:text-[26px]"
        >
          Points of Interest
        </h1>

        {/* Category filters */}
        <div data-location-in className="mt-3 border-t border-white/10 xl:mt-4 3xl:mt-5">
          {categories.map((cat) => {
            const Icon = ICONS[cat] || FaMapMarkerAlt;
            const count =
              cat === "All"
                ? allPlaces.length
                : allPlaces.filter((p) => p.category === cat).length;
            const active = activeCategory === cat;

            return (
              <motion.button
                key={cat}
                type="button"
                whileHover={{ x: 6, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25, ease: EASE }}
                onClick={() => onCategoryChange(cat)}
                className={`relative flex w-full items-center justify-between border-b border-white/10 py-2 pl-3 transition-colors duration-300 xl:py-2.5 3xl:py-3 ${
                  active ? "text-brand-red" : "text-white/80 hover:text-white"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="location-category-indicator"
                    transition={SPRING}
                    className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-brand-red"
                  />
                )}

                <span className="flex items-center gap-2.5 xl:gap-3">
                  <Icon className="text-xs xl:text-sm" />
                  <span className="text-[11px] tracking-[0.2em] uppercase xl:text-xs">
                    {cat}
                  </span>
                </span>
                <span className="text-[11px] tabular-nums opacity-60 xl:text-xs">
                  <AnimatedCounter value={count} />
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Scroll Area — min-h-0 is required here: without it, a flex-1 child
            in a flex-column can't shrink below its content's natural height,
            so it ignores the space actually available and pushes/compresses
            everything below it instead of scrolling internally. */}
        <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1.5 xl:mt-3 3xl:mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {places.map((place) => (
                <motion.div key={place.id} variants={itemVariants}>
                  <LocationCard
                    place={place}
                    icon={ICONS[place.category] || FaMapMarkerAlt}
                    isActive={selectedPlaceId === place.id}
                    onSelect={onSelectPlace}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}

export default memo(LocationSidebar);
