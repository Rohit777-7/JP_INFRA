import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaMapMarkerAlt, FaVolumeMute, FaVolumeUp, FaInfoCircle, FaExpand, FaCompress } from "react-icons/fa";
import { BRAND } from "../../utils/constants";

// Bottom-left HUD strip — quick access to Home, a mute toggle (ready for
// ambient audio if the project ever adds any), a brief project-info popover,
// the Location page, and the browser Fullscreen API. Square icon buttons
// only, no labels, so it stays out of the way of whatever's behind it.
// Used on Home/the hover-preview menu and on the Floor Plan page.
function UtilityBar({ position = "bottom-6 left-6 md:left-16" }) {
  const [muted, setMuted] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    function onFullscreenChange() {
      setFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  const buttonClass =
    "flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-navy-950/50 text-white/80 backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-navy-950/70 hover:text-white";

  return (
    <div className={`absolute z-20 flex items-center gap-2 ${position}`}>
      <Link to="/" aria-label="Home" className={buttonClass}>
        <FaHome className="h-4 w-4" />
      </Link>
      <button
        type="button"
        onClick={() => setMuted((v) => !v)}
        aria-label={muted ? "Unmute" : "Mute"}
        aria-pressed={muted}
        className={buttonClass}
      >
        {muted ? <FaVolumeMute className="h-4 w-4" /> : <FaVolumeUp className="h-4 w-4" />}
      </button>
      <div className="relative">
        <button
          type="button"
          onClick={() => setInfoOpen((v) => !v)}
          aria-label="Project info"
          aria-expanded={infoOpen}
          className={buttonClass}
        >
          <FaInfoCircle className="h-4 w-4" />
        </button>
        {infoOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-64 rounded-lg border border-navy-900/10 bg-sand-50/95 p-4 text-navy-900 shadow-2xl backdrop-blur-md">
            <p className="font-display text-lg leading-tight">{BRAND.project}</p>
            <p className="mt-1 text-xs text-navy-900/60">{BRAND.subline}</p>
            <p className="mt-2 text-[11px] text-navy-900/50">{BRAND.address}</p>
            <p className="mt-2 text-[10px] text-navy-900/40">{BRAND.rera}</p>
          </div>
        )}
      </div>
      <Link to="/location" aria-label="Location" className={buttonClass}>
        <FaMapMarkerAlt className="h-4 w-4" />
      </Link>
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        aria-pressed={fullscreen}
        className={buttonClass}
      >
        {fullscreen ? <FaCompress className="h-4 w-4" /> : <FaExpand className="h-4 w-4" />}
      </button>
    </div>
  );
}

export default UtilityBar;
