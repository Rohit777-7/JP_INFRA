import { useMemo } from "react";

// Different seed offsets than Tower.jsx's seededRandom so skyline placement
// doesn't correlate with window placement.
function seededRandom(seed) {
  const x = Math.sin(seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Flat, unlit silhouette boxes ringing the hero towers at a distance — no
// textures or lighting cost (meshBasicMaterial, no shadows), just enough
// shape variation for the horizon to read as "a city" instead of a black
// void once fog fades them toward the background color. Cheap enough to run
// on every device tier.
function Skyline({ count = 18, radius = 20 }) {
  const buildings = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2;
      const dist = radius + seededRandom(i * 13.1) * 12;
      const height = 1.5 + seededRandom(i * 4.7 + 3) * 5;
      const width = 0.8 + seededRandom(i * 9.3 + 7) * 0.9;
      arr.push({
        position: [Math.sin(angle) * dist, height / 2, Math.cos(angle) * dist],
        width,
        height,
      });
    }
    return arr;
  }, [count, radius]);

  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={b.position}>
          <boxGeometry args={[b.width, b.height, b.width]} />
          <meshBasicMaterial color="#0a1830" />
        </mesh>
      ))}
    </group>
  );
}

export default Skyline;
