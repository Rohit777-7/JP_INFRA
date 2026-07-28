# North Garden City — JP Infra

**Stand Tall.** An immersive, single-screen microsite for JP Infra's North Garden City — the tallest towers of Mira Road. Built with React, Three.js, GSAP, and Tailwind CSS, and designed to feel like an app rather than a webpage: no page ever scrolls, navigation happens by hovering and clicking, and every screen shows real content instead of static mockups.

---

## What makes this site different

**A cinematic entry, not a wall of text.** Land on a live, drag-to-rotate 3D render of the towers — modeled to the project's real tower and floor counts — before ever seeing a menu.

**Hover to see, click to go.** A floating navigation card crossfades the full-bleed background to a real preview of whatever you're hovering — actual gallery photos for Gallery, the real interactive floor plate for Floor Plan, the live embedded map for Location, the actual brochure cover for Brochure. Clicking is what commits you to the full page; hovering alone already shows you what's there.

**Every page is one screen.** No page on this site scrolls. Dense content — the photo grid, the unit list — gets its own small internal scroll area; the page itself never does.

**A real floor-plan tool, not a static image.** Compare up to two floor plans side by side, filter units by configuration and status, and click any unit on the visual floor plate for full specifications — carpet area, facing, price, availability.

---

## Tech stack

| Layer | Choice |
|---|---|
| UI framework | React 19 + React Router 7 |
| 3D | Three.js via `@react-three/fiber` + `@react-three/drei` |
| Motion | GSAP |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Icons | react-icons |
| Build tool | Vite |

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build
npm run lint      # eslint
npm run preview   # preview the production build locally
```

## Project structure

```
src/
├── pages/            One file per route — Home, Showcase, Gallery,
│                      FloorPlan, Location, Brochure. Each renders a
│                      single fixed-height screen: CompactHeader,
│                      the page's content, FooterBar.
├── sections/          Home-specific screens: LandingSplash (the 3D
│                      entry) and Hero (splash ⇄ menu state machine).
├── components/
│   ├── layout/        Navbar, MenuOverlay, HoverNav + HoverPreviews
│   │                  (the hover-preview navigation and its per-page
│   │                  content previews), FooterBar.
│   ├── common/        Logo, CompactHeader.
│   ├── floorplan/      FloorPlate (the visual, clickable floor plan)
│   │                  and UnitDetail (the unit spec drawer).
│   └── ui/             Button, SectionHeading.
├── three/              Tower.jsx (a single procedural tower) and
│                      TowerViewer.jsx (the draggable multi-tower scene).
├── data/               All project content lives here — towers,
│                      floor plans, units, amenities, gallery, location.
│                      Swap in real data without touching any component.
├── hooks/              useGsap (scoped GSAP animations), useMouse.
├── utils/              constants.js (brand name, taglines, contact
│                      info, nav links) and small helpers.
└── routes/             React Router route table.
```

## Making it yours

Everything specific to this one project is isolated so it's a straight swap, not a rewrite:

- **Brand & contact info** — `src/utils/constants.js`
- **Towers, floor plans & units** — `src/data/floors.js`, `src/data/units.js`
- **Amenities, gallery, location** — `src/data/amenities.js`, `src/data/gallery.js`, `src/data/location.js`
- **Logo** — `src/components/common/Logo.jsx` currently recreates the brand mark in CSS/SVG; drop a real exported logo file into `src/assets/images` and swap it in.
- **Brochure PDF** — place the real file at `public/brochure.pdf`; the download button on the Brochure page already points there.
- **Gallery/preview photos** — currently placeholder images; replace the `src` URLs in `src/data/gallery.js` with real photography.

## Browser support

Built and tested against evergreen Chromium-based browsers. The 3D scenes use WebGL and fall back gracefully (no crash, just no tower model) in environments without it.
