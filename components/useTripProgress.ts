"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getRampProgress,
  getRingFillProgress,
  TRIP_TARGET_MS,
} from "@/lib/trip-target";

export function useTripProgress() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const rampProgress = useMemo(() => getRampProgress(now), [now]);
  const ringFillProgress = useMemo(() => getRingFillProgress(now), [now]);
  const hasPassedTarget = now >= TRIP_TARGET_MS;

  return {
    now,
    rampProgress,
    ringFillProgress,
    hasPassedTarget,
    targetMs: TRIP_TARGET_MS,
  };
}
