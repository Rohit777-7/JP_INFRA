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
      className={`group flex w-full items-center justify-between gap-3 border-b border-white/10 py-2.5 text-left transition-opacity duration-300 group-hover/list:opacity-50 hover:!opacity-100 xl:py-3 3xl:py-3.5 ${
        isActive ? "text-brand-red" : "text-white/85"
      }`}
    >
      <div className="flex min-w-0 items-center gap-2.5 xl:gap-3">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 xl:h-8 xl:w-8 3xl:h-9 3xl:w-9 ${
            isActive ? "border-brand-red bg-brand-red/15 text-brand-red" : "border-white/15 bg-white/5 text-white/70 group-hover:border-white/30 group-hover:text-white"
          }`}
        >
          <Icon className="h-3 w-3 xl:h-3.5 xl:w-3.5" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-xs font-semibold text-white xl:text-sm 3xl:text-base">{place.name}</h3>
          <p className="mt-0.5 truncate text-[9px] tracking-[0.15em] text-white/40 uppercase xl:text-[10px]">{place.category}</p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-xs font-semibold text-white xl:text-sm 3xl:text-base">{place.distance}</p>
        <p className="text-[9px] text-white/40 xl:text-[10px]">{place.time}</p>
      </div>
    </motion.button>
  );
}

export default memo(LocationCard);
