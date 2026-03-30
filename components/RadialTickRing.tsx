import type { JSX } from "react";

const CX = 100;
const CY = 100;

function r4(n: number) {
  return Math.round(n * 1e4) / 1e4;
}

type RadialTickRingProps = {
  ticks?: number;
  innerRatio?: number;
  outerRatio?: number;
  /** 0–1: fracción del círculo “completada” (últimas 24h antes del viaje) */
  fillProgress?: number;
};

export function RadialTickRing({
  ticks = 144,
  innerRatio = 0.86,
  outerRatio = 0.995,
  fillProgress = 0,
}: RadialTickRingProps) {
  const lines: JSX.Element[] = [];
  const p = Math.max(0, Math.min(1, fillProgress));

  for (let i = 0; i < ticks; i++) {
    const a = (i / ticks) * Math.PI * 2 - Math.PI / 2;
    const ir = 100 * innerRatio;
    const or = 100 * outerRatio;
    const x1 = r4(CX + ir * Math.cos(a));
    const y1 = r4(CY + ir * Math.sin(a));
    const x2 = r4(CX + or * Math.cos(a));
    const y2 = r4(CY + or * Math.sin(a));
    const major = i % 12 === 0;
    const t = (i + 0.5) / ticks;
    const lit = t <= p;

    lines.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={lit ? "#fb923c" : "#a8a29e"}
        strokeOpacity={lit ? (major ? 0.95 : 0.75) : major ? 0.14 : 0.07}
        strokeWidth={lit ? (major ? 0.75 : 0.5) : major ? 0.45 : 0.3}
        strokeLinecap="round"
        style={
          lit
            ? {
                filter: "drop-shadow(0 0 3px rgba(251, 146, 60, 0.45))",
              }
            : undefined
        }
      />,
    );
  }

  return (
    <svg
      viewBox="0 0 200 200"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      {lines}
    </svg>
  );
}
