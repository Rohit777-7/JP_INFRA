import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  MeshReflectorMaterial,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ToneMapping,
  SSAO,
  DepthOfField,
  ChromaticAberration,
  Noise,
} from "@react-three/postprocessing";
import { ToneMappingMode, BlendFunction } from "postprocessing";
import gsap from "gsap";
import Tower from "./Tower";
import Skyline from "./Skyline";
import SceneLoader from "./SceneLoader";
import Particles from "./Particles";
import { TOWERS } from "../data/floors";
import { useDeviceTier } from "../hooks/useDeviceTier";

const FLOOR_HEIGHT = 0.28;

// Towers are built upward from y=0 (ground), so looking at the origin
// frames the ground at screen-centre and leaves the buildings floating in
// the top half of the canvas. Aiming the camera at the vertical midpoint of
// the tallest tower instead centres the actual buildings in frame.
const MAX_HEIGHT = Math.max(...TOWERS.map((t) => t.totalFloors)) * FLOOR_HEIGHT;
const TARGET_Y = MAX_HEIGHT / 2;

// Hoisted to a stable reference instead of an inline array literal on the
// OrbitControls element below — R3F reapplies a `target` prop that changes
// identity, so an inline `[0, TARGET_Y, 0]` would silently snap the orbit
// centre back to this default on every re-render, fighting FloorFocus's
// tween the moment a second floor is selected (TowerViewer re-renders
// whenever the `targetFloor` prop changes). Same value as before, just a
// reference that never changes.
const DEFAULT_ORBIT_TARGET = [0, TARGET_Y, 0];

const INTRO_END_POS = [0, TARGET_Y + 5, 13];
const INTRO_START_POS = [0, TARGET_Y + 14, 24];

// Smoothly moves OrbitControls' orbit centre to a given floor's height
// whenever `floor` changes, for the Drone View's floor selector. Camera
// position and orbit target are shifted by the same delta, which leaves the
// vector between them — so the current zoom/rotation the user already set
// with OrbitControls — untouched; the whole camera+target pair just glides
// up or down together. controls.update() every tick keeps OrbitControls'
// internal spherical state in sync, exactly like CameraIntro above.
function FloorFocus({ controlsRef, floor }) {
  const { camera } = useThree();

  useEffect(() => {
    const controls = controlsRef.current;
    if (floor == null || !controls) return;

    const floorY = floor * FLOOR_HEIGHT;
    const deltaY = floorY - controls.target.y;
    const tl = gsap.timeline({ defaults: { duration: 1.3, ease: "power3.inOut" } });
    tl.to(controls.target, { y: floorY }, 0);
    tl.to(camera.position, { y: camera.position.y + deltaY }, 0);
    tl.eventCallback("onUpdate", () => controls.update());

    return () => tl.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floor]);

  return null;
}

