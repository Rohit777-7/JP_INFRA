import { useMemo } from "react";

const RED = "#ee3134";

// Deterministic hash so lit-window placement is stable across renders
// instead of depending on Math.random (which would be impure in render).
function seededRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function Tower({ position, width, depth, height, floors, color }) {
  const lights = useMemo(() => {
    const arr = [];
    const cols = 4;
    for (let f = 0; f < floors; f += 1) {
      for (let c = 0; c < cols; c += 1) {
        if (seededRandom(f * 131 + c * 7 + width * 17) > 0.55) continue;
        arr.push([
          (c / (cols - 1) - 0.5) * (width * 0.8),
          f * (height / floors) - height / 2 + height / floors / 2,
          depth / 2 + 0.02,
        ]);
      }
    }
    return arr;
  }, [floors, width, height, depth]);

  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.25} />
      </mesh>

      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.06} />
      </mesh>

      {lights.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y + height / 2, z]}>
          <planeGeometry args={[width / 10, height / floors / 2.6]} />
          <meshBasicMaterial color={i % 5 === 0 ? RED : "#ffd98a"} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export default Tower;
