import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaCompress,
  FaTimes,
  FaThLarge,
  FaImages,
} from "react-icons/fa";
import Layout from "../components/layout/Layout";
import FooterBar from "../components/layout/FooterBar";
import UtilityBar from "../components/layout/UtilityBar";
import CompactHeader from "../components/common/CompactHeader";
import { useGsap } from "../hooks/useAnimation";
import { useDeviceTier } from "../hooks/useDeviceTier";
import { cx } from "../utils/helpers";
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from "../data/gallery";

const SWIPE_THRESHOLD = 80;

// Direction-aware slide: entering/exiting images pass on the same axis they
// were navigated on, so Next always reads as a left-slide and Prev as a
// right-slide regardless of which image is involved.
const SLIDE_VARIANTS = {
  enter: (dir) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

function counterLabel(n) {
  return String(n).padStart(2, "0");
}

// The big media panel — reused as-is inside the card (contained, cropped)
// and inside the fullscreen portal (full viewport, letterboxed), so the two
// views share one set of controls instead of duplicating them.
function MediaStage({ item, total, index, direction, transition, fit, fullscreen, onNext, onPrev, onToggleFullscreen }) {
  return (
    <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-black/40">
      <AnimatePresence custom={direction} initial={false}>
        <motion.img
          key={item.id}
          src={item.src}
          alt={item.title}
          custom={direction}
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
            "absolute inset-0 h-full w-full",
            total > 1 && "cursor-grab active:cursor-grabbing",
            fit === "cover" ? "object-cover" : "object-contain"
          )}
        />
      </AnimatePresence>

      <span className="absolute top-3 left-3 z-10 max-w-[70%] truncate rounded-full bg-black/40 px-3 py-1 text-[10px] font-semibold tracking-widest text-white/80 uppercase backdrop-blur-sm">
        {item.title}
      </span>

      <button
        type="button"
        onClick={onToggleFullscreen}
        aria-label={fullscreen ? "Exit fullscreen" : "View fullscreen"}
        className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
      >
        {fullscreen ? <FaCompress className="h-3.5 w-3.5" /> : <FaExpand className="h-3.5 w-3.5" />}
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous image"
            className="absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
          >
            <FaChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next image"
            className="absolute top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
          >
            <FaChevronRight className="h-3.5 w-3.5" />
          </button>
        </>
      )}

      <span className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold tracking-widest text-white/80 backdrop-blur-sm">
        {counterLabel(index + 1)} / {counterLabel(total)}
      </span>
    </div>
  );
}

