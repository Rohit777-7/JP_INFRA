import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Ambient floating motes around the towers — embient depth, not a focal
// element. Single draw call (one THREE.Points, no per-particle React
// state), whole-group drift/rotation only (no per-vertex CPU work per
// frame), so this stays cheap enough to leave running continuously.
// Caller (TowerViewer) gates this behind the high device tier and
// prefers-reduced-motion.
function Particles({ count = 110, radius = 15, height = 11 }) {
  const pointsRef = useRef(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = Math.random() * height - height * 0.15;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    return arr;
  }, [count, radius, height]);

  useFrame(({ clock }) => {
    const group = pointsRef.current;
    if (!group) return;
    const t = clock.elapsedTime;
    group.rotation.y = t * 0.015;
    group.position.y = Math.sin(t * 0.15) * 0.3;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#bcd9ff"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default Particles;
