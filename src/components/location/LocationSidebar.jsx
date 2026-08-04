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
import { BRAND } from "../../utils/constants";

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
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-300 lg:h-8 lg:w-8 ${
          theme === "light"
            ? "bg-brand-red text-white"
            : "text-white/50 hover:text-white"
        }`}
      >
        <FaSun className="h-3 w-3" />
      </button>
      <button
        type="button"
        aria-label="Dark map"
        aria-pressed={theme === "dark"}
        onClick={() => onChange("dark")}
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-300 lg:h-8 lg:w-8 ${
          theme === "dark"
            ? "bg-brand-red text-white"
            : "text-white/50 hover:text-white"
        }`}
      >
        <FaMoon className="h-3 w-3" />
      </button>
    </div>
  );
}

// `data-location-in` elements are animated in once by Location.jsx's GSAP
// timeline on mount (see useGsap there) — they intentionally carry no
// Framer Motion mount animation of their own, so nothing here replays on
// category/theme/selection updates. whileHover/whileTap stay on Framer
// Motion since those are genuinely per-interaction, not one-time entrance.
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
      className="absolute inset-x-4 top-24 bottom-28 z-30 flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-navy-950/85 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur-[30px] lg:inset-x-auto lg:top-[70px] lg:right-10 lg:bottom-auto lg:h-[90vh] lg:w-[420px]"
    >
      <div className="flex h-full flex-col p-6 lg:p-8 xl:p-9">
        <div
          data-location-in
          className="flex items-start justify-between gap-3"
        >
          <p className="text-[10px] font-semibold tracking-[0.35em] text-white/50 uppercase lg:text-[11px]">
            Curated Neighbourhood Access
          </p>
          <ThemeToggle theme={theme} onChange={onThemeChange} />
        </div>

        <h1
          data-location-in
          className="font-display mt-3 text-4xl leading-none text-white lg:mt-4 lg:text-5xl xl:text-6xl 2xl:text-7xl"
        >
          Points of
          <br />
          Interest
        </h1>

        {/* Category filters */}
        <div data-location-in className="mt-6 border-t border-white/10 lg:mt-8">
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
                whileHover={{ x: 8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25, ease: EASE }}
                onClick={() => onCategoryChange(cat)}
                className={`relative flex w-full items-center justify-between border-b border-white/10 py-3.5 pl-4 transition-colors duration-300 lg:py-4 ${
                  active ? "text-brand-red" : "text-white/80 hover:text-white"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="location-category-indicator"
                    transition={SPRING}
                    className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-brand-red"
                  />
                )}

                <span className="flex items-center gap-3 lg:gap-4">
                  <Icon className="text-sm lg:text-base" />
                  <span className="text-xs tracking-[0.25em] uppercase lg:text-sm">
                    {cat}
                  </span>
                </span>
                <span className="text-xs tabular-nums opacity-60 lg:text-sm">
                  <AnimatedCounter value={count} />
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Scroll Area */}
        <div className="mt-4 flex-1 overflow-hidden lg:mt-5">
          <div className="h-full overflow-y-auto pr-2 custom-scroll">
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

        {/* Fixed Bottom Description */}
        <div
          data-location-in
          className="shrink-0 border-t border-white/10 pt-5 lg:pt-6"
        >
          <p className="text-xs leading-relaxed text-white/60 lg:text-sm lg:leading-7">
            Situated in the heart of Mira Road, {BRAND.project} offers seamless
            connectivity to schools, hospitals, shopping destinations, business
            hubs and everyday conveniences within minutes.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default memo(LocationSidebar);
