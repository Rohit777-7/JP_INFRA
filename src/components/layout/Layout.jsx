import Navbar from "./Navbar";
import MenuOverlay from "./MenuOverlay";

// MenuOverlay is mounted here (not inside Navbar) so it's available even on
// pages that pass hideNavbar (Showcase) — every page's BackButton opens the
// same overlay regardless of whether that page also shows the top Navbar.
function Layout({ children, hideNavbar = false }) {
  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      <MenuOverlay />
    </>
  );
}

export default Layout;