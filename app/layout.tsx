import type { Metadata } from "next";
import { Noto_Sans_JP, Montserrat } from "next/font/google";
import { ThemeProvider } from "@/hooks";
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

export const metadata: Metadata = {
  title: "Kaze Design System",
  description: "風のように軽やかな、日本語最適化デザインシステム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      data-theme="light"
      suppressHydrationWarning
      className={`${notoSansJP.variable} ${montserrat.variable}`}
    >
      <body>
        <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
      </body>
    </html>
  );
}
