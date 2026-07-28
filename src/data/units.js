import { FLOOR_PLANS, TOWERS } from "./floors";

export const BHK_TYPES = [1, 2, 3, 4];

export const UNIT_STATUS = {
  available: { label: "Available", color: "#3fae5c" },
  limited: { label: "Few Left", color: "#e0a83c" },
  sold: { label: "Sold Out", color: "#8a8f98" },
};

// Flattened, tower/floor-plan-aware unit list — used by the Floor Plan page
// for filtering and the visual selector, without re-deriving geometry data.
export const ALL_UNITS = FLOOR_PLANS.flatMap((plan) => {
  const tower = TOWERS.find((t) => t.id === plan.towerId);
  return plan.units.map((unit) => ({
    ...unit,
    towerId: plan.towerId,
    towerName: tower?.name,
    floorPlanId: plan.id,
    floorPlanLabel: plan.label,
    floorRange: plan.floorRange,
  }));
});

export function formatPrice(price) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  return `₹${(price / 100000).toFixed(2)} L`;
}

export function filterUnits({ bhk, towerId, status, maxBudget } = {}) {
  return ALL_UNITS.filter((unit) => {
    if (bhk && unit.bhk !== bhk) return false;
    if (towerId && unit.towerId !== towerId) return false;
    if (status && unit.status !== status) return false;
    if (maxBudget && unit.price > maxBudget) return false;
    return true;
  });
}

export function planStats(plan) {
  const units = plan.units;
  const available = units.filter((u) => u.status !== "sold");
  const prices = units.map((u) => u.price);
  const areas = units.map((u) => u.carpetArea);
  const bhkCounts = BHK_TYPES.reduce((acc, bhk) => {
    acc[bhk] = units.filter((u) => u.bhk === bhk).length;
    return acc;
  }, {});

  return {
    totalUnits: units.length,
    availableUnits: available.length,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    avgCarpetArea: Math.round(areas.reduce((a, b) => a + b, 0) / areas.length),
    bhkCounts,
  };
}
