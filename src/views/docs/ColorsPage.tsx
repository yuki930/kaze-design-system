import styles from "./docs.module.css";

/* ── Palette data (12 hues × 10 shades) ──────────────────── */

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

interface PaletteHue {
  name: string;
  values: Record<number, string>;
}

const palette: PaletteHue[] = [
  {
    name: "red",
    values: { 50: "#fef2f2", 100: "#fee2e2", 200: "#fecaca", 300: "#fca5a5", 400: "#f87171", 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c", 800: "#991b1b", 900: "#7f1d1d" },
  },
  {
    name: "orange",
    values: { 50: "#fff7ed", 100: "#ffedd5", 200: "#fed7aa", 300: "#fdba74", 400: "#fb923c", 500: "#f97316", 600: "#ea580c", 700: "#c2410c", 800: "#9a3412", 900: "#7c2d12" },
  },
  {
    name: "amber",
    values: { 50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d", 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309", 800: "#92400e", 900: "#78350f" },
  },
  {
    name: "yellow",
    values: { 50: "#fefce8", 100: "#fef9c3", 200: "#fef08a", 300: "#fde047", 400: "#facc15", 500: "#eab308", 600: "#ca8a04", 700: "#a16207", 800: "#854d0e", 900: "#713f12" },
  },
  {
    name: "lime",
    values: { 50: "#f7fee7", 100: "#ecfccb", 200: "#d9f99d", 300: "#bef264", 400: "#a3e635", 500: "#84cc16", 600: "#65a30d", 700: "#4d7c0f", 800: "#3f6212", 900: "#365314" },
  },
  {
    name: "green",
    values: { 50: "#f0fdf4", 100: "#dcfce7", 200: "#bbf7d0", 300: "#86efac", 400: "#4ade80", 500: "#22c55e", 600: "#16a34a", 700: "#15803d", 800: "#166534", 900: "#14532d" },
  },
  {
    name: "emerald",
    values: { 50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b" },
  },
  {
    name: "teal",
    values: { 50: "#f0fdfa", 100: "#ccfbf1", 200: "#99f6e4", 300: "#5eead4", 400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e", 800: "#115e59", 900: "#134e4a" },
  },
  {
    name: "cyan",
    values: { 50: "#ecfeff", 100: "#cffafe", 200: "#a5f3fc", 300: "#67e8f9", 400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2", 700: "#0e7490", 800: "#155e75", 900: "#164e63" },
  },
  {
    name: "blue",
    values: { 50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a8a" },
  },
  {
    name: "violet",
    values: { 50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9", 800: "#5b21b6", 900: "#4c1d95" },
  },
  {
    name: "pink",
    values: { 50: "#fdf2f8", 100: "#fce7f3", 200: "#fbcfe8", 300: "#f9a8d4", 400: "#f472b6", 500: "#ec4899", 600: "#db2777", 700: "#be185d", 800: "#9d174d", 900: "#831843" },
  },
];

/* ── Zinc scale ──────────────────────────────────────────── */

const zincScale = [
  { name: "zinc-50", css: "var(--zinc-50)", hex: "#faf9f7" },
  { name: "zinc-100", css: "var(--zinc-100)", hex: "#f5f3f0" },
  { name: "zinc-200", css: "var(--zinc-200)", hex: "#e7e4df" },
  { name: "zinc-300", css: "var(--zinc-300)", hex: "#d6d2cc" },
  { name: "zinc-400", css: "var(--zinc-400)", hex: "#a8a29e" },
  { name: "zinc-500", css: "var(--zinc-500)", hex: "#78716c" },
  { name: "zinc-600", css: "var(--zinc-600)", hex: "#57534e" },
  { name: "zinc-700", css: "var(--zinc-700)", hex: "#44403c" },
  { name: "zinc-800", css: "var(--zinc-800)", hex: "#292524" },
  { name: "zinc-900", css: "var(--zinc-900)", hex: "#1c1917" },
  { name: "zinc-950", css: "var(--zinc-950)", hex: "#0c0a09" },
];

/* ── Semantic color definitions ──────────────────────────── */

interface SemanticColor {
  name: string;
  variable: string;
  light: string;
  dark: string;
}

const bgColors: SemanticColor[] = [
  { name: "bg", variable: "--color-bg", light: "#ffffff", dark: "zinc-950" },
  { name: "bg-secondary", variable: "--color-bg-secondary", light: "zinc-50", dark: "#111113" },
  { name: "bg-tertiary", variable: "--color-bg-tertiary", light: "zinc-100", dark: "zinc-900" },
  { name: "bg-inverse", variable: "--color-bg-inverse", light: "zinc-950", dark: "#ffffff" },
];

const fgColors: SemanticColor[] = [
  { name: "fg", variable: "--color-fg", light: "zinc-950", dark: "zinc-50" },
  { name: "fg-secondary", variable: "--color-fg-secondary", light: "zinc-500", dark: "zinc-400" },
  { name: "fg-tertiary", variable: "--color-fg-tertiary", light: "zinc-400", dark: "zinc-500" },
  { name: "fg-inverse", variable: "--color-fg-inverse", light: "#ffffff", dark: "zinc-950" },
  { name: "fg-muted", variable: "--color-fg-muted", light: "zinc-600", dark: "zinc-400" },
];

const borderColors: SemanticColor[] = [
  { name: "border", variable: "--color-border", light: "zinc-200", dark: "zinc-800" },
  { name: "border-strong", variable: "--color-border-strong", light: "zinc-300", dark: "zinc-700" },
  { name: "border-subtle", variable: "--color-border-subtle", light: "zinc-100", dark: "zinc-800" },
];

const surfaceColors: SemanticColor[] = [
  { name: "surface", variable: "--color-surface", light: "#ffffff", dark: "zinc-900" },
  { name: "surface-hover", variable: "--color-surface-hover", light: "zinc-50", dark: "zinc-800" },
  { name: "surface-active", variable: "--color-surface-active", light: "zinc-100", dark: "zinc-700" },
];

const primaryColors: SemanticColor[] = [
  { name: "primary", variable: "--color-primary", light: "zinc-950", dark: "#ffffff" },
  { name: "primary-fg", variable: "--color-primary-fg", light: "#ffffff", dark: "zinc-950" },
  { name: "primary-hover", variable: "--color-primary-hover", light: "zinc-800", dark: "zinc-200" },
];

const secondaryColors: SemanticColor[] = [
  { name: "secondary", variable: "--color-secondary", light: "zinc-100", dark: "zinc-800" },
  { name: "secondary-fg", variable: "--color-secondary-fg", light: "zinc-900", dark: "zinc-100" },
  { name: "secondary-hover", variable: "--color-secondary-hover", light: "zinc-200", dark: "zinc-700" },
];

/* ── Status colors ───────────────────────────────────────── */

const statusGroups: { title: string; source: string; colors: { name: string; variable: string; ref: string }[] }[] = [
  {
    title: "ポジティブ（成功）",
    source: "emerald",
    colors: [
      { name: "positive", variable: "--color-positive", ref: "emerald-500" },
      { name: "positive-light", variable: "--color-positive-light", ref: "emerald-50" },
      { name: "positive-fg", variable: "--color-positive-fg", ref: "emerald-600" },
      { name: "positive-strong", variable: "--color-positive-strong", ref: "emerald-700" },
    ],
  },
  {
    title: "ネガティブ（エラー）",
    source: "red",
    colors: [
      { name: "negative", variable: "--color-negative", ref: "red-500" },
      { name: "negative-light", variable: "--color-negative-light", ref: "red-50" },
      { name: "negative-fg", variable: "--color-negative-fg", ref: "red-600" },
      { name: "negative-strong", variable: "--color-negative-strong", ref: "red-700" },
    ],
  },
  {
    title: "ワーニング（警告）",
    source: "amber",
    colors: [
      { name: "warning", variable: "--color-warning", ref: "amber-500" },
      { name: "warning-light", variable: "--color-warning-light", ref: "amber-50" },
      { name: "warning-fg", variable: "--color-warning-fg", ref: "amber-600" },
    ],
  },
  {
    title: "インフォ（情報）",
    source: "blue",
    colors: [
      { name: "info", variable: "--color-info", ref: "blue-500" },
      { name: "info-light", variable: "--color-info-light", ref: "blue-50" },
      { name: "info-fg", variable: "--color-info-fg", ref: "blue-600" },
    ],
  },
];

/* ── Chart colors ────────────────────────────────────────── */

const chartColors = [
  { name: "blue", variable: "--chart-blue", ref: "blue-500" },
  { name: "amber", variable: "--chart-amber", ref: "amber-500" },
  { name: "emerald", variable: "--chart-emerald", ref: "emerald-500" },
  { name: "pink", variable: "--chart-pink", ref: "pink-500" },
  { name: "cyan", variable: "--chart-cyan", ref: "cyan-500" },
  { name: "red", variable: "--chart-red", ref: "red-500" },
  { name: "lime", variable: "--chart-lime", ref: "lime-500" },
  { name: "purple", variable: "--chart-purple", ref: "violet-500" },
  { name: "orange", variable: "--chart-orange", ref: "orange-500" },
  { name: "teal", variable: "--chart-teal", ref: "teal-500" },
  { name: "yellow", variable: "--chart-yellow", ref: "yellow-500" },
  { name: "green", variable: "--chart-green", ref: "green-500" },
];

const chartCategorical = [
  { name: "1", ref: "blue-500" },
  { name: "2", ref: "amber-500" },
  { name: "3", ref: "emerald-500" },
  { name: "4", ref: "pink-500" },
  { name: "5", ref: "cyan-500" },
  { name: "6", ref: "red-500" },
  { name: "7", ref: "lime-500" },
  { name: "8", ref: "violet-500" },
  { name: "9", ref: "orange-500" },
  { name: "10", ref: "teal-500" },
  { name: "11", ref: "yellow-500" },
  { name: "12", ref: "green-500" },
];

/* ── Helpers ─────────────────────────────────────────────── */

/** Returns contrasting text color for a given shade number */
function textColor(shade: number): string {
  return shade >= 500 ? "#ffffff" : "var(--color-fg)";
}

function SemanticSection({
  title,
  description,
  colors,
}: {
  title: string;
  description: string;
  colors: SemanticColor[];
}) {
  return (
    <>
      <h3 className={styles.subsectionTitle}>{title}</h3>
      <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-fg-secondary)", marginBottom: "var(--space-4)" }}>
        {description}
      </p>
      <div className={styles.tokenGrid}>
        {colors.map((c) => (
          <div key={c.variable} className={styles.tokenCard}>
            <div
              className={styles.tokenSwatch}
              style={{ background: `var(${c.variable})` }}
            />
            <div className={styles.tokenInfo}>
              <div className={styles.tokenName}>{c.name}</div>
              <div className={styles.tokenValue}>{c.variable}</div>
              <div style={{ fontSize: "var(--font-size-2xs)", color: "var(--color-fg-tertiary)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                ライト: {c.light} / ダーク: {c.dark}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── Page Component ──────────────────────────────────────── */

export function ColorsPage() {
  return (
    <div>
      <h1 className={styles.pageTitle}>カラー</h1>
      <p className={styles.pageDescription}>
        Kaze のカラーシステムは 3層構造で設計されています。12色×10階調のプリミティブパレット、
        Warm Zinc のニュートラルスケール、そしてテーマ対応のセマンティックトークン。
      </p>

      {/* ── Palette ────────────────────────────────────────── */}
      <h2 className={styles.sectionTitle}>カラーパレット（12色×10階調）</h2>
      <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-fg-secondary)", marginBottom: "var(--space-4)" }}>
        チャート、イラスト、装飾背景、ステータスカラーの基盤となるプリミティブパレット。
        各色 50〜900 の10段階。ホバーで shade 番号を表示します。
      </p>

      {/* Shade header */}
      <div className={styles.paletteRow}>
        <span className={styles.paletteHueName} />
        <div className={styles.paletteShadeLabels}>
          {shades.map((s) => (
            <span key={s} className={styles.paletteShadeLabel}>{s}</span>
          ))}
        </div>
      </div>

      {/* Zinc row */}
      <div className={styles.paletteRow}>
        <span className={styles.paletteHueName}>zinc</span>
        <div className={styles.paletteStrip}>
          {shades.map((shade, i) => {
            const c = zincScale[i]!;
            return (
              <div
                key={shade}
                className={styles.paletteSwatch}
                style={{ background: c.css }}
                title={`${c.name}: ${c.hex}`}
              >
                <span className={styles.paletteLabel} style={{ color: textColor(shade) }}>
                  {shade}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 12 hue rows */}
      {palette.map((hue) => (
        <div key={hue.name} className={styles.paletteRow}>
          <span className={styles.paletteHueName}>{hue.name}</span>
          <div className={styles.paletteStrip}>
            {shades.map((shade) => (
              <div
                key={shade}
                className={styles.paletteSwatch}
                style={{ background: `var(--${hue.name}-${shade})` }}
                title={`--${hue.name}-${shade}: ${hue.values[shade]}`}
              >
                <span className={styles.paletteLabel} style={{ color: textColor(shade) }}>
                  {shade}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className={styles.codeBlock} style={{ marginTop: "var(--space-6)" }}>
{`/* パレットの使い方 */
.hero-bg   { background: var(--blue-500); }
.highlight { color: var(--amber-400); }
.soft-bg   { background: var(--violet-50); }
.gradient  { background: linear-gradient(135deg, var(--pink-400), var(--violet-500)); }`}
      </div>

      {/* ── Zinc Scale ─────────────────────────────────────── */}
      <h2 className={styles.sectionTitle}>Zinc Scale（ニュートラル）</h2>
      <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-fg-secondary)", marginBottom: "var(--space-4)" }}>
        Sand-tinted な暖かいグレースケール。セマンティックカラー（bg / fg / border 等）の基盤です。
        11段階（50〜950）。
      </p>
      <div className={styles.tokenGrid}>
        {zincScale.map((c) => (
          <div key={c.name} className={styles.tokenCard}>
            <div className={styles.tokenSwatch} style={{ background: c.css }} />
            <div className={styles.tokenInfo}>
              <div className={styles.tokenName}>{c.name}</div>
              <div className={styles.tokenValue}>{c.hex}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Semantic Colors ────────────────────────────────── */}
      <h2 className={styles.sectionTitle}>セマンティックカラー</h2>
      <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-fg-secondary)", marginBottom: "var(--space-4)" }}>
        用途に基づいたカラートークン。ライト / ダークテーマで自動的に値が切り替わります。
      </p>

      <SemanticSection title="背景色" description="ページやカード、パネルの背景色。" colors={bgColors} />
      <SemanticSection title="前景色（テキスト）" description="テキストやアイコンの色。プライマリ、セカンダリ、ミュートの3段階。" colors={fgColors} />
      <SemanticSection title="ボーダー" description="ボーダーやディバイダーの色。" colors={borderColors} />
      <SemanticSection title="サーフェス" description="カードやドロップダウンなど、浮遊する要素の背景色とホバー・アクティブ状態。" colors={surfaceColors} />
      <SemanticSection title="プライマリ" description="主要アクション（ボタン、リンク）の色。ライトモードは黒、ダークモードは白。" colors={primaryColors} />
      <SemanticSection title="セカンダリ" description="副次的アクションの色。" colors={secondaryColors} />

      {/* ── Status Colors ──────────────────────────────────── */}
      <h2 className={styles.sectionTitle}>ステータスカラー</h2>
      <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-fg-secondary)", marginBottom: "var(--space-4)" }}>
        成功・エラー・警告・情報を表すカラー。パレットから参照しています。
      </p>

      {statusGroups.map((group) => (
        <div key={group.title}>
          <h3 className={styles.subsectionTitle}>
            {group.title}
            <span style={{ fontSize: "var(--font-size-2xs)", color: "var(--color-fg-tertiary)", fontWeight: "var(--font-weight-normal)", marginLeft: "var(--space-2)" }}>
              ← {group.source}
            </span>
          </h3>
          <div className={styles.tokenGrid}>
            {group.colors.map((c) => (
              <div key={c.variable} className={styles.tokenCard}>
                <div className={styles.tokenSwatch} style={{ background: `var(${c.variable})` }} />
                <div className={styles.tokenInfo}>
                  <div className={styles.tokenName}>{c.name}</div>
                  <div className={styles.tokenValue}>{c.variable}</div>
                  <div className={styles.tokenValue}>→ {c.ref}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ── Chart Colors ───────────────────────────────────── */}
      <h2 className={styles.sectionTitle}>チャートカラー</h2>

      <h3 className={styles.subsectionTitle}>名前付きカラー</h3>
      <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-fg-secondary)", marginBottom: "var(--space-4)" }}>
        BarChart / DonutChart / Sparkline で使用。パレットの 500 を参照。
      </p>
      <div className={styles.tokenGrid}>
        {chartColors.map((c) => (
          <div key={c.variable} className={styles.tokenCard}>
            <div className={styles.tokenSwatch} style={{ background: `var(${c.variable})` }} />
            <div className={styles.tokenInfo}>
              <div className={styles.tokenName}>{c.name}</div>
              <div className={styles.tokenValue}>→ {c.ref}</div>
            </div>
          </div>
        ))}
      </div>

      <h3 className={styles.subsectionTitle}>Categorical（12色）</h3>
      <div style={{ display: "flex", gap: "2px", borderRadius: "var(--radius-md)", overflow: "hidden", height: "48px", marginBottom: "var(--space-6)" }}>
        {chartCategorical.map((c) => (
          <div
            key={c.name}
            style={{
              flex: 1,
              background: `var(--${c.ref})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "var(--font-size-2xs)",
              fontWeight: "var(--font-weight-bold)",
              color: "#fff",
            }}
          >
            {c.name}
          </div>
        ))}
      </div>

      {/* ── Focus Ring ─────────────────────────────────────── */}
      <h2 className={styles.sectionTitle}>フォーカスリング</h2>
      <div className={styles.codeBlock}>
        <div style={{ marginBottom: "8px" }}>
          <code className={styles.inlineCode}>--ring-color</code>{" "}
          <span className={styles.tokenValue}>rgba(120, 113, 108, 0.3)</span>
        </div>
        <div style={{ marginBottom: "8px" }}>
          <code className={styles.inlineCode}>--ring-offset</code>{" "}
          <span className={styles.tokenValue}>2px</span>
        </div>
        <div>
          <code className={styles.inlineCode}>--ring-width</code>{" "}
          <span className={styles.tokenValue}>2px</span>
        </div>
      </div>

      {/* ── Token hierarchy ────────────────────────────────── */}
      <h2 className={styles.sectionTitle}>トークン階層</h2>
      <div className={styles.codeBlock}>
{`┌─────────────────────────────────────────────┐
│  Semantic Tokens (テーマ対応)                │
│  --color-bg, --color-fg, --color-positive... │
│  → ライト / ダークで自動切替                │
├─────────────────────────────────────────────┤
│  Palette (12色×10) + Zinc (11段階)          │
│  --blue-500, --red-50, --zinc-200...        │
│  → 固定値、テーマ非依存                     │
└─────────────────────────────────────────────┘

/* 推奨: セマンティックトークンを使う */
.card { background: var(--color-surface); }

/* チャート・装飾にはパレットを直接使う */
.hero { background: var(--blue-500); }

/* ステータスは semantic → palette の参照 */
--color-positive → var(--emerald-500)`}
      </div>
    </div>
  );
}
