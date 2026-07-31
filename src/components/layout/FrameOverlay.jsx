// Purely decorative "gallery frame" — a thin inset border with corner
// brackets, laid over a page's full-screen container. Never intercepts
// clicks (pointer-events-none throughout), so it can sit at the top of the
// z-order without breaking any interactive element beneath it.
function FrameOverlay() {
  const corner = "absolute h-6 w-6 border-brand-red/40";

  return (
    <div className="pointer-events-none absolute inset-4 z-30 border border-white/10 md:inset-6">
      <span className={`${corner} top-0 left-0 border-t-2 border-l-2`} />
      <span className={`${corner} top-0 right-0 border-t-2 border-r-2`} />
      <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${corner} right-0 bottom-0 border-r-2 border-b-2`} />
    </div>
  );
}

export default FrameOverlay;
