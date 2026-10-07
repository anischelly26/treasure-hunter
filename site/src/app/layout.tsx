import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist_Mono, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import Shell from "@/components/shell/Shell";
import WorldMount from "@/components/world/WorldMount";
import { site } from "@/content/site";
import "./globals.css";

// Display and text: one variable family, animated on its weight and width axes.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-display",
  display: "swap",
});

// A static ExtraBold Condensed cut of the same family with overlapping contours
// merged. Variable fonts keep their contours separate, which shows as stray inner
// lines the moment type is drawn as an outline.
const outline = localFont({
  src: "../assets/fonts/BricolageGrotesque-ExtraBoldCondensed.woff2",
  weight: "800",
  variable: "--font-outline",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — AI / Software Engineer`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — AI / Software Engineer`,
    description: site.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#080706",
  colorScheme: "dark",
};

// Runs before first paint: choreographed layouts only apply when motion is welcome.
const preflight = `(function(){var d=document.documentElement;if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('motion');})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${outline.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: preflight }} />
        <noscript>
          <style>{`.loader{display:none!important}`}</style>
        </noscript>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <WorldMount />
        <Shell>{children}</Shell>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
