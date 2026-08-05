import { Link } from "react-router-dom";
import Logo from "../common/Logo";
import Button from "../ui/Button";
import { useMenuOverlay } from "../../context/MenuOverlayContext";
import { BRAND } from "../../utils/constants";
import { cx } from "../../utils/helpers";

function Navbar() {
  const { open: menuOpen, toggleMenu, closeMenu } = useMenuOverlay();

  return (
    <nav
        className={cx(
          "fixed top-0 left-0 z-50 w-full transition-colors duration-300",
          menuOpen ? "bg-navy-950/90 backdrop-blur-md shadow-lg shadow-black/20" : "bg-gradient-to-b from-black/60 to-transparent"
        )}
      >
         <div
          className="
    flex h-20 items-center justify-between
    px-6 md:px-16
    lg:h-16 lg:px-8
    xl:h-20 xl:px-10
    2xl:h-24 2xl:px-14
    3xl:h-28 3xl:px-16
    4xl:h-32 4xl:px-20
  "
        >
          <Link
            to="/"
            data-cursor="view"
            onClick={closeMenu}
            className="transition-transform duration-300 ease-out hover:scale-[1.03]"
          >
            <Logo className="h-8 lg:h-7 xl:h-8 2xl:h-9 3xl:h-10 4xl:h-12" />
          </Link>

          <div className="flex items-center gap-4 lg:gap-3 xl:gap-4 2xl:gap-5 3xl:gap-6 4xl:gap-7">
            <div className="hidden md:block">
              <Button
                href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
                variant="primary"
                className="
      !px-5 !py-2.5 text-xs
      lg:!px-4 lg:!py-2 lg:!text-[11px]
      xl:!px-5 xl:!py-2.5 xl:!text-xs
      2xl:!px-6 2xl:!py-3 2xl:!text-xs
      3xl:!px-7 3xl:!py-3.5 3xl:!text-sm
      4xl:!px-8 4xl:!py-4 4xl:!text-sm
    "
              >
                Enquire Now
              </Button>
            </div>

            <button
              onClick={toggleMenu}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              data-cursor="view"
              className="group flex items-center gap-3 text-white lg:gap-2 3xl:gap-3.5 4xl:gap-4"
            >
              <span className="hidden text-xs font-semibold tracking-[0.3em] uppercase sm:inline 3xl:text-sm">
                {menuOpen ? "Close" : "Menu"}
              </span>
              <span
                className="
    flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-white/20
    transition-all duration-300 group-hover:scale-105 group-hover:border-brand-red/60 group-hover:shadow-[0_0_20px_rgba(238,49,52,0.35)]
    lg:h-9 lg:w-9 lg:gap-1
    xl:h-10 xl:w-10 xl:gap-1.5
    2xl:h-11 2xl:w-11
    3xl:h-12 3xl:w-12 3xl:gap-2
    4xl:h-14 4xl:w-14
  "
              >
                <span className={cx("h-0.5 w-4 bg-white transition-transform lg:w-3.5 3xl:w-5 4xl:w-5", menuOpen && "translate-y-2 rotate-45")} />
                <span className={cx("h-0.5 w-4 bg-white transition-opacity lg:w-3.5 3xl:w-5 4xl:w-5", menuOpen && "opacity-0")} />
                <span className={cx("h-0.5 w-4 bg-white transition-transform lg:w-3.5 3xl:w-5 4xl:w-5", menuOpen && "-translate-y-2 -rotate-45")} />
              </span>
            </button>
          </div>
        </div>
    </nav>
  );
}

export default Navbar;
