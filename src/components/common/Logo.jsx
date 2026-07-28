import { cx } from "../../utils/helpers";

// Faithful recreation of the JP Infra lockup (navy tile, red keyline, sail
// mark, serif wordmark) built from the brand manual spec — swap for the
// official exported logo file (src/assets/images/logo.svg) when available.
function Logo({ variant = "boxed", className = "" }) {
  if (variant === "mono") {
    return (
      <span className={cx("font-serif tracking-wide text-white", className)}>
        JP INFRA
      </span>
    );
  }

  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 border border-brand-red bg-navy-700 px-3 py-1.5",
        className
      )}
    >
      <svg viewBox="0 0 40 40" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path
          d="M8 6 C 8 6, 30 14, 30 20 C 30 24, 20 24, 16 22 C 22 26, 26 30, 30 34 C 20 34, 10 30, 6 24 C 4 20, 6 10, 8 6 Z"
          fill="white"
        />
      </svg>
      <span
        className="text-lg leading-none tracking-wide text-white"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        JP INFRA
      </span>
    </span>
  );
}

export default Logo;
