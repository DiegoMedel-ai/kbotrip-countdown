"use client";

import { useEffect, useState } from "react";
import { TRIP_TARGET_MS } from "@/lib/trip-target";

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
};

function partsFromDiff(ms: number): CountdownParts {
  if (ms <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isComplete: true,
    };
  }
  const totalSec = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    isComplete: false,
  };
}

export function useCountdown(targetMs: number = TRIP_TARGET_MS): CountdownParts {
  const [parts, setParts] = useState<CountdownParts>(() =>
    partsFromDiff(targetMs - Date.now()),
  );

  useEffect(() => {
    const tick = () => setParts(partsFromDiff(targetMs - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  return parts;
}
