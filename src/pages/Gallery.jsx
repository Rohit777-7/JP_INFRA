import { useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import FooterBar from "../components/layout/FooterBar";
import CompactHeader from "../components/common/CompactHeader";
import { cx } from "../utils/helpers";
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from "../data/gallery";

function Gallery() {
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState(null);

  const items = useMemo(
    () => (category === "All" ? GALLERY_ITEMS : GALLERY_ITEMS.filter((i) => i.category === category)),
    [category]
  );

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

        <div className="flex min-h-0 flex-1 flex-col px-6 py-4 md:px-16">
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

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
            <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActive(item)}
                  className="group relative block w-full overflow-hidden break-inside-avoid"
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="text-left">
                      <p className="text-xs font-semibold text-white">{item.title}</p>
                      <p className="text-[10px] tracking-wide text-white/60 uppercase">{item.category}</p>
                    </div>
                  </div>
                </button>
              ))}
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
