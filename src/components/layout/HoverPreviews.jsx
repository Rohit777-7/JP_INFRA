import { Suspense, lazy, useMemo } from "react";
import { cx } from "../../utils/helpers";
import { BRAND } from "../../utils/constants";
import { GALLERY_ITEMS } from "../../data/gallery";
import { SITE_COORDINATES } from "../../data/location";
import { FLOOR_PLANS } from "../../data/floors";
import FloorPlate from "../floorplan/FloorPlate";

// Both this file and LandingSplash dynamically import TowerViewer so the
// Three.js/fiber/drei/postprocessing bundle is its own chunk, only fetched
// once either the splash screen or this hover preview actually needs it —
// a static import here would pull all of that back into the main chunk.
const TowerViewer = lazy(() => import("../../three/TowerViewer"));

// Real, non-interactive previews of each page's actual content — shown
// full-bleed behind the nav card while hovering, so hovering alone is
// enough to see what's there. Clicking still takes you into the full page.

const CAPTION_POSITION =
  "absolute right-10 bottom-14 max-w-sm text-right md:right-20 lg:right-8 lg:bottom-8 lg:max-w-[16rem] xl:right-12 xl:bottom-10 xl:max-w-xs 2xl:right-16 2xl:bottom-12 2xl:max-w-sm 3xl:right-24 3xl:bottom-16 3xl:max-w-md 4xl:right-32 4xl:bottom-20 4xl:max-w-lg";

function HomePreview() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <img src={GALLERY_ITEMS[0].src} alt="" className="ken-burns h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/70 via-navy-950/10 to-transparent" />
      <div className={CAPTION_POSITION}>
        <p className="font-display text-5xl text-white lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl">
          {BRAND.tagline}
        </p>
        <p className="mt-1 text-white/70 lg:text-xs xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl">
          {BRAND.subline}
        </p>
      </div>
    </div>
  );
}

function ShowcasePreview({ active }) {
  return (
    <div className="relative h-full w-full bg-navy-950">
      <Suspense fallback={null}>
        <TowerViewer paused={!active} />
      </Suspense>
      <div className={cx(CAPTION_POSITION, "text-white")}>
        <p className="font-display text-3xl lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl">
          Two Towers, One Skyline
        </p>
        <p className="mt-1 text-sm text-white/60 lg:text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">
          Azure &amp; Emerald, scaled to their real floor counts
        </p>
      </div>
    </div>
  );
}

