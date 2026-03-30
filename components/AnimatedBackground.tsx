"use client";

import { useEffect, useState } from "react";

type AnimatedBackgroundProps = {
  intensity: number;
};

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    const id = requestAnimationFrame(() => update());
    mq.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(id);
      mq.removeEventListener("change", update);
    };
  }, []);
  return reduce;
}

export function AnimatedBackground({ intensity }: AnimatedBackgroundProps) {
  const t = intensity;
  const prefersReduced = usePrefersReducedMotion();
  const slow = prefersReduced || t < 0.05;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse 120% 80% at 50% 20%, rgba(251, 191, 36, ${0.08 + t * 0.22}) 0%, transparent 50%),
            radial-gradient(ellipse 90% 70% at 80% 60%, rgba(244, 114, 182, ${0.06 + t * 0.2}) 0%, transparent 45%),
            radial-gradient(ellipse 80% 60% at 15% 70%, rgba(56, 189, 248, ${0.05 + t * 0.15}) 0%, transparent 40%),
            linear-gradient(180deg, #1a0f14 0%, #0f172a 40%, #0c1220 100%)`,
        }}
      />

      <Blob
        position="left-[-15%] top-[10%] h-[min(55vw,420px)] w-[min(55vw,420px)]"
        gradient="radial-gradient(circle, rgba(251,191,36,0.55) 0%, rgba(251,191,36,0.15) 45%, transparent 70%)"
        duration={slow ? 28 : Math.max(6, 18 - t * 12)}
        delay={0}
        scale={1 + t * 0.35}
        opacity={0.12 + t * 0.45}
      />
      <Blob
        position="right-[-10%] top-[35%] h-[min(50vw,380px)] w-[min(50vw,380px)]"
        gradient="radial-gradient(circle, rgba(244,114,182,0.5) 0%, rgba(244,114,182,0.12) 45%, transparent 70%)"
        duration={slow ? 32 : Math.max(8, 22 - t * 14)}
        delay={-4}
        scale={1 + t * 0.28}
        opacity={0.1 + t * 0.4}
      />
      <Blob
        position="bottom-[5%] left-[20%] h-[min(45vw,340px)] w-[min(45vw,340px)]"
        gradient="radial-gradient(circle, rgba(249,115,22,0.48) 0%, rgba(249,115,22,0.1) 45%, transparent 70%)"
        duration={slow ? 26 : Math.max(6, 16 - t * 10)}
        delay={-2}
        scale={1 + t * 0.32}
        opacity={0.08 + t * 0.38}
      />
      <Blob
        position="left-[35%] top-[45%] h-[min(40vw,300px)] w-[min(40vw,300px)]"
        gradient="radial-gradient(circle, rgba(34,211,238,0.42) 0%, rgba(34,211,238,0.08) 45%, transparent 70%)"
        duration={slow ? 30 : Math.max(7, 20 - t * 13)}
        delay={-6}
        scale={0.9 + t * 0.4}
        opacity={0.06 + t * 0.35}
      />
      <Blob
        position="right-[25%] bottom-[20%] h-[min(35vw,260px)] w-[min(35vw,260px)]"
        gradient="radial-gradient(circle, rgba(253,224,71,0.5) 0%, rgba(253,224,71,0.12) 45%, transparent 70%)"
        duration={slow ? 24 : Math.max(5, 14 - t * 9)}
        delay={-1}
        scale={1 + t * 0.5}
        opacity={t * 0.42}
      />

      {t > 0.55 && !prefersReduced ? (
        <BurstLayer strength={(t - 0.55) / 0.45} />
      ) : null}
    </div>
  );
}

function Blob({
  position,
  gradient,
  duration,
  delay,
  scale,
  opacity,
}: {
  position: string;
  gradient: string;
  duration: number;
  delay: number;
  scale: number;
  opacity: number;
}) {
  return (
    <div
      className={`absolute ${position}`}
      style={{
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        className="blob-drift h-full w-full rounded-full blur-[48px] md:blur-[64px]"
        style={{
          background: gradient,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      />
    </div>
  );
}

function BurstLayer({ strength }: { strength: number }) {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="burst-pop absolute rounded-full blur-md"
          style={{
            left: `${15 + i * 18}%`,
            top: `${20 + (i % 3) * 25}%`,
            width: `${8 + strength * 12}%`,
            height: `${8 + strength * 12}%`,
            maxWidth: 180,
            maxHeight: 180,
            opacity: 0.15 + strength * 0.35,
            background:
              i % 3 === 0
                ? "radial-gradient(circle, rgba(251,191,36,0.9), transparent 70%)"
                : i % 3 === 1
                  ? "radial-gradient(circle, rgba(244,114,182,0.85), transparent 70%)"
                  : "radial-gradient(circle, rgba(34,211,238,0.75), transparent 70%)",
            animationDuration: `${Math.max(1.2, 2.5 - strength * 1.2)}s`,
            animationDelay: `${i * 0.35}s`,
          }}
        />
      ))}
    </>
  );
}
