import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Self-hosted display face (downloaded from Font Library, SIL OFL).
const druk = localFont({
  src: "../public/fonts/DrukaatieBurti-0.14.1/DrukaatieBurti-Bold.ttf",
  variable: "--font-druk",
  display: "swap",
  weight: "700",
});

export const metadata: Metadata = {
  title: "Carter Cripe — Under Construction",
  description:
    "cartercripe.com is currently under development. Resume and contact available.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${druk.variable}`}>
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
