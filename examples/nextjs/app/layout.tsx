import type { Metadata } from "next";
import { Montserrat, Noto_Sans_JP } from "next/font/google";
import { ThemeProvider, ThemeScript } from "kaze-design-system/hooks";
import "kaze-design-system/css/all";

// Kaze の書体: 英数字は Montserrat、かなと漢字は Noto Sans JP。
// variable 名を Kaze のトークン（--font-sans）が参照する。
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
      className={`${montserrat.variable} ${notoSansJP.variable}`}
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
