import { useState } from "react";
import Layout from "../components/layout/Layout";
import BackButton from "../components/common/BackButton";
import TowerViewer from "../three/TowerViewer";
import { TOWERS } from "../data/floors";
import { cx } from "../utils/helpers";

const MAX_FLOOR = Math.max(...TOWERS.map((t) => t.totalFloors));
// Ground first, then 1st..top, then reversed for display so the top floor
// sits at the top of the panel and Ground sits at the bottom — same
// orientation as a real elevator panel.
const FLOORS = Array.from({ length: MAX_FLOOR + 1 }, (_, i) => i).reverse();

function floorLabel(floor) {
  if (floor === 0) return "Ground";
  const rem100 = floor % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${floor}th Floor`;
  switch (floor % 10) {
    case 1:
      return `${floor}st Floor`;
    case 2:
      return `${floor}nd Floor`;
    case 3:
      return `${floor}rd Floor`;
    default:
      return `${floor}th Floor`;
  }
}

// A 360° view of the towers (the same TowerViewer scene used on Home) with
// a floor selector standing in for the reference site's metre-based height
// markers — picking a floor smoothly moves the camera there while
// OrbitControls stays live, so dragging to look around still works exactly
// as it does everywhere else TowerViewer is used.
function DroneView() {
  const [selectedFloor, setSelectedFloor] = useState(null);

  return (
    <Layout hideNavbar>
      <div className="relative h-screen w-full overflow-hidden bg-navy-950">
        <TowerViewer targetFloor={selectedFloor} />

        <BackButton className="absolute top-6 left-6 z-20 lg:top-6 lg:left-6 xl:top-8 xl:left-8 3xl:top-10 3xl:left-10" />

        <div className="absolute top-1/2 right-4 z-20 max-h-[70vh] -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/10 bg-navy-950/50 p-1.5 backdrop-blur-sm md:right-8 lg:right-6 lg:p-1 xl:right-8 xl:p-1.5 2xl:right-10 3xl:right-12 3xl:p-2 4xl:right-16">
          <div className="flex flex-col gap-1 lg:gap-0.5 xl:gap-1 3xl:gap-1.5">
            {FLOORS.map((floor) => (
              <button
                key={floor}
                type="button"
                data-cursor="view"
                onClick={() => setSelectedFloor(floor)}
                className={cx(
                  "rounded-lg px-3 py-1.5 text-right text-[11px] font-semibold tracking-wide whitespace-nowrap transition-all duration-300",
                  "lg:px-2.5 lg:py-1 lg:text-[10px] xl:px-3 xl:py-1.5 xl:text-[11px] 3xl:px-4 3xl:py-2 3xl:text-xs 4xl:px-5 4xl:text-sm",
                  selectedFloor === floor
                    ? "bg-brand-red text-white shadow-[0_8px_20px_-6px_rgba(238,49,52,0.6)]"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                {floorLabel(floor)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DroneView;
