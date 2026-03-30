"use client";

import confetti from "canvas-confetti";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type CelebrationLayerProps = {
  active: boolean;
};

export function CelebrationLayer({ active }: CelebrationLayerProps) {
  const reduce = useReducedMotion();
  const fired = useRef(false);

  useEffect(() => {
    if (!active || fired.current) return;
    if (reduce) return;
    fired.current = true;

    const duration = 4500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ["#fbbf24", "#f472b6", "#38bdf8", "#fb923c", "#a78bfa"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ["#fbbf24", "#f472b6", "#38bdf8", "#fb923c", "#a78bfa"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.45 },
      colors: ["#fbbf24", "#f472b6", "#38bdf8", "#fb923c"],
      scalar: 1.1,
    });

    const t = window.setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 160,
        startVelocity: 35,
        origin: { x: 0.5, y: 0.35 },
        colors: ["#fef08a", "#fb7185", "#67e8f9"],
      });
    }, 400);

    return () => window.clearTimeout(t);
  }, [active, reduce]);

  if (!active) return null;

  return (
    <div
      className="celebration-overlay pointer-events-none fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      aria-live="polite"
      role="status"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-500/25 via-pink-500/20 to-cyan-500/15" />
      <motion.div
        initial={reduce ? false : { scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="relative z-[1] flex flex-wrap items-center justify-center gap-3 px-4 text-center"
      >
        <span className="text-[clamp(3rem,14vw,8rem)] leading-none" aria-hidden>
          🔥
        </span>
        <span className="font-[family-name:var(--font-fredoka)] text-[clamp(2.5rem,12vw,7rem)] font-bold uppercase tracking-tight text-white drop-shadow-[0_4px_24px_rgba(251,191,36,0.6)]">
          KBOTRIP
        </span>
        <span className="text-[clamp(3rem,14vw,8rem)] leading-none" aria-hidden>
          🔥
        </span>
      </motion.div>
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="font-[family-name:var(--font-fredoka)] relative z-[1] mt-6 text-lg text-amber-100/95 md:text-2xl"
      >
        ¡Nos vamos a Los Cabos! 🔥🔥🔥
      </motion.p>
    </div>
  );
}
