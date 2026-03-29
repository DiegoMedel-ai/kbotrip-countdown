"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CREW } from "@/lib/crew";
import { useIsMobile } from "@/lib/use-is-mobile";
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
  const isMobile = useIsMobile();
  const dialRef = useRef<HTMLDivElement>(null);
  const [orbitR, setOrbitR] = useState(140);

  useLayoutEffect(() => {
    const el = dialRef.current;
    if (!el) return;
    /* 78px/2 + borde + ring + pulso ~1.045 + float vertical que empuja hacia arriba */
    const BUBBLE_RADIUS = 48;
    const EDGE = 20;
    const update = () => {
      const w = el.clientWidth;
      /* clientWidth = layout viewport (evita desajuste x2 con visualViewport en algunos WebViews) */
      const vw = document.documentElement.clientWidth;
      const halfUsable = vw / 2 - EDGE - BUBBLE_RADIUS;
      const fromDial = Math.round(w * 0.5);
      const capped = Math.floor(Math.min(fromDial, halfUsable, 250));
      setOrbitR(Math.max(88, capped));
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const [reel, setReel] = useState<ReelState | null>(null);

  return (
    <>
      <AnimatedBackground intensity={rampProgress} mobileLite={isMobile} />
      <div className="trip-grain" aria-hidden />

      <div className="relative z-[2] flex min-h-dvh flex-col">
        <TripHero />

        <main className="flex w-full min-h-0 flex-1 flex-col items-center justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:py-10 absolute h-full w-full">
          <div className="relative mx-auto w-full max-w-[min(calc(100vw-2rem),520px)] overflow-visible sm:max-w-[min(92vw,520px)]">
            <div
              className="pointer-events-none absolute -right-1 -top-2 select-none font-[family-name:var(--font-fredoka)] text-[clamp(3.5rem,16vw,6.5rem)] font-bold leading-none text-amber-200/[0.06] sm:-right-2 sm:-top-4 md:-right-4 md:-top-8"
              aria-hidden
            >
              30
            </div>

            <div
              ref={dialRef}
              className="relative mx-auto aspect-square w-full max-w-[min(100%,440px)] overflow-visible sm:max-w-[440px] md:max-w-[480px]"
            >
              <RadialTickRing
                ticks={144}
                fillProgress={ringFillProgress}
                lowFi={isMobile}
              />

              <div className="absolute inset-0">
                <div className="absolute inset-[4%] flex items-center justify-center overflow-hidden rounded-full sm:inset-[5%]">
                  <div className="relative flex h-full w-full items-center justify-center">
                    <div className="sphere-glow sphere-glow--b z-0" aria-hidden />
                    <div className="sphere-glow z-0" aria-hidden />
                    <div className="sphere-core relative z-[1]" />
                  </div>
                </div>
                <div className="absolute left-1/2 top-[48%] z-[2] flex w-[min(94%,400px)] max-w-full -translate-x-1/2 -translate-y-1/2 justify-center px-2 sm:top-1/2 sm:w-[88%] sm:px-1">
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
