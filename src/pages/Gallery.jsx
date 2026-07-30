import { useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import FooterBar from "../components/layout/FooterBar";
import CompactHeader from "../components/common/CompactHeader";
import { cx } from "../utils/helpers";
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from "../data/gallery";

const THUMBS_PER_PAGE = 6; // 2 cols x 3 rows — fixed so the page never scrolls

function Gallery() {
  const [category, setCategory] = useState("All");
  const [featuredId, setFeaturedId] = useState(GALLERY_ITEMS[0]?.id);
  const [page, setPage] = useState(0);
  const [active, setActive] = useState(null); // fullscreen lightbox item

  const items = useMemo(
    () => (category === "All" ? GALLERY_ITEMS : GALLERY_ITEMS.filter((i) => i.category === category)),
    [category]
  );

  // Category change can leave featuredId/page pointing past the new,
  // smaller item set — derive safe values during render instead of
  // resetting state in an effect (which would cost an extra render pass).
  const featured = items.find((i) => i.id === featuredId) ?? items[0];
  const totalPages = Math.max(1, Math.ceil(items.length / THUMBS_PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const pageItems = items.slice(safePage * THUMBS_PER_PAGE, safePage * THUMBS_PER_PAGE + THUMBS_PER_PAGE);

  const activeIndex = active ? items.findIndex((i) => i.id === active.id) : -1;

  function go(delta) {
    if (!items.length) return;
    const next = (activeIndex + delta + items.length) % items.length;
    setActive(items[next]);
  }

  return (
    <Layout>
      <div className="flex h-screen flex-col overflow-hidden bg-navy-50">
        <CompactHeader
          eyebrow="Gallery"
          title="Renders & Reality"
          description="Exteriors, amenities, interiors & construction updates."
        />

        <div className="mx-auto flex min-h-0 w-full max-w-[1800px] flex-1 flex-col px-6 py-4 md:px-16">
          <div className="flex shrink-0 flex-wrap gap-2">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cx(
                  "border px-4 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase transition-colors",
                  category === cat
                    ? "border-brand-red bg-brand-red text-white"
                    : "border-navy-900/20 text-navy-900/70 hover:border-navy-900"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-4 grid min-h-0 flex-1 gap-3 md:grid-cols-[1fr_320px]">
            {featured && (
              <button
                onClick={() => setActive(featured)}
                className="group relative min-h-0 overflow-hidden"
                aria-label={`View ${featured.title} fullscreen`}
              >
                <img
                  src={featured.src}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-4">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">{featured.title}</p>
                    <p className="text-[10px] tracking-[0.15em] text-white/60 uppercase">{featured.category}</p>
                  </div>
                </div>
                <span className="absolute top-3 right-3 rounded-full bg-black/50 px-3 py-1 text-[10px] tracking-[0.15em] text-white uppercase opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  View Fullscreen
                </span>
              </button>
            )}

            <div className="flex min-h-0 flex-col gap-2">
              <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-3 gap-2">
                {pageItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFeaturedId(item.id)}
                    className={cx(
                      "relative min-h-0 overflow-hidden border-2 transition-colors",
                      item.id === featured?.id ? "border-brand-red" : "border-transparent"
                    )}
                  >
                    <img src={item.src} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex shrink-0 items-center justify-between text-white">
                  <button
                    onClick={() => setPage((safePage - 1 + totalPages) % totalPages)}
                    aria-label="Previous thumbnails"
                    className="flex h-8 w-8 items-center justify-center border border-navy-900/20 text-navy-900/70 transition-colors hover:border-navy-900 hover:text-navy-900"
                  >
                    &#8249;
                  </button>
                  <span className="text-[11px] tracking-[0.15em] text-navy-900/50 uppercase">
                    {safePage + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((safePage + 1) % totalPages)}
                    aria-label="Next thumbnails"
                    className="flex h-8 w-8 items-center justify-center border border-navy-900/20 text-navy-900/70 transition-colors hover:border-navy-900 hover:text-navy-900"
                  >
                    &#8250;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <FooterBar />
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute top-6 right-6 text-3xl text-white/70 hover:text-white"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            &times;
          </button>

          <button
            className="absolute left-4 text-4xl text-white/60 hover:text-white md:left-10"
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            aria-label="Previous image"
          >
            &#8249;
          </button>

          <div className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img src={active.src} alt={active.title} className="max-h-[75vh] w-full object-contain" />
            <div className="mt-4 text-center text-white">
              <p className="text-lg font-semibold">{active.title}</p>
              <p className="text-xs tracking-[0.2em] text-white/50 uppercase">{active.category}</p>
            </div>
          </div>

          <button
            className="absolute right-4 text-4xl text-white/60 hover:text-white md:right-10"
            onClick={(e) => { e.stopPropagation(); go(1); }}
            aria-label="Next image"
          >
            &#8250;
          </button>
        </div>
      )}
    </Layout>
  );
}

export default Gallery;
