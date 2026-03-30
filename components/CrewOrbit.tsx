"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { CrewMember } from "@/lib/crew";

type CrewOrbitProps = {
  crew: CrewMember[];
  orbitRadiusPx: number;
  onSelect: (member: CrewMember, anchorRect: DOMRect) => void;
};

const N = 9;

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
  const r = Math.max(80, orbitRadiusPx);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-visible"
      aria-label="Integrantes del viaje"
    >
      <div className="absolute left-1/2 top-1/2 h-0 w-0">
        {crew.slice(0, N).map((member, i) => {
          const deg = (i / N) * 360;
          const hasReel = Boolean(member.reelShortCode);
          const floatDuration = 2.8 + (i % 4) * 0.35;
          const floatDelay = i * 0.18;
          const pulseHalfDuration = 6 + (i % 5) * 0.45;

          return (
            <div
              key={member.id}
              className="absolute left-0 top-0"
              style={{
                transform: `translate(-50%, -50%) rotate(${deg}deg)`,
                transformOrigin: "center center",
              }}
            >
              <motion.div
                initial={reduce ? false : { y: 0, scale: 0, opacity: 0 }}
                animate={{ y: -r, scale: 1, opacity: 1 }}
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
                style={{ transformOrigin: "center top" }}
              >
                <div style={{ transform: `rotate(${-deg}deg)` }}>
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
                    <motion.div
                      animate={
                        reduce
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
                          "pointer-events-auto flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border-[3px] border-white/50 bg-gradient-to-b from-white/35 to-white/10 shadow-[0_12px_32px_rgba(251,146,60,0.35),inset_0_2px_12px_rgba(255,255,255,0.45)] backdrop-blur-sm md:h-[78px] md:w-[78px]",
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
