"use client";

import Image from "next/image";
import { useLayoutEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { CrewMember } from "@/lib/crew";

type CrewOrbitProps = {
  crew: CrewMember[];
  orbitRadiusPx: number;
  onSelect: (member: CrewMember, anchorRect: DOMRect) => void;
};

const N = 9;

/**
 * Calcula la posición (x, y) en px relativa al centro de la órbita.
 * Móvil: elipse vertical — 5 en arco superior compacto, 4 en arco inferior compacto.
 */
function bubblePosition(
  index: number,
  r: number,
  mobileSplit: boolean,
): { x: number; y: number } {
  if (!mobileSplit) {
    const deg = (index / N) * 360;
    const rad = (deg * Math.PI) / 180;
    return { x: r * Math.sin(rad), y: -r * Math.cos(rad) };
  }

  // Elipse más alta que ancha para separar arriba/abajo visualmente
  const rx = r * 1.28;
  const ry = r * 1.3;

  if (index < 5) {
    // Top 5: arco -60° → +60°
    const u = (index / 4) * 2 - 1;
    const rad = (u * 60 * Math.PI) / 180;
    return { x: rx * Math.sin(rad), y: -ry * Math.cos(rad) };
  }

  // Bottom 4: arco 180° ± 60°
  const j = index - 5;
  const v = (j / 3) * 2 - 1;
  const deg = 180 + v * 60;
  const rad = (deg * Math.PI) / 180;
  return { x: rx * Math.sin(rad), y: -ry * Math.cos(rad) };
}

function useMobileOrbitSplit() {
  const [split, setSplit] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setSplit(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return split;
}

function initialFromNombre(nombre: string) {
  const t = nombre.trim();
  return t ? t[0]!.toUpperCase() : "?";
}

export function CrewOrbit({
  crew,
  orbitRadiusPx,
  onSelect,
}: CrewOrbitProps) {
  const reduce = useReducedMotion();
  const mobileSplit = useMobileOrbitSplit();
  const r = Math.max(80, orbitRadiusPx);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-visible"
      aria-label="Integrantes del viaje"
    >
      <div className="absolute left-1/2 top-1/2 h-0 w-0">
        {crew.slice(0, N).map((member, i) => {
          const pos = bubblePosition(i, r, mobileSplit);
          const hasReel = Boolean(member.reelShortCode);
          const floatDuration = 2.8 + (i % 4) * 0.35;
          const floatDelay = i * 0.18;
          const pulseHalfDuration = 6 + (i % 5) * 0.45;

          const mag = Math.sqrt(pos.x * pos.x + pos.y * pos.y) || 1;
          const ux = pos.x / mag;
          const uy = pos.y / mag;
          // SVG label geometry (desktop: button = 90px → radius ≈ 45px)
          const lineX1 = ux * 52;
          const lineY1 = uy * 52;
          const lineX2 = ux * 84;
          const lineY2 = uy * 84;
          const textX = ux * 92;
          const textY = uy * 92;
          const textAnchor =
            ux > 0.25 ? "start" : ux < -0.25 ? "end" : "middle";
          const dominantBaseline =
            uy > 0.25 ? "hanging" : uy < -0.25 ? "auto" : "central";

          return (
            <div
              key={member.id}
              className="absolute left-0 top-0"
              style={{ transform: "translate(-50%, -50%)" }}
            >
              <motion.div
                initial={reduce ? false : { x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{ x: pos.x, y: pos.y, scale: 1, opacity: 1 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness: 180,
                        damping: 16,
                        delay: 0.08 * i,
                      }
                }
              >
                <div
                  className={reduce ? "" : "crew-bubble-float"}
                  style={
                    reduce
                      ? undefined
                      : {
                          animationDuration: `${floatDuration}s`,
                          animationDelay: `${floatDelay}s`,
                        }
                  }
                >
                  {/* group wrapper enables CSS hover detection for the label */}
                  <div className="group relative">
                    <motion.div
                      animate={
                        reduce || mobileSplit
                          ? undefined
                          : {
                              scale: [1, 1.045],
                            }
                      }
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: pulseHalfDuration,
                        ease: "easeInOut",
                        delay: floatDelay * 0.35,
                      }}
                    >
                      <motion.button
                        type="button"
                        disabled={!hasReel}
                        whileHover={
                          hasReel && !reduce ? { scale: 1.04 } : undefined
                        }
                        whileTap={
                          hasReel && !reduce ? { scale: 0.97 } : undefined
                        }
                        className={[
                          "pointer-events-auto flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border-[3px] border-white/50 bg-gradient-to-b from-white/35 to-white/10 shadow-[0_12px_32px_rgba(251,146,60,0.35),inset_0_2px_12px_rgba(255,255,255,0.45)] backdrop-blur-none md:h-[90px] md:w-[90px] md:backdrop-blur-sm",
                          hasReel
                            ? "ring-2 ring-amber-300/40 hover:border-amber-100 hover:ring-amber-200/60 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/70"
                            : "cursor-not-allowed border-white/25 opacity-70 ring-0",
                        ].join(" ")}
                        aria-label={
                          hasReel
                            ? `Ver reel de ${member.nombre}`
                            : `${member.nombre}, reel pendiente`
                        }
                        onClick={(e) => {
                          if (!hasReel) return;
                          const el = e.currentTarget;
                          onSelect(member, el.getBoundingClientRect());
                        }}
                      >
                        <OrbitAvatar member={member} />
                      </motion.button>
                    </motion.div>

                    {/* Name label on hover — desktop only */}
                    <svg
                      className="pointer-events-none absolute left-1/2 top-1/2 hidden overflow-visible opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:block"
                      style={{ width: 0, height: 0 }}
                      aria-hidden
                    >
                      <line
                        x1={lineX1}
                        y1={lineY1}
                        x2={lineX2}
                        y2={lineY2}
                        stroke="rgba(255,255,255,0.7)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <text
                        x={textX}
                        y={textY}
                        textAnchor={textAnchor}
                        dominantBaseline={dominantBaseline}
                        fill="white"
                        fontSize="12"
                        fontWeight="600"
                        style={{
                          filter:
                            "drop-shadow(0 1px 4px rgba(0,0,0,0.85))",
                          fontFamily: "inherit",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {member.nombre}
                      </text>
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrbitAvatar({ member }: { member: CrewMember }) {
  if (member.avatarSrc) {
    return (
      <Image
        src={member.avatarSrc}
        alt=""
        width={128}
        height={128}
        className="h-full w-full object-cover"
        sizes="80px"
      />
    );
  }
  return (
    <span className="font-[family-name:var(--font-fredoka)] text-2xl font-bold text-amber-950/80 md:text-3xl">
      {initialFromNombre(member.nombre)}
    </span>
  );
}
