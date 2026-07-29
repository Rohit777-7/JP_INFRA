import { Link } from "react-router-dom";
import { cx } from "../../utils/helpers";

const VARIANTS = {
  primary: "bg-navy-700 text-white hover:bg-navy-600",
  outline: "border border-white/40 text-white hover:bg-white/10",
  ghost: "text-white hover:text-navy-100",
};

function Button({ children, variant = "primary", to, href, className = "", ...rest }) {
  const classes = cx(
    "inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold tracking-wide uppercase transition-colors duration-300",
    VARIANTS[variant],
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

export default Button;
