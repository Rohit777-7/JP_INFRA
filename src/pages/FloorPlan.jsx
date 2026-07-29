import { useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import FooterBar from "../components/layout/FooterBar";
import CompactHeader from "../components/common/CompactHeader";
import FloorPlate from "../components/floorplan/FloorPlate";
import UnitDetail from "../components/floorplan/UnitDetail";
import { cx } from "../utils/helpers";
import { TOWERS, FLOOR_PLANS, getFloorPlansByTower } from "../data/floors";
import { BHK_TYPES, UNIT_STATUS, filterUnits, formatPrice, planStats } from "../data/units";

const STATUS_KEYS = Object.keys(UNIT_STATUS);

function FloorPlan() {
  const [towerId, setTowerId] = useState(TOWERS[0].id);
  const towerPlans = useMemo(() => getFloorPlansByTower(towerId), [towerId]);

  const [compareIds, setCompareIds] = useState([towerPlans[0]?.id]);
  const [filters, setFilters] = useState({ bhk: null, status: null });
  const [selection, setSelection] = useState(null); // { unit, plan }

  function selectTower(id) {
    setTowerId(id);
    const plans = getFloorPlansByTower(id);
    setCompareIds([plans[0]?.id]);
  }

  function togglePlan(id) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length < 2) return [...prev, id];
      return [prev[1], id];
    });
  }

  function handleSelectUnit(unit, plan) {
    setSelection({ unit, plan });
  }

  function handlePickFromList(unit) {
    const plan = FLOOR_PLANS.find((p) => p.id === unit.floorPlanId);
    if (plan && plan.towerId !== towerId) {
      setTowerId(plan.towerId);
    }
    setCompareIds([unit.floorPlanId]);
    setSelection({ unit, plan });
  }

  const activePlans = compareIds.map((id) => FLOOR_PLANS.find((p) => p.id === id)).filter(Boolean);

  const filteredUnits = useMemo(
    () => filterUnits({ towerId, bhk: filters.bhk, status: filters.status }),
    [towerId, filters]
  );

  return (
    <Layout>
      <div className="flex h-screen flex-col overflow-hidden bg-navy-950">
        <CompactHeader
          eyebrow="Floor Plan"
          title="Find Your Floor"
          description="Compare plans side by side, filter units, click any unit for specs."
        />

        <div className="mx-auto grid min-h-0 w-full max-w-[1800px] flex-1 lg:grid-cols-2">
          {/* Compare & select */}
          <div className="min-h-0 overflow-y-auto border-white/10 p-5 lg:border-r 3xl:p-8">
            <div className="flex flex-wrap gap-2">
              {TOWERS.map((tower) => (
                <button
                  key={tower.id}
                  onClick={() => selectTower(tower.id)}
                  className={cx(
                    "border px-4 py-2 text-xs font-semibold tracking-[0.15em] uppercase transition-colors",
                    towerId === tower.id
                      ? "border-brand-red bg-brand-red text-white"
                      : "border-white/15 text-white/70 hover:border-white/40"
                  )}
                >
                  {tower.name} · {tower.totalFloors} Floors
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {towerPlans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => togglePlan(plan.id)}
                  className={cx(
                    "border px-3 py-1.5 text-xs font-medium tracking-wide transition-colors",
                    compareIds.includes(plan.id)
                      ? "border-white bg-white/10 text-white"
                      : "border-white/15 text-white/50 hover:border-white/30"
                  )}
                >
                  {plan.label}
                </button>
              ))}
              <p className="ml-auto self-center text-[11px] text-white/40">Select up to 2 to compare</p>
            </div>

            <div className={cx("mt-5 grid gap-5", activePlans.length === 2 ? "sm:grid-cols-2" : "sm:max-w-md")}>
              {activePlans.map((plan) => (
                <FloorPlate
                  key={plan.id}
                  plan={plan}
                  selectedUnitId={selection?.unit?.id}
                  onSelectUnit={handleSelectUnit}
                />
              ))}
            </div>

            {activePlans.length === 2 && (
              <div className="mt-5 overflow-x-auto border border-white/10">
                <table className="w-full min-w-[420px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50">
                      <th className="p-3 font-medium">Metric</th>
                      {activePlans.map((plan) => (
                        <th key={plan.id} className="p-3 font-medium text-white">{plan.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-white/80">
                    {[
                      ["Available", (s) => `${s.availableUnits} / ${s.totalUnits}`],
                      ["Price Range", (s) => `${formatPrice(s.minPrice)} – ${formatPrice(s.maxPrice)}`],
                      ["Avg. Carpet", (s) => `${s.avgCarpetArea} sq.ft.`],
                      ["BHK Mix", (s) => BHK_TYPES.filter((b) => s.bhkCounts[b]).map((b) => `${b}BHK×${s.bhkCounts[b]}`).join("  ")],
                    ].map(([label, fn]) => (
                      <tr key={label} className="border-b border-white/5 last:border-0">
                        <td className="p-3 text-white/50">{label}</td>
                        {activePlans.map((plan) => (
                          <td key={plan.id} className="p-3">{fn(planStats(plan))}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Unit filtering */}
          <div className="flex min-h-0 flex-col bg-navy-50 p-5">
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <span className="text-[10px] tracking-wide text-navy-900/40 uppercase">BHK</span>
              <button
                onClick={() => setFilters((f) => ({ ...f, bhk: null }))}
                className={cx("border px-3 py-1 text-xs font-semibold uppercase", !filters.bhk ? "border-navy-900 bg-navy-900 text-white" : "border-navy-900/20 text-navy-900/60")}
              >
                All
              </button>
              {BHK_TYPES.map((bhk) => (
                <button
                  key={bhk}
                  onClick={() => setFilters((f) => ({ ...f, bhk }))}
                  className={cx("border px-3 py-1 text-xs font-semibold uppercase", filters.bhk === bhk ? "border-navy-900 bg-navy-900 text-white" : "border-navy-900/20 text-navy-900/60")}
                >
                  {bhk} BHK
                </button>
              ))}

              <span className="ml-3 text-[10px] tracking-wide text-navy-900/40 uppercase">Status</span>
              <button
                onClick={() => setFilters((f) => ({ ...f, status: null }))}
                className={cx("border px-3 py-1 text-xs font-semibold uppercase", !filters.status ? "border-navy-900 bg-navy-900 text-white" : "border-navy-900/20 text-navy-900/60")}
              >
                All
              </button>
              {STATUS_KEYS.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilters((f) => ({ ...f, status }))}
                  className={cx("border px-3 py-1 text-xs font-semibold uppercase", filters.status === status ? "border-navy-900 bg-navy-900 text-white" : "border-navy-900/20 text-navy-900/60")}
                >
                  {UNIT_STATUS[status].label}
                </button>
              ))}
            </div>

            <p className="mt-3 shrink-0 text-xs text-navy-900/50">{filteredUnits.length} units match</p>

            <div className="mt-2 min-h-0 flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filteredUnits.map((unit) => (
                  <button
                    key={unit.id}
                    onClick={() => handlePickFromList(unit)}
                    disabled={unit.status === "sold"}
                    className={cx(
                      "border bg-white p-4 text-left transition-shadow hover:shadow-lg",
                      unit.status === "sold" ? "cursor-not-allowed opacity-50" : "border-navy-900/10"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] tracking-wide text-navy-900/40 uppercase">{unit.towerName}</p>
                      <span
                        className="px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-white uppercase"
                        style={{ backgroundColor: UNIT_STATUS[unit.status].color }}
                      >
                        {UNIT_STATUS[unit.status].label}
                      </span>
                    </div>
                    <p className="mt-1.5 text-lg text-navy-900">{unit.bhk} BHK · #{unit.unitNo}</p>
                    <p className="mt-1 text-xs text-navy-900/60">{unit.carpetArea} sq.ft. · {unit.facing}</p>
                    <p className="mt-2 text-sm font-semibold text-brand-red">{formatPrice(unit.price)}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <FooterBar />
      </div>

      <UnitDetail unit={selection?.unit} plan={selection?.plan} onClose={() => setSelection(null)} />
    </Layout>
  );
}

export default FloorPlan;
