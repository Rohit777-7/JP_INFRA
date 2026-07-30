import { Html, useProgress } from "@react-three/drei";

// Suspense fallback for TowerViewer's Canvas — replaces the blank frame
// that showed while the Environment HDRI preset fetched, with a branded
// spinner + progress readout matching the rest of the site's uppercase
// tracked-letter, Bebas Neue treatment.
function SceneLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        <p className="font-display text-sm tracking-[0.3em] text-white/70 uppercase">
          Loading {Math.round(progress)}%
        </p>
      </div>
    </Html>
  );
}

export default SceneLoader;
