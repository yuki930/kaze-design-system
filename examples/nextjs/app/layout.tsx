import type { Metadata } from "next";
import { DM_Sans, Montserrat, Noto_Sans_JP } from "next/font/google";
import { ThemeProvider, ThemeScript } from "kaze-design-system/hooks";
import "kaze-design-system/css/all";

// Kaze の書体（標準）: 英字は DM Sans、表示する数字は Montserrat、かなと漢字は Noto Sans JP。
// variable 名を Kaze のトークン（--font-sans と --font-numeric）が参照する。
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "請求書 | Kaze Starter",
  description: "Kaze Design System で組んだ Next.js の雛形",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
      className={`${dmSans.variable} ${montserrat.variable} ${notoSansJP.variable}`}
    >
      <head>
        {/* 保存されたテーマを描画前に当て、ダークモードでの白いちらつきを防ぐ */}
        <ThemeScript defaultTheme="system" />
      </head>
      <body>
        <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
      </body>
    </html>
  );
}
