export const AMENITIES = [
  {
    id: "sky-deck",
    name: "Sky Deck & Infinity Pool",
    category: "Leisure",
    description:
      "A rooftop infinity pool and deck overlooking the Mira Road skyline, open till midnight.",
    icon: "pool",
  },
  {
    id: "clubhouse",
    name: "Grand Clubhouse",
    category: "Leisure",
    description:
      "18,000 sq. ft. clubhouse with banquet hall, indoor games, and co-working lounge.",
    icon: "building",
  },
  {
    id: "gym",
    name: "State-of-the-art Gymnasium",
    category: "Fitness",
    description: "Fully-equipped, double-height gym with dedicated yoga and aerobics studio.",
    icon: "dumbbell",
  },
  {
    id: "gardens",
    name: "Landscaped Gardens",
    category: "Outdoor",
    description: "Themed podium gardens with seating decks, reflexology path, and senior citizen zone.",
    icon: "tree",
  },
  {
    id: "kids-play",
    name: "Kids' Play Area",
    category: "Family",
    description: "Dedicated outdoor and indoor play zones with soft-play equipment for children.",
    icon: "child",
  },
  {
    id: "sports",
    name: "Multi-purpose Sports Court",
    category: "Fitness",
    description: "Half-court basketball, badminton, and box cricket net on the podium deck.",
    icon: "basketball",
  },
  {
    id: "security",
    name: "24x7 Security & CCTV",
    category: "Safety",
    description: "Multi-tier security with CCTV surveillance, video door phones, and access control.",
    icon: "shield",
  },
  {
    id: "power-backup",
    name: "100% Power Backup",
    category: "Convenience",
    description: "Full power backup for common areas and residences, plus dedicated EV charging bays.",
    icon: "bolt",
  },
  {
    id: "amphitheatre",
    name: "Open-air Amphitheatre",
    category: "Leisure",
    description: "A landscaped amphitheatre for community events, festivals, and gatherings.",
    icon: "theatre",
  },
];

export const AMENITY_CATEGORIES = [
  "All",
  ...new Set(AMENITIES.map((a) => a.category)),
];
