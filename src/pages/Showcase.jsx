import { useState } from "react";
import { FaPlay, FaTimes } from "react-icons/fa";
import Layout from "../components/layout/Layout";
import FooterBar from "../components/layout/FooterBar";
import UtilityBar from "../components/layout/UtilityBar";
import FrameOverlay from "../components/layout/FrameOverlay";
import CompactHeader from "../components/common/CompactHeader";
import TowerViewer from "../three/TowerViewer";
import { SHOWCASE_VIDEOS } from "../data/videos";
import { BRAND } from "../utils/constants";

function Showcase() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <Layout>
      <div className="relative flex h-screen flex-col bg-navy-950">
        <CompactHeader
          eyebrow="Showcase"
          title="Experience the Skyline"
          description="Drag to orbit the towers in 3D — scaled to their real floor counts."
        />

        <div className="mx-auto grid min-h-0 w-full max-w-[1800px] flex-1 md:grid-cols-[1.4fr_1fr]">
          <div className="relative min-h-0 border-white/10 md:border-r">
            <TowerViewer />
          </div>

          <div className="flex min-h-0 flex-col gap-3 overflow-y-auto p-5">
            <div>
              <p className="font-accent text-2xl text-brand-red">{BRAND.tagline}</p>
              <h2 className="mt-1 text-2xl text-white">Showcase Videos</h2>
              <p className="mt-1 text-xs text-white/50">
                Explore the brand, project walkthrough, and location videos of {BRAND.project}.
              </p>
            </div>

            {SHOWCASE_VIDEOS.map((video) => (
              <button
                key={video.id}
                type="button"
                onClick={() => setActiveVideo(video)}
                className="group flex min-h-0 flex-1 items-center gap-4 border border-white/10 bg-navy-900/60 p-3 text-left transition-colors hover:border-white/25"
              >
                <div className="relative h-16 w-20 shrink-0 overflow-hidden">
                  <img src={video.poster} alt={video.title} className="h-full w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <FaPlay className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">{video.title}</p>
                  <p className="mt-0.5 text-xs text-white/50">{video.description}</p>
                </div>
                <span className="hidden shrink-0 items-center gap-2 bg-brand-red px-4 py-2 text-[11px] font-semibold tracking-wide text-white uppercase transition-colors group-hover:bg-brand-red-dark sm:inline-flex">
                  <FaPlay className="h-2.5 w-2.5" /> Watch
                </span>
              </button>
            ))}
          </div>
        </div>

        <FrameOverlay />
        <UtilityBar position="bottom-20 left-6 md:left-16" />
        <FooterBar />
      </div>

      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
          onClick={() => setActiveVideo(null)}
        >
          <button
            className="absolute top-6 right-6 text-3xl text-white/70 hover:text-white"
            onClick={() => setActiveVideo(null)}
            aria-label="Close"
          >
            <FaTimes />
          </button>

          <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            {activeVideo.videoUrl ? (
              <video src={activeVideo.videoUrl} controls autoPlay className="w-full" />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 border border-white/10 bg-navy-900 text-white/60">
                <FaPlay className="h-6 w-6" />
                <p className="text-sm tracking-[0.2em] uppercase">Video Coming Soon</p>
              </div>
            )}
            <div className="mt-4 text-center text-white">
              <p className="text-lg font-semibold">{activeVideo.title}</p>
              <p className="text-xs text-white/50">{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Showcase;