function GalleryPreviewBg() {
  const items = GALLERY_ITEMS.slice(0, 9);
  return (
    <div className="relative h-full w-full">
      <div className="grid h-full grid-cols-3 grid-rows-3 gap-1">
        {items.map((item) => (
          <div key={item.id} className="relative overflow-hidden">
            <img src={item.src} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-navy-950/25" />
    </div>
  );
}

function FloorPlanPreviewBg() {
  const plan = FLOOR_PLANS.find((p) => p.id === "azure-typical") ?? FLOOR_PLANS[0];
  return (
    <div className="flex h-full w-full items-center justify-end bg-navy-950 px-10 md:px-20 lg:px-10 xl:px-14 2xl:px-16 3xl:px-24 4xl:px-32">
      <div className="w-full max-w-xl lg:max-w-sm xl:max-w-md 2xl:max-w-xl 3xl:max-w-2xl 4xl:max-w-3xl">
        <FloorPlate plan={plan} selectedUnitId={null} onSelectUnit={() => {}} />
      </div>
    </div>
  );
}

const LOCATION_TILE_ZOOM = 15;

// Standard slippy-map (Web Mercator) lat/lng -> tile x/y conversion at a
// given zoom level.
function latLngToTile(lat, lng, zoom) {
  const latRad = (lat * Math.PI) / 180;
  const n = 2 ** zoom;
  return {
    x: Math.floor(((lng + 180) / 360) * n),
    y: Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n),
  };
}

// A clean static crop of the same Carto basemap the real Location page
// uses (see LocationMap.jsx's LIGHT_TILES) — a 3x3 grid of plain <img>
// tiles, same pattern as GalleryPreviewBg above, centered on the site.
// Deliberately NOT the real interactive LocationMap/Leaflet instance or an
// OSM iframe embed: both carry their own zoom controls and attribution
// chrome that can't be styled away (the iframe is cross-origin), which
// looked out of place next to every other preview here showing clean,
// chrome-free real content. This never touches the full Location page,
// which keeps its own full Leaflet map, controls, and attribution.
function LocationPreviewBg() {
  const { lat, lng } = SITE_COORDINATES;
  const { x, y } = useMemo(() => latLngToTile(lat, lng, LOCATION_TILE_ZOOM), [lat, lng]);

  const tiles = useMemo(() => {
    const grid = [];
    for (let row = -1; row <= 1; row += 1) {
      for (let col = -1; col <= 1; col += 1) {
        grid.push({ x: x + col, y: y + row, key: `${row}-${col}` });
      }
    }
    return grid;
  }, [x, y]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-navy-950">
      <div className="grid h-full grid-cols-3 grid-rows-3">
        {tiles.map((tile) => (
          <img
            key={tile.key}
            src={`https://a.basemaps.cartocdn.com/light_all/${LOCATION_TILE_ZOOM}/${tile.x}/${tile.y}@2x.png`}
            alt=""
            className="h-full w-full object-cover"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-navy-950/25" />
      <span className="pointer-events-none absolute top-1/2 left-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <span className="absolute inline-flex h-5 w-5 animate-ping rounded-full bg-brand-red/50" />
        <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-brand-red shadow-[0_0_18px_rgba(238,49,52,0.9)]" />
      </span>
    </div>
  );
}

// Compact mirror of the real Brochure page's two-part composition (the
// stacked mockup cards + the "What's Inside" list) instead of a single
// lonely card with a lot of dead space around it — same navy-700/white
// mockup cards, same navy-900/brand-red palette and font-display heading
// as the real page, just scaled down. `justify-end` (not centered on the
// full width) keeps it clear of the menu card, which sits over the left
// side of the screen — same convention FloorPlanPreviewBg/LocationPreviewBg
// already use. No header/footer/UtilityBar here, same as every other
// preview in this file.
function BrochurePreview() {
  return (
    <div className="flex h-full w-full items-center justify-end bg-navy-50 px-10 md:px-20 lg:px-10 xl:px-14 2xl:px-16 3xl:px-24 4xl:px-32">
      <div className="flex items-center gap-8 lg:gap-6 xl:gap-8 2xl:gap-10 3xl:gap-12 4xl:gap-16">
        <div className="flex shrink-0 justify-center gap-4 [perspective:1200px] lg:gap-3 xl:gap-4 3xl:gap-5">
          <div className="w-28 -rotate-6 bg-navy-700 p-4 text-white shadow-2xl lg:w-24 lg:p-3 xl:w-28 xl:p-4 2xl:w-32 2xl:p-4 3xl:w-36 3xl:p-5 4xl:w-40 4xl:p-6">
            <span className="border border-brand-red px-1.5 py-0.5 text-[7px] tracking-widest">JP INFRA</span>
            <p className="font-display mt-8 text-lg leading-none lg:mt-6 lg:text-base xl:mt-8 xl:text-lg 2xl:text-xl 3xl:mt-10 3xl:text-xl 4xl:text-2xl">
              {BRAND.tagline}
            </p>
            <p className="mt-1.5 text-[8px] text-white/70 3xl:text-[9px]">{BRAND.subline}</p>
            <p className="mt-10 text-[7px] leading-relaxed text-white/50 lg:mt-8 3xl:mt-12 3xl:text-[8px]">
              {BRAND.rera}
            </p>
          </div>
          <div className="mt-6 w-28 rotate-6 bg-white p-4 text-navy-900 shadow-2xl lg:mt-5 lg:w-24 lg:p-3 xl:mt-6 xl:w-28 xl:p-4 2xl:w-32 2xl:p-4 3xl:w-36 3xl:p-5 4xl:w-40 4xl:p-6">
            <span className="border border-navy-900 px-1.5 py-0.5 text-[7px] tracking-widest">JP INFRA</span>
            <p className="mt-10 text-[8px] font-semibold text-navy-900 lg:mt-8 3xl:mt-12 3xl:text-[9px]">
              {BRAND.address}
            </p>
            <p className="mt-2 text-[8px] text-navy-900/70 3xl:text-[9px]">{BRAND.email}</p>
            <p className="font-display mt-2 text-sm text-brand-red 3xl:text-base">{BRAND.tollFree}</p>
          </div>
        </div>

        <div className="shrink-0">
          <h2 className="font-display text-xl text-navy-900 lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl">
            What&apos;s Inside
          </h2>
          <ul className="mt-3 space-y-1.5 text-xs text-navy-900/70 lg:mt-2 lg:text-[11px] xl:mt-3 xl:text-xs 3xl:mt-4 3xl:text-sm">
            <li>— Tower-wise floor plans for 1, 2, 3 &amp; 4 BHK homes</li>
            <li>— Complete amenities &amp; specification sheet</li>
            <li>— Master layout, connectivity map &amp; site address</li>
            <li>— Payment plans, current offers &amp; RERA details</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const PREVIEWS = {
  "/": HomePreview,
  "/showcase": ShowcasePreview,
  "/gallery": GalleryPreviewBg,
  "/floor-plan": FloorPlanPreviewBg,
  "/location": LocationPreviewBg,
  "/brochure": BrochurePreview,
};

function HoverPreview({ path, active }) {
  const Preview = PREVIEWS[path];
  if (!Preview) return null;
  return <Preview active={active} />;
}

export default HoverPreview;
