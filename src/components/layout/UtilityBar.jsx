import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaHome, FaMapMarkerAlt, FaVolumeMute, FaVolumeUp, FaInfoCircle, FaExpand, FaCompress } from "react-icons/fa";
import { BRAND } from "../../utils/constants";
import { EASE } from "../../utils/easing";

// Bottom-left HUD strip — quick access to Home, a mute toggle (ready for
// ambient audio if the project ever adds any), a brief project-info popover,
// the Location page, and the browser Fullscreen API. Square icon buttons
// only, no labels, so it stays out of the way of whatever's behind it.
// Used on Home/the hover-preview menu and on the Floor Plan page.
function UtilityBar({
  position = "bottom-6 left-6 md:left-16 lg:bottom-5 lg:left-10 xl:bottom-6 xl:left-12 2xl:bottom-8 2xl:left-14 3xl:bottom-10 3xl:left-20 4xl:bottom-12 4xl:left-28",
  // Optional: fires alongside the Home button's normal navigate-to-"/" —
  // Home's inline HoverNav passes its onBack (return to the landing splash)
  // here so this same button also resets that view, instead of needing a
  // second dedicated "back" button elsewhere on the page. Every other page
  // leaves this unset, so the Home button stays a plain link there.
  onHomeClick,
}) {
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
    "flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-navy-950/50 text-white/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:border-brand-red/50 hover:bg-navy-950/70 hover:text-white hover:shadow-[0_8px_24px_-4px_rgba(238,49,52,0.4)] lg:h-8 lg:w-8 lg:rounded-md xl:h-9 xl:w-9 xl:rounded-lg 2xl:h-10 2xl:w-10 3xl:h-11 3xl:w-11 4xl:h-12 4xl:w-12";
  const iconClass = "h-4 w-4 lg:h-3.5 lg:w-3.5 xl:h-4 xl:w-4 3xl:h-[18px] 3xl:w-[18px] 4xl:h-5 4xl:w-5";

  return (
    <div className={`absolute z-20 flex items-center gap-2 lg:gap-1.5 xl:gap-2 3xl:gap-2.5 4xl:gap-3 ${position}`}>
      <Link to="/" aria-label="Home" data-cursor="view" className={buttonClass} onClick={onHomeClick}>
        <FaHome className={iconClass} />
      </Link>
      <button
        type="button"
        onClick={() => setMuted((v) => !v)}
        aria-label={muted ? "Unmute" : "Mute"}
        aria-pressed={muted}
        data-cursor="view"
        className={buttonClass}
      >
        {muted ? <FaVolumeMute className={iconClass} /> : <FaVolumeUp className={iconClass} />}
      </button>
      <div className="relative">
        <button
          type="button"
          onClick={() => setInfoOpen((v) => !v)}
          aria-label="Project info"
          aria-expanded={infoOpen}
          data-cursor="view"
          className={buttonClass}
        >
          <FaInfoCircle className={iconClass} />
        </button>
        <AnimatePresence>
          {infoOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.3, ease: EASE.expoOut }}
              className="glass-panel absolute bottom-full left-0 mb-2 w-64 rounded-lg border border-navy-900/10 bg-sand-50/95 p-4 text-navy-900 shadow-2xl backdrop-blur-md lg:w-52 lg:p-3 xl:w-60 xl:p-3.5 2xl:w-64 2xl:p-4 3xl:w-72 3xl:p-5 4xl:w-80 4xl:p-6"
            >
              <p className="font-display text-lg leading-tight 3xl:text-xl 4xl:text-2xl">{BRAND.project}</p>
              <p className="mt-1 text-xs text-navy-900/60 3xl:text-sm">{BRAND.subline}</p>
              <p className="mt-2 text-[11px] text-navy-900/50 3xl:text-xs">{BRAND.address}</p>
              <p className="mt-2 text-[10px] text-navy-900/40 3xl:text-[11px]">{BRAND.rera}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Link to="/location" aria-label="Location" data-cursor="view" className={buttonClass}>
        <FaMapMarkerAlt className={iconClass} />
      </Link>
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        aria-pressed={fullscreen}
        data-cursor="view"
        className={buttonClass}
      >
        {fullscreen ? <FaCompress className={iconClass} /> : <FaExpand className={iconClass} />}
      </button>
    </div>
  );
}

export default UtilityBar;
