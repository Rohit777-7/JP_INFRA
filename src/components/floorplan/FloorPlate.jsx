import { cx } from "../../utils/helpers";
import { UNIT_STATUS } from "../../data/units";

const BHK_FILL = {
  1: "rgba(43,113,189,0.35)",
  2: "rgba(238,49,52,0.3)",
  3: "rgba(255,217,138,0.28)",
  4: "rgba(63,174,92,0.3)",
};

function FloorPlate({ plan, selectedUnitId, onSelectUnit, dimmed }) {
  if (!plan) return null;

  return (
    <div className={cx("transition-opacity", dimmed && "opacity-40")}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold tracking-wide text-white">{plan.label}</p>
        <p className="text-xs text-white/40">Floors {plan.floorRange[0]}–{plan.floorRange[1]}</p>
      </div>

      <div className="relative aspect-[4/3] w-full border border-white/20 bg-navy-900/60">
        {plan.units.map((unit) => {
          const isSelected = unit.id === selectedUnitId;
          return (
            <button
              key={unit.id}
              onClick={() => onSelectUnit(unit, plan)}
              disabled={unit.status === "sold"}
              title={`Unit ${unit.unitNo} — ${unit.bhk} BHK`}
              style={{
                left: `${unit.geo.x}%`,
                top: `${unit.geo.y}%`,
                width: `${unit.geo.w}%`,
                height: `${unit.geo.h}%`,
                backgroundColor: BHK_FILL[unit.bhk],
              }}
              className={cx(
                "absolute flex flex-col items-center justify-center border text-[10px] font-semibold text-white transition-all sm:text-xs",
                unit.status === "sold" ? "cursor-not-allowed border-white/10 opacity-40" : "cursor-pointer border-white/25 hover:border-brand-red hover:z-10 hover:scale-[1.03]",
                isSelected && "border-brand-red ring-2 ring-brand-red z-10"
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
