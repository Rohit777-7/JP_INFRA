import Layout from "../components/layout/Layout";
import Hero from "../sections/Hero";

// Home is just the hover-preview landing card — no scrolling, no other
// panels. Every other page (About-style project info, Amenities, Gallery,
// Location, Enquiry form) is reachable from here by hovering then clicking.
function Home() {
  return (
    <Layout>
      <div className="h-screen w-full">
        <Hero />
      </div>
    </Layout>
  );
}

export default Home;
