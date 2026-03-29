"use client";

import { useLayoutEffect, useState } from "react";

/** max-width 767px — alineado con CrewOrbit y breakpoints móvil */
export function useIsMobile(breakpointPx = 767) {
  const [mobile, setMobile] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx}px)`);
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [breakpointPx]);

  return mobile;
}
