import { useCallback, useMemo, useState } from "react";

import Layout from "../components/layout/Layout";
import FooterBar from "../components/layout/FooterBar";
import UtilityBar from "../components/layout/UtilityBar";
import ErrorBoundary from "../components/ErrorBoundary";
import LocationMap from "../components/location/LocationMap";
import LocationSidebar from "../components/location/LocationSidebar";
import { useGsap } from "../hooks/useAnimation";

import {
  LOCATION_CATEGORIES,
  NEARBY_PLACES,
  SITE_COORDINATES,
} from "../data/location";

function Location() {
  const [category, setCategory] = useState("All");
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [theme, setTheme] = useState("light");

  const filteredPlaces = useMemo(() => {
    if (category === "All") return NEARBY_PLACES;
    return NEARBY_PLACES.filter((place) => place.category === category);
  }, [category]);

  const handleCategoryChange = useCallback((cat) => {
    setCategory(cat);
    setSelectedPlaceId(null);
  }, []);

  const handleSelectPlace = useCallback((place) => {
    setSelectedPlaceId((current) => (current === place.id ? null : place.id));
  }, []);

  // One-time entrance choreography, same gsap.context pattern as
  // LandingSplash — runs once on mount only (empty deps), never replays on
  // category/theme/selection updates since those don't remount this page.
  const scope = useGsap((gsap, root) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(root.querySelector("[data-location-map]"), {
      opacity: 0,
      scale: 1.08,
      duration: 1.1,
    })
      .from(
        root.querySelector("[data-location-sidebar]"),
        { opacity: 0, x: 120, duration: 0.9 },
        "-=0.75",
      )
      .from(
        root.querySelectorAll("[data-location-in]"),
        { opacity: 0, y: 16, duration: 0.5, stagger: 0.06 },
        "-=0.5",
      );
  }, []);

  return (
    <Layout>
      <div
        ref={scope}
        className="relative h-screen w-full overflow-hidden bg-navy-950"
      >
        <div data-location-map className="absolute inset-0">
          <ErrorBoundary>
            <LocationMap
              coordinates={SITE_COORDINATES}
              places={filteredPlaces}
              selectedPlaceId={selectedPlaceId}
              onSelectPlace={handleSelectPlace}
              theme={theme}
            />
          </ErrorBoundary>
        </div>

        <LocationSidebar
          categories={LOCATION_CATEGORIES}
          activeCategory={category}
          onCategoryChange={handleCategoryChange}
          places={filteredPlaces}
          allPlaces={NEARBY_PLACES}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={handleSelectPlace}
          theme={theme}
          onThemeChange={setTheme}
        />

        <UtilityBar
          position="
    bottom-20 left-6
    md:left-16
    lg:bottom-20
    xl:bottom-24
    2xl:bottom-24
    3xl:bottom-28
    4xl:bottom-32
  "
        />

        <div className="absolute inset-x-0 bottom-0 z-40">
          <FooterBar />
        </div>
      </div>
    </Layout>
  );
}

export default Location;