// Eases the camera in from a wide establishing shot to the default framing
// on mount, keeping OrbitControls' internal spherical state in sync via
// controls.update() on every tick. Skipped entirely (see TowerViewer) for
// prefers-reduced-motion, so this component only ever mounts when the move
// should happen.
function CameraIntro({ controlsRef, onComplete }) {
  const { camera } = useThree();

  useEffect(() => {
    const tween = gsap.to(camera.position, {
      x: INTRO_END_POS[0],
      y: INTRO_END_POS[1],
      z: INTRO_END_POS[2],
      duration: 2.2,
      ease: "power3.out",
      onUpdate: () => controlsRef.current?.update(),
      onComplete,
    });
    return () => tween.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

// quality, if passed, overrides the auto-detected device tier — unused
// today but costs nothing to support, for a future manual quality toggle.
//
// paused stops the R3F render loop (frameloop="never") without unmounting
// the Canvas — used by the Showcase hover-preview, which keeps this
// mounted after its first hover instead of destroying/recreating the
// WebGLRenderer on every hover in/out (repeated create/dispose of GL
// contexts in quick succession was exhausting the browser's WebGL context
// budget and surfacing as "Context Lost"). Pausing keeps the context alive
// but idle while hidden, so there's no ongoing GPU cost either.
//
// targetFloor, if passed, is the Drone View's floor selector wiring — a
// floor index (0 = ground) that FloorFocus above smoothly moves the camera
// to. Omitted entirely by every other caller, so nothing changes for them.
function TowerViewer({ quality, paused = false, targetFloor = null }) {
  const { tier: autoTier, prefersReducedMotion } = useDeviceTier();
  const tier = quality ?? autoTier;
  const highQuality = tier === "high";

  const controlsRef = useRef(null);
  // Auto-rotate only kicks in once the intro settles (or immediately if
  // there's no intro to run) — running both at once fights: autoRotate
  // nudges the controls' internal angle every frame independently of the
  // position tween, producing a jittery combined motion.
  const [autoRotate, setAutoRotate] = useState(prefersReducedMotion);

  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      shadows={highQuality}
      dpr={highQuality ? [1, 1.75] : [1, 1]}
      camera={{
        position: prefersReducedMotion ? INTRO_END_POS : INTRO_START_POS,
        fov: 40,
      }}
    >
      <color attach="background" args={["#12375d"]} />
      <fog attach="fog" args={["#6d89aa", 18, 45]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[8, 12, 6]} intensity={1.5} castShadow />
      <pointLight position={[-6, 6, -6]} intensity={0.9} color="#67b6ff" />
      {/* Warm rim/kicker light from behind the towers — cool navy key light
          in front, warm gold edge light behind, the classic two-tone
          premium-photography contrast. Cheap (no shadow), runs on both tiers. */}
      <pointLight position={[-5, 7, -9]} intensity={0.45} color="#ffb27a" />

      {!prefersReducedMotion && (
        <CameraIntro
          controlsRef={controlsRef}
          onComplete={() => setAutoRotate(true)}
        />
      )}

      <FloorFocus controlsRef={controlsRef} floor={targetFloor} />

      <Suspense fallback={<SceneLoader />}>
        {highQuality && (
          <Environment
            preset="sunset"
            background={false}
            environmentIntensity={1.2}
          />
        )}

        <Skyline />

        {highQuality && !prefersReducedMotion && <Particles />}

        {TOWERS.map((tower, i) => (
          <Tower
            key={tower.id}
            position={[i * 3 - (TOWERS.length - 1) * 1.5, 0, 0]}
            width={2 - i * 0.3}
            depth={2 - i * 0.3}
            height={tower.totalFloors * FLOOR_HEIGHT}
            floors={tower.totalFloors}
            color={tower.color}
            twinkle={highQuality}
          />
        ))}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.5}
          scale={20}
          blur={2}
          far={10}
        />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}>
          <planeGeometry args={[40, 40]} />
          {highQuality ? (
            <MeshReflectorMaterial
              resolution={1024}
              mixBlur={1}
              mixStrength={55}
              blur={[300, 100]}
              depthScale={1}
              minDepthThreshold={0.85}
              color="#0a1622"
              metalness={0.6}
              roughness={0.7}
              mirror={0.55}
            />
          ) : (
            <meshStandardMaterial color="#0a1622" roughness={1} />
          )}
        </mesh>
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.6}
        enablePan={false}
        target={DEFAULT_ORBIT_TARGET}
        minDistance={5}
        maxDistance={16}
        maxPolarAngle={Math.PI / 2.1}
      />

      {highQuality && (
        <EffectComposer multisampling={4} enableNormalPass>
          <SSAO
            radius={0.15}
            intensity={20}
            luminanceInfluence={0.4}
            color="#000814"
          />
          <DepthOfField
            worldFocusDistance={13}
            worldFocusRange={9}
            bokehScale={2}
          />
          <Bloom
            intensity={1}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.35}
            mipmapBlur
          />
          <ChromaticAberration
            offset={[0.0006, 0.0006]}
            radialModulation={false}
            modulationOffset={0}
          />
          <Noise
            premultiply
            blendFunction={BlendFunction.SOFT_LIGHT}
            opacity={0.15}
          />
          <Vignette eskil={false} offset={0.15} darkness={0.35} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </Canvas>
  );
}

export default TowerViewer;
