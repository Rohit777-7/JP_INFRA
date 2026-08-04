import { memo, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaPlus, FaMinus } from "react-icons/fa";

const RING_RADII_KM = [1, 3, 5];

const LIGHT_TILES = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const projectIcon = L.divIcon({
  className: "",
  html: `
    <div class="relative flex h-6 w-6 items-center justify-center">
      <span class="absolute inline-flex h-6 w-6 animate-ping rounded-full bg-brand-red/50"></span>
      <span class="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-brand-red shadow-[0_0_18px_rgba(238,49,52,0.9)]"></span>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// A fresh divIcon per render means a fresh DOM node whenever active state
// (or the filtered list) changes — which is what lets the plain CSS
// keyframe in globals.css (.location-marker-pop) read as a marker animating
// in, without needing a Leaflet animation plugin. Hover scale is handled by
// a plain CSS :hover rule on the same class.
function placeIcon(active) {
  const size = active ? 28 : 20;
  const dot = active ? 16 : 12;
  return L.divIcon({
    className: "",
    html: `
      <div class="location-marker-pop flex cursor-pointer items-center justify-center" style="width:${size}px;height:${size}px">
        <span class="block rounded-full border-2 border-white shadow-md" style="width:${dot}px;height:${dot}px;background:${active ? "#ee3134" : "#19497c"}"></span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// react-leaflet has no declarative "centered on" prop — this reaches into
// the map instance imperatively whenever the selected place changes. The
// map instance itself (from useMap()) never changes identity for the life
// of this MapContainer, so this never tears anything down.
function FlyToController({ target, defaultCenter, defaultZoom }) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 16, { duration: 1.2 });
    } else {
      map.flyTo(defaultCenter, defaultZoom, { duration: 1.2 });
    }
  }, [target, map, defaultCenter, defaultZoom]);

  return null;
}

// Leaflet's stock zoom control fights Tailwind styling, so it's turned off
// on MapContainer (zoomControl={false}) and driven directly here instead.
function CustomZoomControl() {
  const map = useMap();

  return (
    <div className="absolute right-5 bottom-24 z-30 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy-950/80 shadow-xl backdrop-blur-md lg:bottom-28">
      <button
        type="button"
        aria-label="Zoom in"
        onClick={() => map.zoomIn()}
        className="flex h-10 w-10 items-center justify-center text-white transition-colors hover:bg-white/10 lg:h-11 lg:w-11"
      >
        <FaPlus className="h-3 w-3" />
      </button>
      <div className="h-px w-full bg-white/10" />
      <button
        type="button"
        aria-label="Zoom out"
        onClick={() => map.zoomOut()}
        className="flex h-10 w-10 items-center justify-center text-white transition-colors hover:bg-white/10 lg:h-11 lg:w-11"
      >
        <FaMinus className="h-3 w-3" />
      </button>
    </div>
  );
}

// Both basemaps stay mounted for the lifetime of the map and simply
// cross-fade via opacity (CSS transition lives on .location-tile-layer in
// globals.css) — swapping the `url` on a single TileLayer would hard-cut
// between tile sets, and unmounting/remounting a TileLayer on every toggle
// is exactly the kind of churn MapContainer must never see. Only one of the
// two carries the attribution string, so Leaflet's attribution control
// doesn't end up listing the same credit twice.
function ThemeTiles({ theme }) {
  return (
    <>
      <TileLayer key="light" className="location-tile-layer" attribution={CARTO_ATTRIBUTION} url={LIGHT_TILES} opacity={theme === "light" ? 1 : 0} />
      <TileLayer key="dark" className="location-tile-layer" url={DARK_TILES} opacity={theme === "dark" ? 1 : 0} />
    </>
  );
}

// `theme` is owned by Location.jsx (so the toggle can live in the sidebar
// header) and passed straight through as a prop — LocationMap never holds
// its own copy, so there's exactly one source of truth and no risk of the
// map's idea of the theme drifting from the toggle's.
function LocationMap({ coordinates, places, selectedPlaceId, onSelectPlace, theme }) {
  const center = useMemo(() => [coordinates.lat, coordinates.lng], [coordinates.lat, coordinates.lng]);
  const selectedPlace = useMemo(() => places.find((p) => p.id === selectedPlaceId) || null, [places, selectedPlaceId]);

  // Keyed only on [places, selectedPlaceId] — NOT on theme — so toggling the
  // basemap never recreates marker icons or touches marker.setIcon().
  const markerIcons = useMemo(() => {
    const icons = new Map();
    places.forEach((place) => icons.set(place.id, placeIcon(place.id === selectedPlaceId)));
    return icons;
  }, [places, selectedPlaceId]);

  return (
    <div className="relative h-full w-full">
      <MapContainer center={center} zoom={14} minZoom={12} maxZoom={17} zoomControl={false} scrollWheelZoom className="h-full w-full">
        <ThemeTiles theme={theme} />

        {RING_RADII_KM.map((km) => (
          <Circle
            key={km}
            center={center}
            radius={km * 1000}
            pathOptions={{
              color: "#ee3134",
              weight: 1.5,
              opacity: 0.55,
              fillOpacity: 0.03,
              dashArray: "6 8",
              className: "location-ring-dash",
            }}
          />
        ))}

        <Marker position={center} icon={projectIcon} />

        {places.map((place) => (
          <Marker key={place.id} position={[place.lat, place.lng]} icon={markerIcons.get(place.id)} eventHandlers={{ click: () => onSelectPlace(place) }}>
            <Popup className="location-popup">
              <p className="text-sm font-semibold text-white">{place.name}</p>
              <p className="mt-1 text-xs tracking-wider text-white/60 uppercase">{place.category}</p>
              <p className="mt-1 text-xs text-white/80">
                {place.distance} &middot; {place.time}
              </p>
            </Popup>
          </Marker>
        ))}

        <FlyToController target={selectedPlace} defaultCenter={center} defaultZoom={14} />
        <CustomZoomControl />
      </MapContainer>

      {/* Contrast overlay so the floating chrome stays legible on either basemap */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/45" />

      <p className="pointer-events-none absolute top-24 left-1/2 z-30 -translate-x-1/2 rounded-full border border-white/10 bg-navy-950/80 px-5 py-2 text-[10px] font-semibold tracking-[0.2em] text-white uppercase shadow-lg backdrop-blur-md lg:text-xs">
        Scroll or Pinch to Zoom
      </p>

      {/* Bottom-right, not bottom-left — that corner belongs to the app-wide UtilityBar */}
      <div className="pointer-events-none absolute right-5 bottom-5 z-30 flex gap-3 rounded-2xl border border-white/10 bg-navy-950/80 px-4 py-3 shadow-lg backdrop-blur-md">
        {RING_RADII_KM.map((km) => (
          <span key={km} className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-white uppercase lg:text-xs">
            <span className="h-2 w-2 rounded-full bg-brand-red" />
            {km} km
          </span>
        ))}
      </div>
    </div>
  );
}

// The parent (Location.jsx) re-renders on category/selection/theme changes —
// memo skips LocationMap's own re-render (and therefore the marker-icon
// work above) whenever none of ITS props actually changed.
export default memo(LocationMap);
