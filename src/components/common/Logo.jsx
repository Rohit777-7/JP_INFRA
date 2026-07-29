import logoSrc from "../../assets/images/jp-infra-logo.png";
import { cx } from "../../utils/helpers";

// The real, official JP Infra lockup — always rendered as-is (native aspect
// ratio, unaltered colours) per the brand manual's own rule against
// recolouring, recomposing, or disproportionate scaling of the logo.
function Logo({ className = "" }) {
  return (
    <img
      src={logoSrc}
      alt="JP Infra"
      className={cx("h-8 w-auto", className)}
    />
  );
}

export default Logo;
