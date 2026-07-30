import { useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import FooterBar from "../components/layout/FooterBar";
import CompactHeader from "../components/common/CompactHeader";
import FloorPlate from "../components/floorplan/FloorPlate";
import TowerElevationPicker from "../components/floorplan/TowerElevationPicker";
import UnitDetail from "../components/floorplan/UnitDetail";
import { cx } from "../utils/helpers";
import { TOWERS, FLOOR_PLANS, getFloorPlansByTower } from "../data/floors";
import { BHK_TYPES, UNIT_STATUS, filterUnits, formatPrice, planStats } from "../data/units";

const STATUS_KEYS = Object.keys(UNIT_STATUS);
const UNITS_PER_PAGE = 6; // 2 cols x 3 rows — fixed so the list never scrolls

function FloorPlan() {
  const [towerId, setTowerId] = useState(TOWERS[0].id);
  const tower = TOWERS.find((t) => t.id === towerId);
  const towerPlans = useMemo(() => getFloorPlansByTower(towerId), [towerId]);

  const [compareIds, setCompareIds] = useState([towerPlans[0]?.id]);
  const [filters, setFilters] = useState({ bhk: null, status: null });
  const [selection, setSelection] = useState(null); // { unit, plan }
  const [unitPage, setUnitPage] = useState(0);

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

  // Tower/filter changes can leave unitPage pointing past the new, smaller
  // result set — clamp during render rather than resetting via effect.
  const totalUnitPages = Math.max(1, Math.ceil(filteredUnits.length / UNITS_PER_PAGE));
  const safeUnitPage = Math.min(unitPage, totalUnitPages - 1);
  const unitPageItems = filteredUnits.slice(safeUnitPage * UNITS_PER_PAGE, safeUnitPage * UNITS_PER_PAGE + UNITS_PER_PAGE);

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
          <div className="flex min-h-0 flex-col border-white/10 p-5 lg:border-r 3xl:p-8">
            <div className="flex shrink-0 flex-wrap gap-2">
              {TOWERS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => selectTower(t.id)}
                  className={cx(
                    "border px-4 py-2 text-xs font-semibold tracking-[0.15em] uppercase transition-colors",
                    towerId === t.id
                      ? "border-brand-red bg-brand-red text-white"
                      : "border-white/15 text-white/70 hover:border-white/40"
                  )}
                >
                  {t.name} · {t.totalFloors} Floors
                </button>
              ))}
              <p className="ml-auto self-center text-[11px] text-white/40">Select up to 2 bands to compare</p>
            </div>

            <div className="mt-4 grid min-h-0 flex-1 grid-cols-[auto_1fr] gap-4">
              <TowerElevationPicker
                plans={towerPlans}
                color={tower.color}
                selectedIds={compareIds}
                onToggle={togglePlan}
              />

              <div className="flex min-h-0 flex-col gap-4 overflow-hidden">
                <div className={cx("grid gap-5", activePlans.length === 2 ? "sm:grid-cols-2" : "sm:max-w-md")}>
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
                  <div className="overflow-x-auto border border-white/10">
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
            </div>
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

            <div className="mt-2 grid min-h-0 flex-1 grid-cols-1 grid-rows-3 gap-3 sm:grid-cols-2">
              {unitPageItems.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => handlePickFromList(unit)}
                  disabled={unit.status === "sold"}
                  className={cx(
                    "min-h-0 border bg-white p-4 text-left transition-shadow hover:shadow-lg",
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

            {totalUnitPages > 1 && (
              <div className="mt-2 flex shrink-0 items-center justify-between">
                <button
                  onClick={() => setUnitPage((safeUnitPage - 1 + totalUnitPages) % totalUnitPages)}
                  aria-label="Previous units"
                  className="flex h-8 w-8 items-center justify-center border border-navy-900/20 text-navy-900/70 transition-colors hover:border-navy-900 hover:text-navy-900"
                >
                  &#8249;
                </button>
                <span className="text-[11px] tracking-[0.15em] text-navy-900/50 uppercase">
                  {safeUnitPage + 1} / {totalUnitPages}
                </span>
                <button
                  onClick={() => setUnitPage((safeUnitPage + 1) % totalUnitPages)}
                  aria-label="Next units"
                  className="flex h-8 w-8 items-center justify-center border border-navy-900/20 text-navy-900/70 transition-colors hover:border-navy-900 hover:text-navy-900"
                >
                  &#8250;
                </button>
              </div>
            )}
          </div>
        </div>

        <FooterBar />
      </div>

      <UnitDetail unit={selection?.unit} plan={selection?.plan} onClose={() => setSelection(null)} />
    </Layout>
  );
}

export default FloorPlan;
