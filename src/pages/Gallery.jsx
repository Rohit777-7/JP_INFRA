import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Layout from "../components/layout/Layout";
import UtilityBar from "../components/layout/UtilityBar";
import BackButton from "../components/common/BackButton";
import { useGsap } from "../hooks/useAnimation";
import { useDeviceTier } from "../hooks/useDeviceTier";
import { useMagnetic } from "../hooks/useMagnetic";
import { EASE } from "../utils/easing";
import { cx } from "../utils/helpers";
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from "../data/gallery";

const SWIPE_THRESHOLD = 80;

// Opacity-only crossfade — deliberately NOT animating `x`/transform here.
// This full-bleed image is large (up to ~2200px) and object-fit: cover'd
// across the whole viewport; animating it via CSS transform triggered an
// intermittent Chromium compositor bug where the image's raster tile
// wouldn't fully repaint after the transform settled, leaving part of the
// frame showing the page background underneath (reported as a "gap" whose
// size varied unpredictably between navigations — a hallmark of a stale
// GPU tile, not a CSS layout bug, which would clip a consistent amount
// every time). Fading opacity alone never moves or resizes the element, so
// there's no transform for the compositor to mishandle.
const SLIDE_VARIANTS = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

function counterLabel(n) {
  return String(n).padStart(2, "0");
}

