import { useMemo, useState } from "react";
import { FaTrain, FaGraduationCap, FaHospital, FaShoppingBag, FaBriefcase, FaMapMarkedAlt } from "react-icons/fa";
import Layout from "../components/layout/Layout";
import FooterBar from "../components/layout/FooterBar";
import CompactHeader from "../components/common/CompactHeader";
import { cx } from "../utils/helpers";
import { LOCATION_CATEGORIES, NEARBY_PLACES, SITE_COORDINATES } from "../data/location";
import { BRAND } from "../utils/constants";

const CATEGORY_ICONS = {
  Transit: FaTrain,
  Education: FaGraduationCap,
  Healthcare: FaHospital,
  Shopping: FaShoppingBag,
  Business: FaBriefcase,
};

function mapEmbedUrl({ lat, lng }) {
  const delta = 0.012;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

function Location() {
  const [category, setCategory] = useState("All");

  const places = useMemo(
    () => (category === "All" ? NEARBY_PLACES : NEARBY_PLACES.filter((p) => p.category === category)),
    [category]
  );

  return (
    <Layout>
      <div className="flex h-screen flex-col overflow-hidden bg-navy-950">
        <CompactHeader eyebrow="Location" title="Right Where You Need To Be" description={BRAND.address} />

        <div className="mx-auto grid min-h-0 w-full max-w-[1800px] flex-1 gap-6 px-6 py-4 md:px-16 lg:grid-cols-[1.1fr_1fr]">
          <div className="min-h-0 overflow-hidden border border-white/10">
            <iframe
              title="North Garden City location map"
              src={mapEmbedUrl(SITE_COORDINATES)}
              className="h-full w-full grayscale-[20%]"
              loading="lazy"
            />
          </div>

          <div className="flex min-h-0 flex-col">
            <div className="flex shrink-0 flex-wrap gap-2">
              {LOCATION_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cx(
                    "border px-4 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase transition-colors",
                    category === cat
                      ? "border-brand-red bg-brand-red text-white"
                      : "border-white/15 text-white/70 hover:border-white/40"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <ul className="mt-3 min-h-0 flex-1 divide-y divide-white/10 overflow-y-auto">
              {places.map((place) => {
                const Icon = CATEGORY_ICONS[place.category] ?? FaMapMarkedAlt;
                return (
                  <li key={place.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 text-brand-red">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{place.name}</p>
                        <p className="text-[10px] tracking-wide text-white/40 uppercase">{place.category}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-white/60">
                      <p>{place.distance}</p>
                      <p className="text-white/40">{place.time}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <FooterBar />
      </div>
    </Layout>
  );
}

export default Location;
