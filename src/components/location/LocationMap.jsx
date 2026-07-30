import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const RING_RADII_KM = [1, 3, 5];

// Leaflet's default marker PNGs don't resolve through Vite's bundler without
// extra asset config — a plain CSS divIcon sidesteps that entirely and
// matches the brand-red accent instead of the generic blue Leaflet pin.
const projectIcon = L.divIcon({
  className: "",
  html: '<span class="block h-[18px] w-[18px] rounded-[50%_50%_50%_0] border-2 border-white bg-brand-red shadow-lg" style="transform:rotate(-45deg)"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 18],
});

// A real, zoomable/pannable Leaflet map (replacing the old static OSM
// iframe embed) so scroll/pinch zoom actually feels responsive, plus
// distance rings around the project site for an "everything within reach"
// read at a glance.
function LocationMap({ coordinates }) {
  const center = useMemo(() => [coordinates.lat, coordinates.lng], [coordinates.lat, coordinates.lng]);

  return (
    <div className="relative h-full w-full">
      <MapContainer center={center} zoom={14} minZoom={11} maxZoom={18} scrollWheelZoom className="h-full w-full grayscale-[25%]">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {RING_RADII_KM.map((km) => (
          <Circle
            key={km}
            center={center}
            radius={km * 1000}
            pathOptions={{ color: "#ee3134", weight: 1, opacity: 0.35, fillOpacity: 0.03 }}
          />
        ))}

        <Marker position={center} icon={projectIcon} />
      </MapContainer>

      <p className="pointer-events-none absolute top-3 right-3 z-[500] text-[10px] font-semibold tracking-[0.2em] text-white/70 uppercase [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
        Scroll or Pinch to Zoom
      </p>

      <div className="pointer-events-none absolute bottom-3 left-3 z-[500] flex gap-3 border border-white/20 bg-navy-950/85 px-3 py-2 text-[10px] tracking-wide text-white/70 uppercase backdrop-blur-sm">
        {RING_RADII_KM.map((km) => (
          <span key={km} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full border border-brand-red" />
            {km} km
          </span>
        ))}
      </div>
    </div>
  );
}

export default LocationMap;
