"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type ReelExpandPanelProps = {
  shortCode: string;
  nombre: string;
  originRect: DOMRect;
  onClose: () => void;
};

export function ReelExpandPanel({
  shortCode,
  nombre,
  originRect,
  onClose,
}: ReelExpandPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const embedUrl = `https://www.instagram.com/reel/${shortCode}/embed/`;
  const reelUrl = `https://www.instagram.com/reel/${shortCode}/`;

  const w =
    typeof window !== "undefined"
      ? Math.min(400, Math.round(window.innerWidth * 0.92))
      : 400;
  const h =
    typeof window !== "undefined"
      ? Math.min(700, Math.round(window.innerHeight * 0.78))
      : 700;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    let remove: (() => void) | undefined;
    const t = window.setTimeout(() => {
      const onDown = (e: MouseEvent) => {
        if (panelRef.current?.contains(e.target as Node)) return;
        onClose();
      };
      document.addEventListener("mousedown", onDown);
      remove = () => document.removeEventListener("mousedown", onDown);
    }, 0);
    return () => {
      window.clearTimeout(t);
      remove?.();
    };
  }, [onClose]);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reel-panel-title"
      className="fixed z-[120] flex flex-col overflow-hidden border-[3px] border-white/55 bg-gradient-to-b from-amber-50/30 via-white/15 to-amber-950/50 backdrop-blur-lg"
      style={{
        position: "fixed",
        boxShadow:
          "0 28px 80px rgba(251,146,60,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
      initial={{
        left: originRect.left,
        top: originRect.top,
        width: originRect.width,
        height: originRect.height,
        borderRadius: 9999,
      }}
      animate={{
        left: "50%",
        top: "50%",
        x: "-50%",
        y: "-50%",
        width: w,
        height: h,
        borderRadius: 22,
      }}
      transition={
        reduce
          ? { duration: 0.2, ease: "easeOut" }
          : { type: "spring", bounce: 0.2, stiffness: 280, damping: 28 }
      }
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/20 bg-black/10 px-3 py-2.5">
        <h2
          id="reel-panel-title"
          className="font-[family-name:var(--font-fredoka)] truncate text-sm font-semibold text-amber-950"
        >
          Reel — {nombre}
        </h2>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-full bg-amber-950/15 px-3 py-1.5 text-sm font-semibold text-amber-950/90 transition-colors hover:bg-amber-950/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          Cerrar
        </button>
      </div>
      <div className="min-h-0 flex-1 bg-black/20">
        <iframe
          title={`Reel de Instagram de ${nombre}`}
          src={embedUrl}
          className="h-full min-h-[480px] w-full border-0 sm:min-h-[520px]"
          allow="encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <div className="shrink-0 border-t border-white/20 bg-black/10 px-3 py-2 text-center">
        <a
          href={reelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-fredoka)] text-sm font-semibold text-amber-800 underline-offset-2 hover:text-amber-950 hover:underline"
        >
          Abrir en Instagram
        </a>
      </div>
    </motion.div>
  );
}
