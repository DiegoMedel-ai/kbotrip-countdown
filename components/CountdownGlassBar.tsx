"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCountdown } from "./useCountdown";

const labels = ["Días", "Horas", "Minutos", "Segundos"] as const;

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function CountdownCell({
  value,
  label,
  showDivider,
}: {
  value: number;
  label: string;
  showDivider: boolean;
}) {
  const reduce = useReducedMotion();
  const display =
    label === "Días" ? value.toString() : pad2(Math.min(value, 99));

  return (
    <>
      {showDivider && (
        <div
          className="hidden h-10 w-px shrink-0 bg-white/25 sm:block"
          aria-hidden
        />
      )}
      <div className="flex min-w-0 flex-[1_1_0%] flex-col items-center justify-center px-1.5 py-3 sm:px-4 sm:py-4">
        <motion.span
          key={display}
          initial={reduce ? false : { opacity: 0.5, y: 6, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="countdown-digit font-[family-name:var(--font-fredoka)] text-2xl font-bold tracking-tight tabular-nums sm:text-3xl md:text-4xl"
        >
          {display}
        </motion.span>
        <span className="countdown-label font-[family-name:var(--font-fredoka)] mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-xs">
          {label}
        </span>
      </div>
    </>
  );
}

export function CountdownGlassBar() {
  const { days, hours, minutes, seconds, isComplete } = useCountdown();

  if (isComplete) {
    return (
      <div className="countdown-glass px-6 py-5 text-center">
        <p className="font-[family-name:var(--font-fredoka)] text-lg font-bold text-white drop-shadow-md sm:text-xl">
          ¡Es hora de Cabos!
        </p>
        <p className="mt-1 text-sm font-medium text-white/85">
          Nos vemos en el aeropuerto.
        </p>
      </div>
    );
  }

  return (
    <div
      className="countdown-glass mx-auto flex w-full max-w-full flex-row items-stretch justify-center sm:max-w-[min(92vw,420px)]"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      <CountdownCell value={days} label={labels[0]} showDivider={false} />
      <CountdownCell value={hours} label={labels[1]} showDivider />
      <CountdownCell value={minutes} label={labels[2]} showDivider />
      <CountdownCell value={seconds} label={labels[3]} showDivider />
    </div>
  );
}
