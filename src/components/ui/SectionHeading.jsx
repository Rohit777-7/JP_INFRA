import { cx } from "../../utils/helpers";

function SectionHeading({ eyebrow, title, description, align = "left", light = false, className = "" }) {
  return (
    <div
      className={cx(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold tracking-[0.3em] text-brand-red uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className={cx("text-4xl md:text-6xl", light ? "text-white" : "text-navy-900")}>
        {title}
      </h2>
      {description && (
        <p className={cx("mt-4 font-body text-base leading-relaxed", light ? "text-white/70" : "text-navy-900/70")}>
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
