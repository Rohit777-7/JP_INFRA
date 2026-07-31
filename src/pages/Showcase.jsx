import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaPlay, FaTimes } from "react-icons/fa";
import Layout from "../components/layout/Layout";
import FooterBar from "../components/layout/FooterBar";
import UtilityBar from "../components/layout/UtilityBar";
import { SHOWCASE_VIDEOS } from "../data/videos";
import { BRAND } from "../utils/constants";

// Placeholder hero — swap for a real exterior photo of the project.
const HERO_IMAGE = "https://picsum.photos/seed/jpi-showcase-hero/1920/1080";

function Showcase() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <Layout>
      <div className="relative flex h-screen flex-col overflow-hidden bg-navy-950">
        <div className="relative min-h-0 flex-1">
          <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-navy-950/30" />

          <Link
            to="/"
            className="absolute top-24 left-6 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-navy-950/60 px-4 py-2 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-sm transition-colors hover:bg-navy-950/80 md:top-28 md:left-16"
          >
            <FaArrowLeft className="h-3 w-3" /> Back
          </Link>

          <div className="absolute top-24 right-6 z-20 text-right md:top-28 md:right-16">
            <p className="text-xs font-semibold tracking-[0.3em] text-brand-red uppercase">Project Showcase</p>
            <p className="font-accent text-2xl text-white">{BRAND.project}</p>
          </div>

          <div className="absolute top-32 left-6 z-20 max-w-xl md:top-40 md:left-16">
            <h1 className="font-accent text-4xl text-white md:text-5xl">Showcase Videos</h1>
            <p className="mt-2 text-sm text-white/70">
              Explore the brand, project walkthrough, and location videos of {BRAND.project}.
            </p>
          </div>

         <div className="absolute inset-x-6 top-1/2 z-20 -translate-y-1/2 grid gap-6 md:inset-x-16 md:grid-cols-3">
            {SHOWCASE_VIDEOS.map((video) => (
              <div key={video.id} className="relative">
                <button
                  type="button"
                  onClick={() => setActiveVideo(video)}
                  className="group relative flex h-48 w-full flex-col justify-end overflow-hidden rounded-xl border border-white/15 bg-navy-950/40 text-left backdrop-blur-sm transition-colors hover:border-white/30 md:h-56"
                >
                  <span className="absolute top-3 left-3 rounded-full bg-black/50 px-3 py-1 text-[10px] font-semibold tracking-widest text-white/90 uppercase">
                    Tap to Open
                  </span>
                  <div className="bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-sm font-semibold text-white">{video.title}</p>
                    <p className="mt-0.5 text-xs text-white/70">{video.description}</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveVideo(video)}
                  className="relative z-10 mx-auto mt-15 flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-red to-brand-red-dark px-6 py-2.5 text-[11px] font-semibold tracking-wide text-white uppercase shadow-lg transition-transform hover:scale-[1.03]"
                >
                  <FaPlay className="h-2.5 w-4.5" /> Watch Video
                </button>
              </div>
            ))}
          </div>

          <UtilityBar position="bottom-6 left-6 md:left-16" />
        </div>

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
