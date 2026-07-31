import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../common/Logo";
import Button from "../ui/Button";
import MenuOverlay from "./MenuOverlay";
import { BRAND } from "../../utils/constants";
import { cx } from "../../utils/helpers";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        className={cx(
          "fixed top-0 left-0 z-50 w-full transition-colors duration-300",
          menuOpen ? "bg-navy-950/90 backdrop-blur-md shadow-lg shadow-black/20" : "bg-gradient-to-b from-black/60 to-transparent"
        )}
      >
         <div className="flex h-20 items-center justify-between px-6 md:px-16">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <Logo />
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <Button href={`tel:${BRAND.phone.replace(/\s/g, "")}`} variant="primary" className="!px-5 !py-2.5 text-xs">
                Enquire Now
              </Button>
            </div>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex items-center gap-3 text-white"
            >
              <span className="hidden text-xs font-semibold tracking-[0.3em] uppercase sm:inline">
                {menuOpen ? "Close" : "Menu"}
              </span>
              <span className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-white/20">
                <span className={cx("h-0.5 w-4 bg-white transition-transform", menuOpen && "translate-y-2 rotate-45")} />
                <span className={cx("h-0.5 w-4 bg-white transition-opacity", menuOpen && "opacity-0")} />
                <span className={cx("h-0.5 w-4 bg-white transition-transform", menuOpen && "-translate-y-2 -rotate-45")} />
              </span>
            </button>
          </div>
        </div>
      </nav>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

export default Navbar;
