import { FaArrowLeft } from "react-icons/fa";
import { useMenuOverlay } from "../../context/MenuOverlayContext";
import { cx } from "../../utils/helpers";

// Padding/type-size presets, kept separate from `className` — className is
// for positioning/data-attrs only (things that never collide), so two
// conflicting utilities for the same property (e.g. someone else's px-3
// alongside this component's own px-4) never end up both applied with an
// unpredictable winner.
const SIZES = {
  md: "px-4 py-2 text-[11px]",
  sm: "px-3 py-1.5 text-[10px] xl:px-3.5 xl:py-1.5 xl:text-[11px] 3xl:px-4 3xl:py-2 3xl:text-xs",
};

// Shared "Back" affordance for every page except Home — opens the
// full-screen HoverNav menu (see MenuOverlayContext) instead of
// navigate(-1), so it always lands somewhere useful regardless of how the
// user arrived at the current page, and reads identically everywhere:
// small dark-navy pill, left arrow, "BACK" label, subtle hover nudge.
function BackButton({ className = "", size = "md", ...rest }) {
  const { openMenu } = useMenuOverlay();

  return (
    <button
      type="button"
      onClick={openMenu}
      aria-label="Open menu"
      data-cursor="view"
      className={cx(
        "flex items-center gap-2 rounded-full border border-white/15 bg-navy-950/60 font-semibold tracking-wider text-white uppercase backdrop-blur-sm transition-all duration-300 hover:-translate-x-1 hover:border-white/30 hover:bg-navy-950/80",
        SIZES[size],
        className
      )}
      {...rest}
    >
      <FaArrowLeft className="h-3 w-3" />
      Back
    </button>
  );
}

export default BackButton;
