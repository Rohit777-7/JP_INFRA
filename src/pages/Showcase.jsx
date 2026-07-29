import Layout from "../components/layout/Layout";
import FooterBar from "../components/layout/FooterBar";
import CompactHeader from "../components/common/CompactHeader";
import TowerViewer from "../three/TowerViewer";
import { GALLERY_ITEMS } from "../data/gallery";

const STORY_PANELS = [
  {
    id: "exterior",
    title: "Two Towers, One Skyline",
    copy: "Azure and Emerald rise together on a shared podium, built for uninterrupted sea and city views.",
    image: GALLERY_ITEMS.find((g) => g.id === "g1").src,
  },
  {
    id: "amenities",
    title: "A Podium Built for Living",
    copy: "25+ amenities across landscaped decks — from the sky-deck pool to the open-air amphitheatre.",
    image: GALLERY_ITEMS.find((g) => g.id === "g4").src,
  },
  {
    id: "interiors",
    title: "Interiors That Breathe",
    copy: "Efficient layouts, large-format flooring, and floor-to-ceiling windows in every configuration.",
    image: GALLERY_ITEMS.find((g) => g.id === "g8").src,
  },
];

function Showcase() {
  return (
    <Layout>
      <div className="flex h-screen flex-col overflow-hidden bg-navy-950">
        <CompactHeader
          eyebrow="Showcase"
          title="Experience the Skyline"
          description="Drag to orbit the towers in 3D — scaled to their real floor counts."
        />

        <div className="mx-auto grid min-h-0 w-full max-w-[1800px] flex-1 md:grid-cols-[1.4fr_1fr]">
          <div className="relative min-h-0 border-white/10 md:border-r">
            <TowerViewer />
          </div>

          <div className="flex min-h-0 flex-col divide-y divide-white/10 overflow-y-auto">
            {STORY_PANELS.map((panel) => (
              <div key={panel.id} className="flex flex-1 items-center gap-4 p-5">
                <div className="h-16 w-16 shrink-0 overflow-hidden">
                  <img src={panel.image} alt={panel.title} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-display text-xl text-white">{panel.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/60">{panel.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <FooterBar />
      </div>
    </Layout>
  );
}

export default Showcase;
