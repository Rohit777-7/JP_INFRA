import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Gallery from "../pages/Gallery";
import Showcase from "../pages/Showcase";
import FloorPlan from "../pages/FloorPlan";
import Location from "../pages/Location";
import Brochure from "../pages/Brochure";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/floor-plan" element={<FloorPlan />} />
        <Route path="/location" element={<Location />} />
        <Route path="/brochure" element={<Brochure />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;