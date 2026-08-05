import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cx } from "../../utils/helpers";
import { UNIT_STATUS, formatPrice } from "../../data/units";
import { EASE } from "../../utils/easing";

const BHK_FILL = {
  1: "rgba(43,113,189,0.35)",
  2: "rgba(238,49,52,0.3)",
  3: "rgba(255,217,138,0.28)",
  4: "rgba(63,174,92,0.3)",
};

function FloorPlate({ plan, selectedUnitId, onSelectUnit, dimmed }) {
  const [hoveredUnit, setHoveredUnit] = useState(null);

  if (!plan) return null;

  return (
    <div className={cx("transition-opacity", dimmed && "opacity-40")}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold tracking-wide text-white">{plan.label}</p>
        <p className="text-xs text-white/40">Floors {plan.floorRange[0]}–{plan.floorRange[1]}</p>
      </div>

      <div
        className="relative aspect-[4/3] w-full overflow-visible border border-white/20 bg-navy-900/60 transition-transform duration-700 ease-out hover:scale-[1.025]"
        onMouseLeave={() => setHoveredUnit(null)}
      >
        {plan.units.map((unit) => {
          const isSelected = unit.id === selectedUnitId;
          const isSold = unit.status === "sold";
          return (
            <button
              key={unit.id}
              onClick={() => onSelectUnit(unit, plan)}
              onMouseEnter={() => setHoveredUnit(unit.id)}
              onFocus={() => setHoveredUnit(unit.id)}
              onBlur={() => setHoveredUnit((id) => (id === unit.id ? null : id))}
              disabled={isSold}
              data-cursor={isSold ? undefined : "view"}
              title={`Unit ${unit.unitNo} — ${unit.bhk} BHK`}
              style={{
                left: `${unit.geo.x}%`,
                top: `${unit.geo.y}%`,
                width: `${unit.geo.w}%`,
                height: `${unit.geo.h}%`,
                backgroundColor: BHK_FILL[unit.bhk],
              }}
              className={cx(
                "absolute flex flex-col items-center justify-center border text-[10px] font-semibold text-white transition-all duration-300 sm:text-xs",
                isSold
                  ? "cursor-not-allowed border-white/10 opacity-40"
                  : "hotspot-breathe cursor-pointer border-white/25 hover:z-10 hover:scale-[1.06] hover:border-brand-red hover:shadow-[0_0_22px_rgba(238,49,52,0.5)]",
                isSelected && "border-brand-red ring-2 ring-brand-red z-10 shadow-[0_0_24px_rgba(238,49,52,0.55)]"
              )}
            >
              <span>{unit.unitNo}</span>
              <span className="opacity-70">{unit.bhk} BHK</span>
              {unit.status !== "available" && (
                <span
                  className="mt-0.5 rounded-full px-1.5 py-0.5 text-[8px] tracking-wide uppercase"
                  style={{ backgroundColor: UNIT_STATUS[unit.status].color }}
                >
                  {UNIT_STATUS[unit.status].label}
                </span>
              )}

              <AnimatePresence>
                {hoveredUnit === unit.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.94 }}
                    transition={{ duration: 0.22, ease: EASE.expoOut }}
                    className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max -translate-x-1/2 rounded-lg border border-white/15 bg-navy-950/95 px-3 py-2 text-left shadow-2xl backdrop-blur-md"
                  >
                    <p className="text-[11px] font-semibold text-white normal-case">
                      Unit {unit.unitNo} · {unit.bhk} BHK
                    </p>
                    <p className="mt-0.5 text-[10px] text-white/50 normal-case">{unit.carpetArea} sq.ft.</p>
                    <p
                      className={cx(
                        "mt-0.5 text-[11px] font-semibold normal-case",
                        isSold ? "text-white/40" : "text-brand-red"
                      )}
                    >
                      {formatPrice(unit.price)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-white/50">
        {[1, 2, 3, 4].map((bhk) => (
          <span key={bhk} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5" style={{ backgroundColor: BHK_FILL[bhk] }} />
            {bhk} BHK
          </span>
        ))}
        <span className="ml-auto">
          {plan.units.filter((u) => u.status !== "sold").length} of {plan.units.length} available
        </span>
      </div>
    </div>
  );
}

export default FloorPlate;
