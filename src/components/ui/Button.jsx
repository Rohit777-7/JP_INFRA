import { Link } from "react-router-dom";
import { cx } from "../../utils/helpers";
import { useMagnetic } from "../../hooks/useMagnetic";

const VARIANTS = {
  primary: "bg-navy-700 text-white hover:bg-navy-600",
  outline: "border border-white/40 text-white hover:bg-white/10",
  ghost: "text-white hover:text-navy-100",
};

// Magnetic + glow on every button in the app (this is the one shared
// component nearly every CTA renders through). The magnetic pointer-lift
// itself is JS-driven (see useMagnetic) so the hover lift here is glow/shadow
// only — a CSS transform hover utility here would fight the inline
// transform useMagnetic writes.
function Button({ children, variant = "primary", to, href, className = "", ...rest }) {
  const magneticRef = useMagnetic({ strength: 0.3, scale: 1.045 });

  const classes = cx(
    "inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold tracking-wide uppercase transition-all duration-300 will-change-transform hover:shadow-[0_10px_34px_-6px_rgba(238,49,52,0.45)]",
    "lg:px-6 lg:py-2.5 lg:text-xs",
    "xl:px-7 xl:py-3 xl:text-sm",
    "2xl:px-7 2xl:py-3.5 2xl:text-sm",
    "3xl:px-8 3xl:py-4 3xl:text-base",
    "4xl:px-10 4xl:py-5 4xl:text-lg",
    VARIANTS[variant],
    className
  );

  if (to) {
    return (
      <Link ref={magneticRef} to={to} data-cursor="view" className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a ref={magneticRef} href={href} data-cursor="view" className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button ref={magneticRef} data-cursor="view" className={classes} {...rest}>
      {children}
    </button>
  );
}

export default Button;
