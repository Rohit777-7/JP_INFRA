import { createContext, useContext, useMemo, useState } from "react";

const MenuOverlayContext = createContext(null);

// Single shared open/closed state for the full-screen HoverNav modal
// (MenuOverlay) — lives above Layout so every page can trigger it the same
// way, including pages that render Layout with hideNavbar (Showcase), which
// would otherwise never mount the overlay at all since it used to live
// inside Navbar's own local state.
export function MenuOverlayProvider({ children }) {
  const [open, setOpen] = useState(false);

  // Blur before closing, not after: MenuOverlay sets aria-hidden="true" on
  // the overlay root as soon as `open` flips false, and the browser warns
  // (and assistive tech breaks) if a descendant of an aria-hidden subtree
  // still holds focus — which it does here, since closing is normally
  // triggered by clicking a focusable row/button inside the overlay itself.
  // Blurring synchronously in the same event, before the state update that
  // drives the re-render, means focus is already gone by the time
  // aria-hidden is applied.
  function closeMenu() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setOpen(false);
  }

  const value = useMemo(
    () => ({
      open,
      openMenu: () => setOpen(true),
      closeMenu,
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
