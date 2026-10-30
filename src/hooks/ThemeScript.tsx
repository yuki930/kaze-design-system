import type { Theme } from "./useTheme";

export interface ThemeScriptProps {
  /** Theme to use when nothing is stored yet. Must match `<ThemeProvider defaultTheme>` (default: "light") */
  defaultTheme?: Theme;
  /** Content Security Policy nonce, if your app uses one */
  nonce?: string;
}

/**
 * Inline script that applies the stored theme / palette to `<html>` before
 * the first paint, so dark-mode users do not see a light flash while React
 * hydrates. Render it inside `<head>` (or as the first child of `<body>`).
 *
 * Reads the same localStorage keys as `ThemeProvider` ("kaze-theme" / "kaze-palette").
 */
export function ThemeScript({ defaultTheme = "light", nonce }: ThemeScriptProps) {
  const code = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("kaze-theme");if(t!=="light"&&t!=="dark"&&t!=="system"){t=${JSON.stringify(defaultTheme)}}if(t==="system"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.setAttribute("data-theme",t);var p=localStorage.getItem("kaze-palette");if(p==="cool"||p==="ink"||p==="indigo"){d.setAttribute("data-palette",p)}else{d.removeAttribute("data-palette")}}catch(e){}})();`;
  // biome-ignore lint/security/noDangerouslySetInnerHtml: the script is a constant built from a validated enum, not user input
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: code }} />;
}
