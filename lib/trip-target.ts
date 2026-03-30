import { DateTime } from "luxon";

const ZONE = "America/Mexico_City";

/** Lunes 30 mar 2026, 06:00 — Ciudad de México */
export const TRIP_TARGET_MS = DateTime.fromObject(
  {
    year: 2026,
    month: 3,
    day: 30,
    hour: 6,
    minute: 0,
    second: 0,
    millisecond: 0,
  },
  { zone: ZONE },
).toMillis();

/** Desde aquí el fondo va ganando intensidad (viernes 27 mar 2026, 00:00 CDMX) */
export const BACKGROUND_RAMP_START_MS = DateTime.fromObject(
  {
    year: 2026,
    month: 3,
    day: 27,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  },
  { zone: ZONE },
).toMillis();

/**
 * El anillo de marcas se “completa” en la última ventana de 24h antes del viaje.
 * (Dom 29 mar 2026, 06:00 → Lun 30 mar 2026, 06:00 CDMX)
 */
export const RING_FILL_START_MS = DateTime.fromObject(
  {
    year: 2026,
    month: 3,
    day: 29,
    hour: 6,
    minute: 0,
    second: 0,
    millisecond: 0,
  },
  { zone: ZONE },
).toMillis();

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

/** 0 antes del viernes 27; 1 al llegar o pasar la fecha del viaje */
export function getRampProgress(nowMs: number): number {
  if (nowMs < BACKGROUND_RAMP_START_MS) return 0;
  if (nowMs >= TRIP_TARGET_MS) return 1;
  return clamp01(
    (nowMs - BACKGROUND_RAMP_START_MS) / (TRIP_TARGET_MS - BACKGROUND_RAMP_START_MS),
  );
}

/** 0 antes de las últimas 24h; 1 al llegar o pasar la hora del viaje */
export function getRingFillProgress(nowMs: number): number {
  if (nowMs < RING_FILL_START_MS) return 0;
  if (nowMs >= TRIP_TARGET_MS) return 1;
  return clamp01(
    (nowMs - RING_FILL_START_MS) / (TRIP_TARGET_MS - RING_FILL_START_MS),
  );
}
