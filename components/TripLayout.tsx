"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CREW } from "@/lib/crew";
import { AnimatedBackground } from "./AnimatedBackground";
import { CelebrationLayer } from "./CelebrationLayer";
import { CountdownGlassBar } from "./CountdownGlassBar";
import { CrewOrbit } from "./CrewOrbit";
import { RadialTickRing } from "./RadialTickRing";
import { ReelExpandPanel } from "./ReelExpandPanel";
import { TripHero } from "./TripHero";
import { useTripProgress } from "./useTripProgress";

type ReelState = { shortCode: string; nombre: string; originRect: DOMRect };

/**
 * Fondo + hero + countdown en columnas: el título vive fuera del bloque del dial
 * para que no quede pegado visualmente al countdown.
 */
export function TripLayout() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) {
    return (
      <div
        className="min-h-dvh bg-[#120a10]"
        aria-busy="true"
        aria-label="Cargando cuenta regresiva"
      />
    );
  }

  return <TripLayoutLive />;
}

function TripLayoutLive() {
  const { rampProgress, ringFillProgress, hasPassedTarget } = useTripProgress();
  const dialRef = useRef<HTMLDivElement>(null);
  const [orbitR, setOrbitR] = useState(140);

  useLayoutEffect(() => {
    const el = dialRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      setOrbitR(Math.round(Math.min(262, Math.max(108, w * 0.58))));
    });
    ro.observe(el);
    setOrbitR(
      Math.round(
        Math.min(262, Math.max(108, el.clientWidth * 0.58)),
      ),
    );
    return () => ro.disconnect();
  }, []);

  const [reel, setReel] = useState<ReelState | null>(null);

  return (
    <>
      <AnimatedBackground intensity={rampProgress} />
      <div className="trip-grain" aria-hidden />

      <div className="relative z-[2] flex min-h-dvh flex-col">
        <TripHero />

        <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-3 py-8 sm:py-10 absolute w-full h-full">
          <div className="relative w-full max-w-[min(92vw,520px)] overflow-visible px-1">
            <div
              className="pointer-events-none absolute -right-2 -top-4 select-none font-[family-name:var(--font-fredoka)] text-[clamp(3.5rem,16vw,6.5rem)] font-bold leading-none text-amber-200/[0.06] md:-right-4 md:-top-8"
              aria-hidden
            >
              30
            </div>

            <div
              ref={dialRef}
              className="relative mx-auto aspect-square w-full max-w-[440px] overflow-visible md:max-w-[480px]"
            >
              <RadialTickRing ticks={144} fillProgress={ringFillProgress} />

              <div className="absolute inset-0 flex items-center justify-center overflow-visible">
                <div className="sphere-glow sphere-glow--b z-0" aria-hidden />
                <div className="sphere-glow z-0" aria-hidden />
                <div className="sphere-core relative z-[1]" />
                <div className="absolute z-[2] flex w-[88%] max-w-[400px] justify-center px-1">
                  <CountdownGlassBar />
                </div>
              </div>

              <CrewOrbit
                crew={CREW}
                orbitRadiusPx={orbitR}
                onSelect={(m, rect) => {
                  if (m.reelShortCode) {
                    setReel({
                      shortCode: m.reelShortCode,
                      nombre: m.nombre,
                      originRect: rect,
                    });
                  }
                }}
              />
            </div>
          </div>
        </main>
      </div>

      <CelebrationLayer active={hasPassedTarget} />

      {reel ? (
        <ReelExpandPanel
          shortCode={reel.shortCode}
          nombre={reel.nombre}
          originRect={reel.originRect}
          onClose={() => setReel(null)}
        />
      ) : null}
    </>
  );
}
