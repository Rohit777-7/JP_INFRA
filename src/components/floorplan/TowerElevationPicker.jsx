import { cx } from "../../utils/helpers";

// A vertical mini-elevation of the tower, one band per floor-plan group,
// sized proportionally to how many floors it spans — a compact visual
// replacement for a plain row of text chips, and one that doesn't need to
// scroll: it always fits its column, the browser just resizes the bands.
// Ground-level plans render at the bottom (flex-col-reverse) to read like a
// real building elevation. Selecting a band mirrors the previous chips'
// behaviour (up to 2, via the same togglePlan handler).
function TowerElevationPicker({ plans, color, selectedIds, onToggle }) {
  return (
    <div className="flex w-24 shrink-0 flex-col-reverse gap-1 3xl:w-28">
      {plans.map((plan) => {
        const floorCount = plan.floorRange[1] - plan.floorRange[0] + 1;
        const selected = selectedIds.includes(plan.id);

        return (
          <button
            key={plan.id}
            onClick={() => onToggle(plan.id)}
            style={{ flexGrow: floorCount, backgroundColor: selected ? color : `${color}26` }}
            className={cx(
              "flex min-h-[30px] flex-col items-center justify-center border px-1 text-center transition-colors",
              selected ? "border-white text-white" : "border-white/15 text-white/50 hover:border-white/40"
            )}
            title={`${plan.label} · Floors ${plan.floorRange[0]}–${plan.floorRange[1]}`}
          >
            <span className="text-[9px] leading-tight font-semibold tracking-wide uppercase">{plan.label}</span>
            <span className="text-[8px] leading-tight opacity-70">
              {plan.floorRange[0]}–{plan.floorRange[1]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default TowerElevationPicker;
