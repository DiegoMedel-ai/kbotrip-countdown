import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KBOTrip — Countdown Los Cabos 2026",
  description:
    "Cuenta regresiva hasta el viaje a Los Cabos: lunes 30 de marzo de 2026, 6:00 AM hora Ciudad de México.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${nunito.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-[#120a10] text-[#fffaf0]">
        {children}
      </body>
    </html>
  );
}
