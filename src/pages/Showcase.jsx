import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaPlay, FaTimes } from "react-icons/fa";

import Layout from "../components/layout/Layout";
import FooterBar from "../components/layout/FooterBar";
import UtilityBar from "../components/layout/UtilityBar";
import BackButton from "../components/common/BackButton";
import { SHOWCASE_VIDEOS } from "../data/videos";
import { BRAND } from "../utils/constants";
import { useGsap } from "../hooks/useAnimation";
import { useMagnetic } from "../hooks/useMagnetic";
import { EASE } from "../utils/easing";

// Small wrapper so each grid card gets its own magnetic ref/instance
// without calling the hook inside .map() (rules-of-hooks).
function VideoCard({ video, onOpen }) {
  const watchRef = useMagnetic({ strength: 0.3, scale: 1.06 });

  return (
    <div data-showcase-in className="flex flex-col items-center">
      <button
        type="button"
        data-cursor="view"
        onClick={() => onOpen(video)}
        className="group relative flex h-28 w-full flex-col justify-end overflow-hidden rounded-2xl border border-white/15 bg-navy-950/40 text-left backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-brand-red hover:shadow-[0_20px_50px_-12px_rgba(238,49,52,0.45)] lg:h-32 xl:h-40 2xl:h-52 3xl:h-64 4xl:h-80"
      >
        {video.poster && (
          <img
            src={video.poster}
            alt={video.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Light sweep on hover */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-y-0 left-[-60%] w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[260%]" />
        </div>

        <span className="absolute top-3 left-3 rounded-full bg-black/50 px-3 py-1 text-[10px] font-semibold tracking-widest text-white/90 uppercase">
          Tap to Open
        </span>

        <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-red/90 shadow-[0_0_0_0_rgba(238,49,52,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_28px_8px_rgba(238,49,52,0.45)] lg:h-14 lg:w-14">
          <FaPlay className="ml-0.5 h-3.5 w-3.5 text-white lg:h-4 lg:w-4" />
        </div>

        <div className="relative bg-gradient-to-t from-black/80 to-transparent p-3 lg:p-4">
          <p className="text-xs font-semibold text-white lg:text-sm xl:text-base">
            {video.title}
          </p>
          <p className="mt-0.5 text-[11px] text-white/70 lg:text-xs">
            {video.description}
          </p>
        </div>
      </button>

      <button
        ref={watchRef}
        type="button"
        data-cursor="view"
        onClick={() => onOpen(video)}
        className="mt-4 flex items-center gap-2 rounded-full bg-brand-red px-6 py-2.5 text-[11px] font-semibold tracking-wide text-white uppercase shadow-lg transition-shadow duration-300 will-change-transform hover:shadow-[0_12px_34px_-6px_rgba(238,49,52,0.65)] lg:mt-5 lg:px-7 lg:py-3 xl:mt-6 xl:px-8 2xl:mt-7 2xl:px-9 2xl:py-3.5 3xl:mt-8 3xl:px-10 3xl:py-4"
      >
        <FaPlay className="h-3 w-3" />
        Watch Video
      </button>
    </div>
  );
}

function Showcase() {
  const [activeVideo, setActiveVideo] = useState(null);

  const scope = useGsap((gsap, root) => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(root.querySelector("[data-showcase-back]"), { opacity: 0, x: -20, duration: 0.6 })
      .from(root.querySelector("[data-showcase-label]"), { opacity: 0, x: 20, duration: 0.6 }, "<")
      .fromTo(
        root.querySelector("[data-showcase-heading]"),
        { clipPath: "inset(0 0 100% 0)", opacity: 0 },
        { clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 0.9, ease: "power4.out" },
        "-=0.3"
      )
      .from(root.querySelector("[data-showcase-desc]"), { opacity: 0, y: 14, duration: 0.5 }, "-=0.5")
      .from(
        root.querySelectorAll("[data-showcase-in]"),
        { opacity: 0, y: 32, scale: 0.96, filter: "blur(6px)", duration: 0.8, stagger: 0.08 },
        "-=0.35"
      );
  }, []);

  return (
    <Layout hideNavbar>
      <div ref={scope} className="flex h-screen flex-col overflow-hidden bg-navy-950">
        <div className="flex flex-1 flex-col justify-between gap-4 px-4 pt-4 pb-14 lg:gap-5 lg:px-8 lg:pt-6 lg:pb-16 xl:gap-6 xl:px-12 xl:pt-8 xl:pb-16 2xl:gap-7 2xl:px-16 2xl:pt-10 2xl:pb-20 3xl:gap-8 3xl:px-20 3xl:pt-12 3xl:pb-20 4xl:gap-10 4xl:px-28 4xl:pt-14 4xl:pb-24">
          {/* Top row: back button + project showcase label */}
          <div className="flex items-start justify-between gap-4">
            <BackButton data-showcase-back />

            <div data-showcase-label className="text-right">
              <p className="text-[10px] font-semibold tracking-[0.35em] text-brand-red uppercase lg:text-xs">
                Project Showcase
              </p>
              <p className="font-display mt-1 text-xl text-white lg:text-2xl xl:text-3xl 2xl:text-3xl 3xl:text-4xl">
                {BRAND.project}
              </p>
            </div>
          </div>

          {/* Heading + video grid, centered in the remaining space */}
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 3xl:gap-8 4xl:gap-10">
            <div className="max-w-2xl">
              <h1
                data-showcase-heading
                className="font-display text-2xl text-white uppercase lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl"
              >
                Showcase Videos
              </h1>
              <p data-showcase-desc className="mt-2 text-xs text-white/70 lg:text-sm xl:text-base 2xl:text-lg 3xl:text-lg 4xl:text-xl">
                Explore the brand, project walkthrough, and location videos of{" "}
                {BRAND.project}.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:gap-6 2xl:gap-8 3xl:gap-9 4xl:gap-12">
              {SHOWCASE_VIDEOS.map((video) => (
                <VideoCard key={video.id} video={video} onOpen={setActiveVideo} />
              ))}
            </div>
          </div>

          {/* Reserved row for the UtilityBar, sitting just above the footer */}
          <div className="relative h-16 shrink-0 mt-6">
           <UtilityBar position="bottom-[-20px] left-0" />
          </div>
        </div>

        <FooterBar />
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE.power3Out }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md lg:p-6 xl:p-8"
            onClick={() => setActiveVideo(null)}
          >
            <button
              className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:scale-110 hover:bg-brand-red hover:shadow-[0_0_24px_rgba(238,49,52,0.5)] lg:top-6 lg:right-6 xl:top-8 xl:right-8"
              onClick={() => setActiveVideo(null)}
              aria-label="Close"
              data-cursor="view"
            >
              <FaTimes className="text-xl" />
            </button>

            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.45, ease: EASE.expoOut }}
              className="flex w-[92vw] flex-col items-center lg:w-[78vw] xl:w-[76vw] 2xl:w-[74vw] 3xl:w-[72vw] 4xl:w-[70vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {activeVideo.videoUrl ? (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  className="aspect-video w-full max-h-[58vh] rounded-3xl border border-white/10 object-cover shadow-2xl lg:max-h-[54vh] xl:max-h-[56vh] 2xl:max-h-[60vh] 3xl:max-h-[64vh] 4xl:max-h-[68vh]"
                />
              ) : (
                <div className="relative aspect-video w-full max-h-[58vh] overflow-hidden rounded-3xl border border-white/10 bg-navy-900 lg:max-h-[54vh] xl:max-h-[56vh] 2xl:max-h-[60vh] 3xl:max-h-[64vh] 4xl:max-h-[68vh]">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <FaPlay className="mb-6 text-5xl text-white/40 lg:text-6xl xl:text-7xl" />
                    <p className="text-center text-base tracking-[0.35em] text-white/60 uppercase lg:text-xl xl:text-2xl 2xl:text-3xl">
                      Video Coming Soon
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-4 text-center text-white lg:mt-5 xl:mt-6">
                <h2 className="text-3xl uppercase lg:text-4xl xl:text-5xl">
                  {activeVideo.title}
                </h2>
                <p className="mx-auto mt-4 max-w-3xl text-sm text-white/70 lg:text-base xl:text-lg">
                  {activeVideo.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default Showcase;
