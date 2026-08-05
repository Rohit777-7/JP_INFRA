import { useGsap } from "../../hooks/useAnimation";

// Slim page header for single-screen pages — just enough for an eyebrow,
// title, and one-line description, sized to leave the rest of the viewport
// for the page's actual content (no full-screen hero here; there's no
// scroll to reveal one on).
function CompactHeader({ eyebrow, title, description }) {
  const scope = useGsap((gsap, root) => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(root.querySelector("[data-header-eyebrow]"), { opacity: 0, y: 12, duration: 0.6 })
      .fromTo(
        root.querySelector("[data-header-title]"),
        { clipPath: "inset(0 0 100% 0)", opacity: 0, filter: "blur(8px)" },
        { clipPath: "inset(0 0 0% 0)", opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "power4.out" },
        "-=0.4"
      )
      .from(root.querySelector("[data-header-desc]"), { opacity: 0, y: 14, duration: 0.6 }, "-=0.5");
  }, []);

  return (
    <div ref={scope} className="shrink-0 border-b border-white/10 bg-navy-950 px-6 pt-20 pb-4 md:px-16 3xl:pt-24 3xl:pb-6">
      {eyebrow && (
        <p data-header-eyebrow className="mb-1 text-xs font-semibold tracking-[0.3em] text-brand-red uppercase 3xl:text-sm">
          {eyebrow}
        </p>
      )}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h1 data-header-title className="text-3xl text-white md:text-4xl 3xl:text-5xl">
          {title}
        </h1>
        {description && (
          <p data-header-desc className="max-w-xl text-sm text-white/60 3xl:max-w-2xl 3xl:text-base">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default CompactHeader;
