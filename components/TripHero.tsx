"use client";

export function TripHero() {
  return (
    <header className="relative z-[2] w-full shrink-0 border-b border-white/[0.06] bg-gradient-to-b from-black/20 to-transparent px-4 pb-10 pt-10 sm:pb-12 sm:pt-12">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <p className="font-[family-name:var(--font-fredoka)] mb-3 text-sm font-semibold tracking-wide text-amber-300/95 sm:text-base">
          KBOTrip · 2026
        </p>
        <h1 className="font-[family-name:var(--font-fredoka)] text-4xl font-bold tracking-tight text-amber-50 sm:text-5xl md:text-6xl">
          Los Cabos
        </h1>
      </div>
    </header>
  );
}