function ThumbStrip({ items, activeId, onSelect, thumbRefs }) {
  return (
    <div className="mt-3 flex shrink-0 gap-2 overflow-x-auto pb-1">
      {items.map((item, i) => (
        <motion.button
          key={item.id}
          ref={(el) => (thumbRefs.current[item.id] = el)}
          type="button"
          onClick={() => onSelect(i)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          aria-label={`Go to ${item.title}`}
          className={cx(
            "h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
            item.id === activeId ? "border-brand-red" : "border-white/10 hover:border-white/30"
          )}
        >
          <img src={item.src} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
        </motion.button>
      ))}
    </div>
  );
}

// function GridView({ items, onOpen }) {
//   return (
//     <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto p-2 md:grid-cols-2 xl:grid-cols-3">
//       {items.map((item, index) => (
//         <motion.button
//           key={item.id}
//           type="button"
//           onClick={() => onOpen(index)}
//           whileHover={{ y: -6 }}
//           whileTap={{ scale: 0.98 }}
//           className={`group overflow-hidden rounded-2xl border border-white/10 bg-[#0F1724] shadow-xl transition-all duration-500 hover:border-brand-red/40
//             ${
//               index === 0
//                 ? "md:col-span-2 xl:col-span-2"
//                 : ""
//             }`}
//         >
//           <div
//             className={`relative overflow-hidden ${
//               index === 0 ? "h-[420px]" : "h-[280px]"
//             }`}
//           >
//             <img
//               src={item.src}
//               alt={item.title}
//               loading="lazy"
//               className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
//             />

//             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

//             <div className="absolute bottom-0 left-0 w-full p-5">
//               <p className="text-xl font-semibold text-white">
//                 {item.title}
//               </p>

//               <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-brand-red">
//                 {item.category}
//               </p>
//             </div>
//           </div>
//         </motion.button>
//       ))}
//     </div>
//   );
// }


function Gallery() {
  const { prefersReducedMotion } = useDeviceTier();
  const [category, setCategory] = useState("All");
  const [view, setView] = useState("slideshow"); // "slideshow" | "grid"
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const thumbRefs = useRef({});

  const scope = useGsap((gsap, root) => {
    gsap.from(root.querySelectorAll("[data-gallery-in]"), {
      y: 16,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.08,
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

  function nextImage() {
    if (items.length < 2) return;
    setDirection(1);
    setIndex((safeIndex + 1) % items.length);
  }

  function prevImage() {
    if (items.length < 2) return;
    setDirection(-1);
    setIndex((safeIndex - 1 + items.length) % items.length);
  }

  function goTo(i) {
    setDirection(i > safeIndex ? 1 : -1);
    setIndex(i);
  }

  function openFullscreen(i) {
    setDirection(1);
    setIndex(i);
    setView("slideshow");
    setFullscreen(true);
  }

  // Arrow-key stepping only makes sense once there's a single "current"
  // image to step through — i.e. slideshow view or the fullscreen portal.
  useEffect(() => {
    if (view !== "slideshow" && !fullscreen) return;
    function onKey(e) {
      if (e.key === "ArrowRight") nextImage();
      else if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "Escape") setFullscreen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, fullscreen, safeIndex, items.length]);

  useEffect(() => {
    if (!current) return;
    thumbRefs.current[current.id]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [current]);

  const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] };

  return (
    <Layout>
      <div className="relative flex h-screen flex-col overflow-hidden bg-navy-950">
        {/* <CompactHeader
          eyebrow="Gallery"
          title="Renders & Reality"
          description="Exteriors, amenities, interiors & construction updates."
        /> */}

        <div
  ref={scope}
  className="mx-auto flex min-h-0 w-full max-w-[1800px] flex-1 flex-col gap-3 px-6 pt-24 pb-20 md:px-16 md:pt-28"
>
          <div data-gallery-in className="flex shrink-0 flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {GALLERY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cx(
                    "rounded-full border px-4 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase transition-colors",
                    category === cat
                      ? "border-brand-red bg-brand-red text-white"
                      : "border-white/15 text-white/60 hover:border-white/30 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex gap-1 rounded-full border border-white/15 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setView("slideshow")}
                className={cx(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase transition-colors",
                  view === "slideshow" ? "bg-brand-red text-white" : "text-white/60 hover:text-white"
                )}
              >
                <FaImages className="h-3 w-3" /> Slideshow
              </button>
              {/* <button
                type="button"
                onClick={() => setView("grid")}
                className={cx(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase transition-colors",
                  view === "grid" ? "bg-brand-red text-white" : "text-white/60 hover:text-white"
                )}
              >
                <FaThLarge className="h-3 w-3" /> Grid
              </button> */}
            </div>
          </div>

          <div
            data-gallery-in
            className="relative flex min-h-0 flex-1 flex-col rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-xl md:p-4"
          >
            {!current ? (
              <p className="m-auto text-sm text-white/40">No images in this category yet.</p>
            ) : view === "slideshow" ? (
              <>
                <MediaStage
                  item={current}
                  index={safeIndex}
                  total={items.length}
                  direction={direction}
                  transition={transition}
                  fit="cover"
                  onNext={nextImage}
                  onPrev={prevImage}
                  onToggleFullscreen={() => setFullscreen(true)}
                />
                <ThumbStrip items={items} activeId={current.id} onSelect={goTo} thumbRefs={thumbRefs} />
              </>
            ) : (
              <GridView items={items} onOpen={openFullscreen} />
            )}
          </div>
        </div>

       <UtilityBar position="bottom-16 left-6 md:left-16" />
        <FooterBar />
      </div>

      <AnimatePresence>
        {fullscreen && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
            className="fixed inset-0 z-[100] flex flex-col bg-black/95 p-4 md:p-8"
          >
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              aria-label="Close fullscreen"
              className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur-sm hover:text-white"
            >
              <FaTimes />
            </button>

            <div className="flex min-h-0 flex-1 flex-col">
              <MediaStage
                item={current}
                index={safeIndex}
                total={items.length}
                direction={direction}
                transition={transition}
                fit="contain"
                fullscreen
                onNext={nextImage}
                onPrev={prevImage}
                onToggleFullscreen={() => setFullscreen(false)}
              />
              <ThumbStrip items={items} activeId={current.id} onSelect={goTo} thumbRefs={thumbRefs} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default Gallery;
