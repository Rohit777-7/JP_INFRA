import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";

// Home ships eagerly since it's the landing page every visitor hits first.
// Everything else is only ever reached by a click, so lazy-loading it keeps
// that first load lean instead of shipping Three.js/postprocessing, Leaflet,
// and every other page's code up front.
const Gallery = lazy(() => import("../pages/Gallery"));
const Showcase = lazy(() => import("../pages/Showcase"));
const FloorPlan = lazy(() => import("../pages/FloorPlan"));
const Location = lazy(() => import("../pages/Location"));
const Brochure = lazy(() => import("../pages/Brochure"));
const DroneView = lazy(() => import("../pages/DroneView"));

function RouteFallback() {
  return <div className="h-screen w-full bg-navy-950" />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/floor-plan" element={<FloorPlan />} />
          <Route path="/location" element={<Location />} />
          <Route path="/brochure" element={<Brochure />} />
          <Route path="/drone-view" element={<DroneView />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;