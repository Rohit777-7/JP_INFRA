// Shared premium easing/duration tokens — every GSAP/Framer Motion tween
// touched in the animation-upgrade pass pulls from here instead of each
// file re-declaring its own bezier/easing strings, so the whole site reads
// as one consistent motion language.

// GSAP-native easing names (used directly as the `ease` option).
export const GSAP_EASE = {
  expoOut: "expo.out",
  power4Out: "power4.out",
  power3Out: "power3.out",
  power2In: "power2.in",
};

// Cubic-bezier equivalents for Framer Motion (which doesn't understand
// GSAP's named eases) — expo.out and power4.out approximated as bezier
// curves so Framer-driven interactions (Gallery, Location) feel like the
// same easing family as the GSAP-driven entrances.
export const EASE = {
  expoOut: [0.16, 1, 0.3, 1],
  power4Out: [0.25, 1, 0.5, 1],
  power3Out: [0.22, 1, 0.36, 1],
  power2In: [0.55, 0, 0.85, 0.35],
};

export const DURATION = {
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
  cinematic: 1.2,
};

export const STAGGER = {
  tight: 0.045,
  base: 0.07,
  loose: 0.1,
};
