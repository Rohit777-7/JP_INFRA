import { Suspense, lazy } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { cx } from "../../utils/helpers";
import { BRAND } from "../../utils/constants";
import { GALLERY_ITEMS } from "../../data/gallery";
import { NEARBY_PLACES, SITE_COORDINATES } from "../../data/location";
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

function ShowcasePreview() {
  return (
    <div className="relative h-full w-full bg-navy-950">
      <Suspense fallback={null}>
        <TowerViewer />
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

function LocationPreviewBg() {
  const { lat, lng } = SITE_COORDINATES;
  const delta = 0.012;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join(",");
  return (
    <div className="relative h-full w-full">
      <iframe
        title="North Garden City location map"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`}
        className="h-full w-full grayscale-[15%]"
        loading="lazy"
      />
      <div
        className="
    absolute right-6 bottom-6 max-w-xs border border-white/20 bg-navy-950/85 p-4 text-white backdrop-blur-sm
    md:right-10
    lg:right-6 lg:bottom-6 lg:max-w-[13rem] lg:p-3
    xl:right-8 xl:max-w-xs xl:p-4
    2xl:right-10 2xl:bottom-8
    3xl:right-14 3xl:bottom-10 3xl:max-w-sm 3xl:p-5
    4xl:right-20 4xl:bottom-12 4xl:max-w-sm 4xl:p-6
  "
      >
        <p className="mb-2 flex items-center gap-2 text-xs tracking-[0.15em] text-white/50 uppercase 3xl:text-sm">
          <FaMapMarkerAlt className="h-3 w-3 text-brand-red" /> Nearby
        </p>
        <ul className="space-y-1 text-sm lg:text-xs xl:text-sm 3xl:text-base">
          {NEARBY_PLACES.slice(0, 3).map((place) => (
            <li key={place.id} className="flex justify-between gap-4">
              <span>{place.name}</span>
              <span className="text-white/40">{place.distance}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BrochurePreview() {
  return (
    <div className="flex h-full w-full items-center justify-end bg-navy-50 px-10 md:px-20 lg:px-10 xl:px-14 2xl:px-16 3xl:px-24 4xl:px-32">
      <div className="w-56 -rotate-6 bg-navy-700 p-6 text-white shadow-2xl lg:w-48 lg:p-5 xl:w-52 xl:p-6 2xl:w-56 3xl:w-64 3xl:p-7 4xl:w-72 4xl:p-8">
        <span className="border border-brand-red px-2 py-0.5 text-[10px] tracking-widest">JP INFRA</span>
        <p className="mt-16 font-display text-3xl leading-none lg:mt-10 lg:text-2xl xl:mt-14 xl:text-3xl 3xl:mt-20 3xl:text-4xl 4xl:text-5xl">{BRAND.tagline}</p>
        <p className="mt-2 text-xs text-white/70">{BRAND.subline}</p>
        <p className="mt-20 text-[10px] leading-relaxed text-white/50 lg:mt-12 xl:mt-16 3xl:mt-24">{BRAND.rera}</p>
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

function HoverPreview({ path }) {
  const Preview = PREVIEWS[path];
  if (!Preview) return null;
  return <Preview />;
}

export default HoverPreview;
