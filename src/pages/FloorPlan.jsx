import { useMemo, useState } from "react";
import { FaBuilding, FaChevronDown, FaChevronUp, FaCompass } from "react-icons/fa";
import Layout from "../components/layout/Layout";
import FooterBar from "../components/layout/FooterBar";
import UtilityBar from "../components/layout/UtilityBar";
import BackButton from "../components/common/BackButton";
import FloorPlate from "../components/floorplan/FloorPlate";
import UnitDetail from "../components/floorplan/UnitDetail";
import { useGsap } from "../hooks/useAnimation";
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
  const [panelOpen, setPanelOpen] = useState(true);

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

  const scope = useGsap((gsap, root) => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(root.querySelector("[data-floorplan-back]"), { opacity: 0, x: -20, duration: 0.6 })
      .from(root.querySelector("[data-floorplan-plate]"), { opacity: 0, y: 28, scale: 0.97, filter: "blur(8px)", duration: 0.9 }, "-=0.35")
      .from(root.querySelector("[data-floorplan-panel]"), { opacity: 0, x: 60, duration: 0.8, ease: "power4.out" }, "-=0.7");
  }, []);

  return (
    <Layout>
      <div ref={scope} className="relative flex h-screen flex-col overflow-hidden bg-navy-950">
        <BackButton
          data-floorplan-back
          className="absolute top-24 left-6 z-30 md:top-28 md:left-16"
        />

        <div className="relative min-h-0 flex-1">
          {/* Plan display */}
          <div className="flex h-full min-h-0 flex-col items-center justify-start gap-4 overflow-y-auto p-6 pt-20 pr-6 pb-24 md:pr-[23rem]">
            <div data-floorplan-plate className={cx("grid w-full max-w-3xl gap-6", activePlans.length === 2 ? "sm:grid-cols-2" : "")}>
              {activePlans.map((plan) => (
                <FloorPlate key={plan.id} plan={plan} selectedUnitId={selection?.unit?.id} onSelectUnit={handleSelectUnit} />
              ))}
            </div>

            {activePlans.length === 2 && (
              <div className="w-full max-w-3xl overflow-x-auto border border-white/10">
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

          {/* Floating select panel */}
          <div data-floorplan-panel className="absolute top-24 right-6 bottom-6 z-20 flex w-80 flex-col items-center md:top-28 3xl:w-96">
            <button
              type="button"
              onClick={() => setPanelOpen((v) => !v)}
              aria-label={panelOpen ? "Collapse panel" : "Expand panel"}
              aria-expanded={panelOpen}
              className="mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-navy-900 text-white/70 shadow-lg transition-colors hover:text-white"
            >
              {panelOpen ? <FaChevronUp className="h-3.5 w-3.5" /> : <FaChevronDown className="h-3.5 w-3.5" />}
            </button>

            {!panelOpen && (
              <button
                type="button"
                onClick={() => setPanelOpen(true)}
                className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-navy-950/90 px-4 py-3 text-left shadow-2xl backdrop-blur-md transition-colors hover:border-white/20"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-700 text-white">
                  <FaBuilding className="h-4 w-4" />
                </span>
                <span>
                  <p className="text-sm font-semibold text-white">{TOWERS.find((t) => t.id === towerId)?.name.split(" — ")[0]}</p>
                  <p className="text-[10px] tracking-[0.15em] text-white/50 uppercase">{activePlans[0]?.label ?? "Select a plan"}</p>
                </span>
              </button>
            )}

            {panelOpen && (
              <div className="glass-panel flex w-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-navy-950/90 shadow-2xl backdrop-blur-md">
                <div className="min-h-0 flex-1 overflow-y-auto p-5">
                  <p className="text-center text-[10px] tracking-[0.25em] text-white/40 uppercase">Select Tower</p>
                  <div className="mt-2 flex justify-center gap-2">
                    {TOWERS.map((t) => (
                      <button
                        key={t.id}
                        data-cursor="view"
                        onClick={() => selectTower(t.id)}
                        className={cx(
                          "flex-1 rounded-full border px-2 py-2 text-xs font-semibold uppercase transition-all duration-300 hover:-translate-y-0.5",
                          towerId === t.id
                            ? "border-brand-red bg-brand-red text-white shadow-[0_8px_20px_-6px_rgba(238,49,52,0.6)]"
                            : "border-white/15 text-white/60 hover:border-white/30 hover:text-white"
                        )}
                      >
                        {t.name.split(" — ")[0]}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-center text-[11px] text-white/40">
                    {TOWERS.find((t) => t.id === towerId)?.totalFloors} Floors
                  </p>

                  <p className="mt-5 text-center text-[10px] tracking-[0.25em] text-white/40 uppercase">Select Plan</p>
                  <p className="mb-2 text-center text-[10px] text-white/30">Pick up to 2 to compare</p>
                  <div className="flex flex-col gap-1">
                    {towerPlans.map((plan) => {
                      const active = compareIds.includes(plan.id);
                      return (
                        <button
                          key={plan.id}
                          onClick={() => togglePlan(plan.id)}
                          className={cx(
                            "flex items-center gap-2 rounded-md px-3 py-2.5 text-left transition-colors",
                            active ? "bg-navy-700 text-white" : "text-white/70 hover:bg-white/5"
                          )}
                        >
                          <span className={cx("h-1.5 w-1.5 shrink-0 rounded-full", active ? "bg-white" : "bg-white/30")} />
                          <span className="flex-1 text-sm font-semibold">{plan.label}</span>
                          <span className="text-[10px] text-white/40">
                            {plan.floorRange[0]}–{plan.floorRange[1]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-5 text-center text-[10px] tracking-[0.25em] text-white/40 uppercase">Filter Units</p>
                  <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                    <button
                      onClick={() => setFilters((f) => ({ ...f, bhk: null }))}
                      className={cx("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase", !filters.bhk ? "border-navy-700 bg-navy-700 text-white" : "border-white/15 text-white/50")}
                    >
                      All
                    </button>
                    {BHK_TYPES.map((bhk) => (
                      <button
                        key={bhk}
                        onClick={() => setFilters((f) => ({ ...f, bhk }))}
                        className={cx("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase", filters.bhk === bhk ? "border-navy-700 bg-navy-700 text-white" : "border-white/15 text-white/50")}
                      >
                        {bhk} BHK
                      </button>
                    ))}
                    {STATUS_KEYS.map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilters((f) => ({ ...f, status: filters.status === status ? null : status }))}
                        className={cx("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase", filters.status === status ? "border-navy-700 bg-navy-700 text-white" : "border-white/15 text-white/50")}
                      >
                        {UNIT_STATUS[status].label}
                      </button>
                    ))}
                  </div>

                  <p className="mt-4 text-[11px] text-white/40">{filteredUnits.length} units match</p>
                  <div className="mt-2 flex flex-col gap-1">
                    {filteredUnits.map((unit) => (
                      <button
                        key={unit.id}
                        onClick={() => handlePickFromList(unit)}
                        disabled={unit.status === "sold"}
                        className={cx(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-left transition-colors",
                          unit.status === "sold" ? "cursor-not-allowed text-white/25" : "text-white/70 hover:bg-white/5",
                          selection?.unit?.id === unit.id && "bg-navy-700/50 text-white"
                        )}
                      >
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: UNIT_STATUS[unit.status].color }}
                        />
                        <span className="flex-1 text-xs font-medium">
                          {unit.towerName} · #{unit.unitNo}
                        </span>
                        <span className="text-[10px] text-white/40">{unit.bhk} BHK</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-20 left-6 z-10 hidden h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-navy-950/70 text-white/50 backdrop-blur-sm md:left-16 md:flex"
          >
            <FaCompass className="h-5 w-5" />
          </span>

          <UtilityBar />
        </div>

        <FooterBar />
      </div>

      <UnitDetail unit={selection?.unit} plan={selection?.plan} onClose={() => setSelection(null)} />
    </Layout>
  );
}

export default FloorPlan;
