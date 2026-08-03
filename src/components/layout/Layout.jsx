import Navbar from "./Navbar";

function Layout({ children, hideNavbar = false }) {
  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

export default Layout;