import { createContext, useContext, useMemo, useState } from "react";

const MenuOverlayContext = createContext(null);

// Single shared open/closed state for the full-screen HoverNav modal
// (MenuOverlay) — lives above Layout so every page can trigger it the same
// way, including pages that render Layout with hideNavbar (Showcase), which
// would otherwise never mount the overlay at all since it used to live
// inside Navbar's own local state.
export function MenuOverlayProvider({ children }) {
  const [open, setOpen] = useState(false);

  const value = useMemo(
    () => ({
      open,
      openMenu: () => setOpen(true),
      closeMenu: () => setOpen(false),
      toggleMenu: () => setOpen((v) => !v),
    }),
    [open]
  );

  return <MenuOverlayContext.Provider value={value}>{children}</MenuOverlayContext.Provider>;
}

export function useMenuOverlay() {
  const ctx = useContext(MenuOverlayContext);
  if (!ctx) {
    throw new Error("useMenuOverlay must be used within a MenuOverlayProvider");
  }
  return ctx;
}
