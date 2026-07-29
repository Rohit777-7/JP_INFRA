import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import Tower from "./Tower";
import { TOWERS } from "../data/floors";

const FLOOR_HEIGHT = 0.28;

// Towers are built upward from y=0 (ground), so looking at the origin
// frames the ground at screen-centre and leaves the buildings floating in
// the top half of the canvas. Aiming the camera at the vertical midpoint of
// the tallest tower instead centres the actual buildings in frame.
const MAX_HEIGHT = Math.max(...TOWERS.map((t) => t.totalFloors)) * FLOOR_HEIGHT;
const TARGET_Y = MAX_HEIGHT / 2;

function TowerViewer() {
  return (
    <Canvas shadows dpr={[1, 1.75]} camera={{ position: [0, TARGET_Y + 5, 13], fov: 40 }}>
      <color attach="background" args={["#0f2138"]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 10, 4]} intensity={1.2} castShadow />
      <pointLight position={[-6, 4, -4]} intensity={0.5} color="#2b71bd" />

      <Suspense fallback={null}>
        {TOWERS.map((tower, i) => (
          <Tower
            key={tower.id}
            position={[i * 3 - (TOWERS.length - 1) * 1.5, 0, 0]}
            width={2 - i * 0.3}
            depth={2 - i * 0.3}
            height={tower.totalFloors * FLOOR_HEIGHT}
            floors={tower.totalFloors}
            color={tower.color}
          />
        ))}
        <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={20} blur={2} far={10} />
      </Suspense>

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.8}
        enablePan={false}
        target={[0, TARGET_Y, 0]}
        minDistance={5}
        maxDistance={16}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
}

export default TowerViewer;