// Full-bleed hero presentation — the image fills the entire stage
// edge-to-edge (no card/border/padding around it), with title, counter,
// and prev/next chrome floating directly over it.
function MediaStage({ item, total, index, transition, onNext, onPrev }) {
  const prevRef = useMagnetic({ strength: 0.3, scale: 1.08 });
  const nextRef = useMagnetic({ strength: 0.3, scale: 1.08 });

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <AnimatePresence initial={false}>
        <motion.img
          key={item.id}
          src={item.src}
          alt={item.title}
          variants={SLIDE_VARIANTS}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          drag={total > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -SWIPE_THRESHOLD) onNext();
            else if (info.offset.x > SWIPE_THRESHOLD) onPrev();
          }}
          className={cx(
            "ken-burns absolute inset-0 h-full w-full object-cover",
            total > 1 && "cursor-grab active:cursor-grabbing"
          )}
        />
      </AnimatePresence>

      {/* Top/bottom darkening so the title, counter and thumbnail strip stay
          legible over any photo, without boxing the image in a card. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent lg:h-36 3xl:h-44" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent lg:h-48 3xl:h-56" />

      <h2 className="font-display pointer-events-none absolute top-6 left-1/2 max-w-[80%] -translate-x-1/2 truncate text-center text-2xl tracking-wide text-white uppercase drop-shadow-lg lg:top-6 lg:text-2xl xl:top-8 xl:text-3xl 2xl:text-3xl 3xl:top-10 3xl:text-4xl 4xl:text-5xl">
        {item.title}
      </h2>

      <span className="absolute top-6 right-6 z-10 text-xs font-semibold tracking-[0.2em] text-white/70 tabular-nums lg:top-6 lg:right-6 xl:top-8 xl:right-8 3xl:top-10 3xl:right-10 3xl:text-sm">
        {counterLabel(index + 1)} / {counterLabel(total)}
      </span>

      {total > 1 && (
        <>
          <button
            ref={prevRef}
            type="button"
            data-cursor="view"
            onClick={onPrev}
            aria-label="Previous image"
            className="absolute top-1/2 left-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white/80 backdrop-blur-sm transition-colors will-change-transform hover:border-brand-red/50 hover:bg-black/50 hover:text-white md:left-6 lg:h-11 lg:w-11 3xl:h-12 3xl:w-12"
          >
            <FaChevronLeft className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
          </button>
          <button
            ref={nextRef}
            type="button"
            data-cursor="view"
            onClick={onNext}
            aria-label="Next image"
            className="absolute top-1/2 right-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white/80 backdrop-blur-sm transition-colors will-change-transform hover:border-brand-red/50 hover:bg-black/50 hover:text-white md:right-6 lg:h-11 lg:w-11 3xl:h-12 3xl:w-12"
          >
            <FaChevronRight className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
          </button>
        </>
      )}
    </div>
  );
}

function ThumbStrip({ items, activeId, onSelect, thumbRefs, stripRef }) {
  return (
    <div ref={stripRef} className="flex shrink-0 gap-2 overflow-x-auto pb-1">
      {items.map((item, i) => (
        <motion.button
          key={item.id}
          ref={(el) => (thumbRefs.current[item.id] = el)}
          type="button"
          data-cursor="view"
          onClick={() => onSelect(i)}
          whileHover={{ scale: 1.06, y: -3 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.3, ease: EASE.power3Out }}
          aria-label={`Go to ${item.title}`}
          className={cx(
            "sheen group relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-[border-color,box-shadow] duration-300",
            item.id === activeId
              ? "border-brand-red shadow-[0_0_18px_rgba(238,49,52,0.55)]"
              : "border-white/10 hover:border-white/30"
          )}
        >
          <img
            src={item.src}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-125"
          />
        </motion.button>
      ))}
    </div>
  );
}

function Gallery() {
  const { prefersReducedMotion } = useDeviceTier();
  const [category, setCategory] = useState("All");
  const [index, setIndex] = useState(0);
  const thumbRefs = useRef({});
  const stripRef = useRef(null);

  const scope = useGsap((gsap, root) => {
    gsap.from(root.querySelectorAll("[data-gallery-in]"), {
      y: 24,
      opacity: 0,
      filter: "blur(6px)",
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.1,
    });
  }, []);

  const items = useMemo(
    () => (category === "All" ? GALLERY_ITEMS : GALLERY_ITEMS.filter((i) => i.category === category)),
    [category]
  );

  // Category swaps can leave `index` pointing past the new, smaller item
  // set — derive the safe value during render instead of resetting state
  // in an effect (which would cost an extra render pass).
  const safeIndex = items.length ? Math.min(index, items.length - 1) : -1;
  const current = safeIndex >= 0 ? items[safeIndex] : null;

  // Full-bleed photos are only ever fetched on demand, so without this,
  // clicking Next/Prev to an image the browser hasn't seen yet can show a
  // moment of the navy background showing through the still-decoding
  // portion of the frame before it finishes painting. Preloading the
  // neighbours as soon as `current` settles means they're already decoded
  // by the time a click actually navigates to them.
  useEffect(() => {
    if (safeIndex < 0 || items.length < 2) return;
    const neighbours = [1, -1, 2, -2]
      .map((offset) => items[(safeIndex + offset + items.length) % items.length])
      .filter(Boolean);
    const preloaded = neighbours.map((item) => {
      const img = new Image();
      img.src = item.src;
      return img;
    });
    return () => {
      preloaded.forEach((img) => {
        img.src = "";
      });
    };
  }, [safeIndex, items]);

  function nextImage() {
    if (items.length < 2) return;
    setIndex((safeIndex + 1) % items.length);
  }

  function prevImage() {
    if (items.length < 2) return;
    setIndex((safeIndex - 1 + items.length) % items.length);
  }

  function goTo(i) {
    setIndex(i);
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") nextImage();
      else if (e.key === "ArrowLeft") prevImage();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex, items.length]);

  // Deliberately NOT scrollIntoView() — it can walk up and scroll ancestor
  // containers (up to and including the document itself) to bring the
  // target into view, which is exactly the kind of thing that can shift
  // the whole page rather than just this strip, especially with several
  // `absolute`-positioned layers between the strip and the document. This
  // computes the target scrollLeft directly and sets it on the strip's own
  // ref only — that container's scroll position is the one and only thing
  // that changes.
  useEffect(() => {
    if (!current) return;
    const container = stripRef.current;
    const activeThumb = thumbRefs.current[current.id];
    if (!container || !activeThumb) return;
    const target = activeThumb.offsetLeft - (container.clientWidth - activeThumb.clientWidth) / 2;
    container.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [current]);

  const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] };

  return (
    <Layout hideNavbar>
      <div ref={scope} className="relative h-screen w-full overflow-hidden bg-navy-950">
        <div className="absolute inset-0">
          {!current ? (
            <p className="absolute inset-0 m-auto h-fit text-center text-sm text-white/40">No images in this category yet.</p>
          ) : (
            <MediaStage
              item={current}
              index={safeIndex}
              total={items.length}
              transition={transition}
              onNext={nextImage}
              onPrev={prevImage}
            />
          )}

          <BackButton data-gallery-in className="absolute top-6 left-6 z-20 lg:top-6 lg:left-6 xl:top-8 xl:left-8 3xl:top-10 3xl:left-10" />

          <div
            data-gallery-in
            className="absolute top-16 left-1/2 z-20 flex max-w-[85%] -translate-x-1/2 flex-wrap justify-center gap-1.5 lg:top-16 xl:top-20 3xl:top-24"
          >
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                data-cursor="view"
                onClick={() => setCategory(cat)}
                className={cx(
                  "rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase backdrop-blur-sm transition-all duration-300",
                  category === cat
                    ? "border-brand-red bg-brand-red text-white shadow-[0_8px_20px_-6px_rgba(238,49,52,0.6)]"
                    : "border-white/20 bg-black/20 text-white/70 hover:border-white/40 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div data-gallery-in className="absolute right-0 bottom-4 left-0 z-20 flex justify-center px-6 md:px-16">
            <ThumbStrip items={items} activeId={current?.id} onSelect={goTo} thumbRefs={thumbRefs} stripRef={stripRef} />
          </div>
        </div>

        {/* <UtilityBar position="bottom-6 left-6 md:left-16" /> */}
      </div>
    </Layout>
  );
}

export default Gallery;
