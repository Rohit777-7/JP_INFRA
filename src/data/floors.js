export const TOWERS = [
  {
    id: "azure",
    name: "Tower A — Azure",
    totalFloors: 32,
    unitsPerFloor: 6,
    color: "#2b71bd",
  },
  {
    id: "emerald",
    name: "Tower B — Emerald",
    totalFloors: 28,
    unitsPerFloor: 5,
    color: "#19497c",
  },
];

// A "floor plan" is a repeating layout used across a range of floors in a tower.
// Units carry percentage-based geometry (x, y, w, h out of 100) so the floor
// plate can be rendered responsively for visual selection.
export const FLOOR_PLANS = [
  {
    id: "azure-podium",
    towerId: "azure",
    label: "Podium Level",
    floorRange: [3, 4],
    units: [
      { id: "az-p-01", unitNo: "01", bhk: 1, carpetArea: 402, saleableArea: 468, facing: "Garden", price: 6250000, status: "sold", geo: { x: 4, y: 8, w: 26, h: 38 } },
      { id: "az-p-02", unitNo: "02", bhk: 1, carpetArea: 412, saleableArea: 480, facing: "Garden", price: 6390000, status: "available", geo: { x: 32, y: 8, w: 26, h: 38 } },
      { id: "az-p-03", unitNo: "03", bhk: 2, carpetArea: 612, saleableArea: 705, facing: "Pool", price: 8850000, status: "available", geo: { x: 60, y: 8, w: 36, h: 38 } },
      { id: "az-p-04", unitNo: "04", bhk: 2, carpetArea: 615, saleableArea: 708, facing: "Pool", price: 8880000, status: "available", geo: { x: 4, y: 50, w: 32, h: 40 } },
      { id: "az-p-05", unitNo: "05", bhk: 2, carpetArea: 618, saleableArea: 712, facing: "Road", price: 8620000, status: "sold", geo: { x: 38, y: 50, w: 30, h: 40 } },
      { id: "az-p-06", unitNo: "06", bhk: 1, carpetArea: 405, saleableArea: 470, facing: "Road", price: 6180000, status: "available", geo: { x: 70, y: 50, w: 26, h: 40 } },
    ],
  },
  {
    id: "azure-typical",
    towerId: "azure",
    label: "Typical Floor 5–20",
    floorRange: [5, 20],
    units: [
      { id: "az-t-01", unitNo: "01", bhk: 2, carpetArea: 640, saleableArea: 735, facing: "Sea Facing", price: 9450000, status: "available", geo: { x: 4, y: 6, w: 28, h: 42 } },
      { id: "az-t-02", unitNo: "02", bhk: 2, carpetArea: 642, saleableArea: 738, facing: "Sea Facing", price: 9480000, status: "available", geo: { x: 34, y: 6, w: 28, h: 42 } },
      { id: "az-t-03", unitNo: "03", bhk: 3, carpetArea: 895, saleableArea: 1024, facing: "Sea Facing", price: 13250000, status: "limited", geo: { x: 64, y: 6, w: 32, h: 42 } },
      { id: "az-t-04", unitNo: "04", bhk: 3, carpetArea: 898, saleableArea: 1028, facing: "Garden", price: 12980000, status: "available", geo: { x: 4, y: 52, w: 32, h: 40 } },
      { id: "az-t-05", unitNo: "05", bhk: 2, carpetArea: 645, saleableArea: 740, facing: "Garden", price: 9320000, status: "sold", geo: { x: 38, y: 52, w: 28, h: 40 } },
      { id: "az-t-06", unitNo: "06", bhk: 2, carpetArea: 638, saleableArea: 732, facing: "Road", price: 9180000, status: "available", geo: { x: 68, y: 52, w: 28, h: 40 } },
    ],
  },
  {
    id: "azure-high",
    towerId: "azure",
    label: "High Floor 21–32",
    floorRange: [21, 32],
    units: [
      { id: "az-h-01", unitNo: "01", bhk: 3, carpetArea: 902, saleableArea: 1032, facing: "Sea Facing", price: 14850000, status: "available", geo: { x: 4, y: 6, w: 30, h: 42 } },
      { id: "az-h-02", unitNo: "02", bhk: 3, carpetArea: 905, saleableArea: 1036, facing: "Sea Facing", price: 14920000, status: "limited", geo: { x: 36, y: 6, w: 30, h: 42 } },
      { id: "az-h-03", unitNo: "03", bhk: 3, carpetArea: 900, saleableArea: 1030, facing: "Sea Facing", price: 14780000, status: "available", geo: { x: 68, y: 6, w: 28, h: 42 } },
      { id: "az-h-04", unitNo: "04", bhk: 4, carpetArea: 1240, saleableArea: 1420, facing: "Panoramic", price: 19850000, status: "available", geo: { x: 4, y: 52, w: 44, h: 40 } },
      { id: "az-h-05", unitNo: "05", bhk: 3, carpetArea: 910, saleableArea: 1040, facing: "Garden", price: 14650000, status: "available", geo: { x: 50, y: 52, w: 46, h: 40 } },
    ],
  },
  {
    id: "emerald-podium",
    towerId: "emerald",
    label: "Podium Level",
    floorRange: [3, 4],
    units: [
      { id: "em-p-01", unitNo: "01", bhk: 1, carpetArea: 398, saleableArea: 462, facing: "Garden", price: 6120000, status: "available", geo: { x: 4, y: 10, w: 28, h: 78 } },
      { id: "em-p-02", unitNo: "02", bhk: 2, carpetArea: 605, saleableArea: 698, facing: "Garden", price: 8720000, status: "sold", geo: { x: 34, y: 10, w: 30, h: 78 } },
      { id: "em-p-03", unitNo: "03", bhk: 2, carpetArea: 610, saleableArea: 702, facing: "Road", price: 8580000, status: "available", geo: { x: 66, y: 10, w: 30, h: 78 } },
    ],
  },
  {
    id: "emerald-typical",
    towerId: "emerald",
    label: "Typical Floor 5–18",
    floorRange: [5, 18],
    units: [
      { id: "em-t-01", unitNo: "01", bhk: 2, carpetArea: 632, saleableArea: 726, facing: "Garden", price: 9120000, status: "available", geo: { x: 4, y: 6, w: 30, h: 42 } },
      { id: "em-t-02", unitNo: "02", bhk: 1, carpetArea: 420, saleableArea: 486, facing: "Road", price: 6480000, status: "available", geo: { x: 36, y: 6, w: 26, h: 42 } },
      { id: "em-t-03", unitNo: "03", bhk: 3, carpetArea: 880, saleableArea: 1008, facing: "Sea Facing", price: 12920000, status: "limited", geo: { x: 64, y: 6, w: 32, h: 42 } },
      { id: "em-t-04", unitNo: "04", bhk: 2, carpetArea: 635, saleableArea: 730, facing: "Sea Facing", price: 9640000, status: "available", geo: { x: 4, y: 52, w: 30, h: 40 } },
      { id: "em-t-05", unitNo: "05", bhk: 2, carpetArea: 628, saleableArea: 722, facing: "Garden", price: 9280000, status: "sold", geo: { x: 36, y: 52, w: 60, h: 40 } },
    ],
  },
  {
    id: "emerald-high",
    towerId: "emerald",
    label: "High Floor 19–28",
    floorRange: [19, 28],
    units: [
      { id: "em-h-01", unitNo: "01", bhk: 3, carpetArea: 892, saleableArea: 1022, facing: "Sea Facing", price: 14320000, status: "available", geo: { x: 4, y: 6, w: 32, h: 42 } },
      { id: "em-h-02", unitNo: "02", bhk: 3, carpetArea: 895, saleableArea: 1025, facing: "Sea Facing", price: 14380000, status: "available", geo: { x: 38, y: 6, w: 32, h: 42 } },
      { id: "em-h-03", unitNo: "03", bhk: 2, carpetArea: 648, saleableArea: 744, facing: "Panoramic", price: 10420000, status: "limited", geo: { x: 72, y: 6, w: 24, h: 42 } },
      { id: "em-h-04", unitNo: "04", bhk: 4, carpetArea: 1180, saleableArea: 1352, facing: "Panoramic", price: 18650000, status: "available", geo: { x: 4, y: 52, w: 92, h: 40 } },
    ],
  },
];

export function getFloorPlansByTower(towerId) {
  return FLOOR_PLANS.filter((plan) => plan.towerId === towerId);
}

export function getFloorPlanForFloor(towerId, floorNumber) {
  return FLOOR_PLANS.find(
    (plan) =>
      plan.towerId === towerId &&
      floorNumber >= plan.floorRange[0] &&
      floorNumber <= plan.floorRange[1]
  );
}
