import { useGsap } from "../../hooks/useAnimation";

// Slim page header for single-screen pages — just enough for an eyebrow,
// title, and one-line description, sized to leave the rest of the viewport
// for the page's actual content (no full-screen hero here; there's no
// scroll to reveal one on).
function CompactHeader({ eyebrow, title, description }) {
  const scope = useGsap((gsap, root) => {
    gsap.from(root.querySelectorAll("[data-header-in]"), {
      y: 20,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.08,
    });
  }, []);

  return (
    <div ref={scope} className="shrink-0 border-b border-white/10 bg-navy-950 px-6 pt-20 pb-4 md:px-16 3xl:pt-24 3xl:pb-6">
      {eyebrow && (
        <p data-header-in className="mb-1 text-xs font-semibold tracking-[0.3em] text-brand-red uppercase 3xl:text-sm">
          {eyebrow}
        </p>
      )}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h1 data-header-in className="text-3xl text-white md:text-4xl 3xl:text-5xl">
          {title}
        </h1>
        {description && (
          <p data-header-in className="max-w-xl text-sm text-white/60 3xl:max-w-2xl 3xl:text-base">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default CompactHeader;
