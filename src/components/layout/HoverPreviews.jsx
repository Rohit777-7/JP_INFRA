import { FaMapMarkerAlt } from "react-icons/fa";
import { BRAND } from "../../utils/constants";
import { GALLERY_ITEMS } from "../../data/gallery";
import { NEARBY_PLACES, SITE_COORDINATES } from "../../data/location";
import { FLOOR_PLANS } from "../../data/floors";
import FloorPlate from "../floorplan/FloorPlate";
import TowerViewer from "../../three/TowerViewer";

// Real, non-interactive previews of each page's actual content — shown
// full-bleed behind the nav card while hovering, so hovering alone is
// enough to see what's there. Clicking still takes you into the full page.

function HomePreview() {
  return (
    <div className="relative h-full w-full">
      <img src={GALLERY_ITEMS[0].src} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/70 via-navy-950/10 to-transparent" />
      <div className="absolute right-10 bottom-14 max-w-sm text-right md:right-20">
        <p className="font-display text-5xl text-white">{BRAND.tagline}</p>
        <p className="mt-1 text-white/70">{BRAND.subline}</p>
      </div>
    </div>
  );
}

function ShowcasePreview() {
  return (
    <div className="relative h-full w-full bg-navy-950">
      <TowerViewer />
      <div className="absolute right-10 bottom-14 max-w-sm text-right text-white md:right-20">
        <p className="font-display text-3xl">Two Towers, One Skyline</p>
        <p className="mt-1 text-sm text-white/60">Azure &amp; Emerald, scaled to their real floor counts</p>
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
    <div className="flex h-full w-full items-center justify-end bg-navy-950 px-10 md:px-20">
      <div className="w-full max-w-xl">
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
      <div className="absolute right-6 bottom-6 max-w-xs border border-white/20 bg-navy-950/85 p-4 text-white backdrop-blur-sm md:right-10">
        <p className="mb-2 flex items-center gap-2 text-xs tracking-[0.15em] text-white/50 uppercase">
          <FaMapMarkerAlt className="h-3 w-3 text-brand-red" /> Nearby
        </p>
        <ul className="space-y-1 text-sm">
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
    <div className="flex h-full w-full items-center justify-end bg-navy-50 px-10 md:px-20">
      <div className="w-56 -rotate-6 bg-navy-700 p-6 text-white shadow-2xl">
        <span className="border border-brand-red px-2 py-0.5 text-[10px] tracking-widest">JP INFRA</span>
        <p className="mt-16 font-display text-3xl leading-none">{BRAND.tagline}</p>
        <p className="mt-2 text-xs text-white/70">{BRAND.subline}</p>
        <p className="mt-20 text-[10px] leading-relaxed text-white/50">{BRAND.rera}</p>
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
