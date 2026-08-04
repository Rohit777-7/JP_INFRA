import { memo } from "react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

function LocationCard({ place, icon: Icon, isActive, onSelect }) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(place)}
      whileHover={{ x: 10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.35, ease: EASE }}
      className={`group flex w-full items-center justify-between gap-4 border-b border-white/10 py-4 text-left transition-opacity duration-300 group-hover/list:opacity-50 hover:!opacity-100 lg:py-5 ${
        isActive ? "text-brand-red" : "text-white/85"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3 lg:gap-4">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 lg:h-9 lg:w-9 ${
            isActive ? "border-brand-red bg-brand-red/15 text-brand-red" : "border-white/15 bg-white/5 text-white/70 group-hover:border-white/30 group-hover:text-white"
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-white lg:text-base">{place.name}</h3>
          <p className="mt-0.5 text-[10px] tracking-[0.18em] text-white/40 uppercase lg:text-[11px]">{place.category}</p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-white lg:text-base">{place.distance}</p>
        <p className="text-[10px] text-white/40 lg:text-xs">{place.time}</p>
      </div>
    </motion.button>
  );
}

export default memo(LocationCard);
