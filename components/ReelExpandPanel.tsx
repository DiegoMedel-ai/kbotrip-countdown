"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type ReelExpandPanelProps = {
  shortCode: string;
  nombre: string;
  originRect: DOMRect;
  onClose: () => void;
};

function useNarrowPhone() {
  const [narrow, setNarrow] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 639px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setNarrow(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return narrow;
}

/** Layout viewport (documentElement.client*): coincide con el área de scroll y evita “doble” tamaño vs visualViewport. */
function useLayoutViewportSize() {
  const [size, setSize] = useState(() => ({
    w:
      typeof document !== "undefined"
        ? document.documentElement.clientWidth
        : 390,
    h:
      typeof document !== "undefined"
        ? document.documentElement.clientHeight
        : 800,
  }));
  useEffect(() => {
    const read = () => {
      const el = document.documentElement;
      setSize({ w: el.clientWidth, h: el.clientHeight });
    };
    read();
    window.addEventListener("resize", read);
    window.addEventListener("orientationchange", read);
    return () => {
      window.removeEventListener("resize", read);
      window.removeEventListener("orientationchange", read);
    };
  }, []);
  return size;
}

export function ReelExpandPanel({
  shortCode,
  nombre,
  originRect,
  onClose,
}: ReelExpandPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const narrow = useNarrowPhone();
  const { w: vpW, h: vpH } = useLayoutViewportSize();
  const embedUrl = `https://www.instagram.com/reel/${shortCode}/embed/`;
  const reelUrl = `https://www.instagram.com/reel/${shortCode}/`;

  const wModal = Math.min(420, Math.max(320, vpW - 32));
  const hModal = Math.min(720, Math.max(400, vpH - 40));

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

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

  /** Móvil: ocupa exactamente el viewport; desktop: panel centrado medido desde la ventana. */
  const animateTarget = narrow
    ? {
        left: 0,
        top: 0,
        x: 0,
        y: 0,
        width: vpW,
        height: vpH,
        borderRadius: 0,
      }
    : {
        left: "50%",
        top: "50%",
        x: "-50%",
        y: "-50%",
        width: wModal,
        height: hModal,
        borderRadius: 22,
      };

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reel-panel-title"
      className={`fixed z-[120] flex flex-col overflow-hidden border-white/55 bg-gradient-to-b from-amber-50/30 via-white/15 to-amber-950/50 backdrop-blur-lg ${
        narrow ? "border-0" : "border-[3px]"
      }`}
      style={{
        position: "fixed",
        boxShadow: narrow
          ? "none"
          : "0 28px 80px rgba(251,146,60,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        maxWidth: narrow ? vpW : undefined,
        maxHeight: narrow ? vpH : undefined,
      }}
      initial={{
        left: originRect.left,
        top: originRect.top,
        width: originRect.width,
        height: originRect.height,
        borderRadius: 9999,
      }}
      animate={animateTarget}
      transition={
        reduce
          ? { duration: 0.2, ease: "easeOut" }
          : { type: "spring", bounce: 0.15, stiffness: 300, damping: 32 }
      }
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
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
        <div className="relative min-h-0 min-w-0 flex-1 bg-black/20">
          <iframe
            title={`Reel de Instagram de ${nombre}`}
            src={embedUrl}
            className="absolute inset-0 h-full w-full border-0"
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
      </div>
    </motion.div>
  );
}
