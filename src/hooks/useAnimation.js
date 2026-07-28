import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

// Scopes a batch of GSAP animations to a ref and cleans them up on unmount,
// so components can define animations without leaking tweens between mounts.
export function useGsap(callback, deps = []) {
  const scope = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      callback(gsap, scope.current);
    }, scope);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}
