import { BRAND } from "../../utils/constants";

// Slim, single-line footer used on every single-screen page instead of a
// full footer panel — there's no scroll to reach a bigger one with.
function FooterBar() {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-white/10 bg-navy-950 px-6 py-2.5 text-xs text-white/40 md:px-16">
      <span>
        © {new Date().getFullYear()} {BRAND.developer} · {BRAND.address}
      </span>
      <span className="flex flex-wrap gap-x-4">
        <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="hover:text-brand-red">
          {BRAND.phone}
        </a>
        <span className="hidden sm:inline">{BRAND.rera}</span>
      </span>
    </div>
  );
}

export default FooterBar;
