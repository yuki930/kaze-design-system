import type { Metadata } from "next";
import { DM_Sans, IBM_Plex_Sans_JP, Inter, Montserrat, Noto_Sans_JP } from "next/font/google";
import { ThemeProvider, ThemeScript } from "@/hooks";
import { SourceLink } from "@/views/site/SourceLink";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

// Font set "standard": DM Sans for Latin, Montserrat for displayed numbers
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Font set "neutral"
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Font set "crisp". Japanese fonts are large, so they are not preloaded.
const plexSansJP = IBM_Plex_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-jp",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Kaze Design System",
  description: "風のように軽やかな、日本語最適化デザインシステム",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      data-theme="light"
      suppressHydrationWarning
      className={`${notoSansJP.variable} ${montserrat.variable} ${dmSans.variable} ${inter.variable} ${plexSansJP.variable}`}
    >
      <head>
        <ThemeScript defaultTheme="light" />
      </head>
      <body>
        <ThemeProvider defaultTheme="light">
          {children}
          <SourceLink />
        </ThemeProvider>
      </body>
    </html>
  );
}
