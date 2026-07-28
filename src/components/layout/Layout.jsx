import Navbar from "./Navbar";

// Every page is its own single-screen layout (header + content + FooterBar),
// so Layout's only job is the fixed navbar overlay on top of it.
function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default Layout;
