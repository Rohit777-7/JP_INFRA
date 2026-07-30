import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const RED = "#ee3134";

// Deterministic hash so lit-window placement is stable across renders
// instead of depending on Math.random (which would be impure in render).
function seededRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// twinkle is tier-gated by the caller (TowerViewer) — off on low tier since
// it touches every window mesh's material every frame.
function Tower({ position, width, depth, height, floors, color, twinkle = false }) {
  const lightRefs = useRef([]);

  useFrame(({ clock }) => {
    if (!twinkle) return;
    const t = clock.elapsedTime;
    lightRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.material.opacity = 0.82 + 0.18 * Math.sin(t * 0.6 + i * 1.7);
    });
  });

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
        <meshPhysicalMaterial
          color={color}
          roughness={0.4}
          metalness={0.2}
          clearcoat={0.5}
          clearcoatRoughness={0.2}
        />
      </mesh>

      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.06} />
      </mesh>

      {lights.map(([x, y, z], i) => (
        <mesh key={i} ref={(el) => (lightRefs.current[i] = el)} position={[x, y + height / 2, z]}>
          <planeGeometry args={[width / 10, height / floors / 2.6]} />
          <meshBasicMaterial color={i % 5 === 0 ? RED : "#ffd98a"} toneMapped={false} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export default Tower;
