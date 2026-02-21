import styles from "./docs.module.css";

const zincColors = [
  { name: "zinc-50", value: "#fafafa" },
  { name: "zinc-100", value: "#f4f4f5" },
  { name: "zinc-200", value: "#e4e4e7" },
  { name: "zinc-300", value: "#d4d4d8" },
  { name: "zinc-400", value: "#a1a1aa" },
  { name: "zinc-500", value: "#71717a" },
  { name: "zinc-600", value: "#52525b" },
  { name: "zinc-700", value: "#3f3f46" },
  { name: "zinc-800", value: "#27272a" },
  { name: "zinc-900", value: "#18181b" },
  { name: "zinc-950", value: "#09090b" },
];

const statusColors = [
  { name: "positive", value: "#10b981" },
  { name: "negative", value: "#ef4444" },
  { name: "warning", value: "#f59e0b" },
  { name: "info", value: "#3b82f6" },
];

const fontSizes = [
  { name: "2xs", value: "11px" },
  { name: "xs", value: "12px" },
  { name: "sm", value: "13px" },
  { name: "base", value: "14px" },
  { name: "md", value: "16px" },
  { name: "lg", value: "18px" },
  { name: "xl", value: "20px" },
  { name: "2xl", value: "24px" },
  { name: "3xl", value: "28px" },
  { name: "4xl", value: "34px" },
  { name: "5xl", value: "40px" },
];

const spacingScale = [
  { name: "--space-1", size: 4 },
  { name: "--space-2", size: 8 },
  { name: "--space-3", size: 12 },
  { name: "--space-4", size: 16 },
  { name: "--space-5", size: 20 },
  { name: "--space-6", size: 24 },
  { name: "--space-8", size: 32 },
  { name: "--space-10", size: 40 },
  { name: "--space-12", size: 48 },
  { name: "--space-16", size: 64 },
  { name: "--space-20", size: 80 },
  { name: "--space-24", size: 96 },
];

const borderRadii = [
  { name: "sm", value: "6px" },
  { name: "md", value: "8px" },
  { name: "lg", value: "10px" },
  { name: "xl", value: "12px" },
  { name: "2xl", value: "16px" },
  { name: "full", value: "9999px" },
];

const shadows = [
  { name: "xs", variable: "var(--shadow-xs)" },
  { name: "sm", variable: "var(--shadow-sm)" },
  { name: "md", variable: "var(--shadow-md)" },
  { name: "lg", variable: "var(--shadow-lg)" },
  { name: "xl", variable: "var(--shadow-xl)" },
];

const durations = [
  { name: "fast", value: "100ms" },
  { name: "normal", value: "150ms" },
  { name: "slow", value: "200ms" },
  { name: "slower", value: "300ms" },
];

const easings = [
  { name: "--ease-default", value: "cubic-bezier(0.4, 0, 0.2, 1)" },
  { name: "--ease-in", value: "cubic-bezier(0.4, 0, 1, 1)" },
  { name: "--ease-out", value: "cubic-bezier(0, 0, 0.2, 1)" },
  { name: "--ease-in-out", value: "cubic-bezier(0.4, 0, 0.2, 1)" },
];

export function TokensPage() {
  return (
    <div>
      <h1 className={styles.pageTitle}>デザイントークン</h1>
      <p className={styles.pageDescription}>
        デザイントークンは、Kaze デザインシステムのビジュアル言語を定義する基盤となる値です。
        すべてのコンポーネントと画面で一貫性を保つために使用されます。
      </p>

      {/* ---- Color: Zinc Scale ---- */}
      <h2 className={styles.sectionTitle}>カラー: Zinc スケール</h2>
      <div className={styles.tokenGrid}>
        {zincColors.map((color) => (
          <div key={color.name} className={styles.tokenCard}>
            <div
              className={styles.tokenSwatch}
              style={{ background: `var(--${color.name})` }}
            />
            <div className={styles.tokenInfo}>
              <div className={styles.tokenName}>{color.name}</div>
              <div className={styles.tokenValue}>{color.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Status Colors ---- */}
      <h2 className={styles.sectionTitle}>ステータスカラー</h2>
      <div className={styles.tokenGrid}>
        {statusColors.map((color) => (
          <div key={color.name} className={styles.tokenCard}>
            <div
              className={styles.tokenSwatch}
              style={{ background: color.value }}
            />
            <div className={styles.tokenInfo}>
              <div className={styles.tokenName}>{color.name}</div>
              <div className={styles.tokenValue}>{color.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Typography ---- */}
      <h2 className={styles.sectionTitle}>タイポグラフィ</h2>

      <h3 className={styles.subsectionTitle}>フォントスタック</h3>
      <div className={styles.codeBlock}>
        <div>
          <strong className={styles.tokenName}>--font-sans</strong>
          <br />
          <code className={styles.inlineCode}>var(--font-sans)</code>
          <p style={{ fontFamily: "var(--font-sans)", marginTop: "8px" }}>
            風のように軽やかなデザインシステム Kaze
          </p>
        </div>
        <div style={{ marginTop: "16px" }}>
          <strong className={styles.tokenName}>--font-mono</strong>
          <br />
          <code className={styles.inlineCode}>var(--font-mono)</code>
          <p style={{ fontFamily: "var(--font-mono)", marginTop: "8px" }}>
            風のように軽やかなデザインシステム Kaze
          </p>
        </div>
      </div>

      <h3 className={styles.subsectionTitle}>フォントサイズ</h3>
      <div>
        {fontSizes.map((fs) => (
          <div
            key={fs.name}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "16px",
              marginBottom: "12px",
            }}
          >
            <span
              className={styles.tokenName}
              style={{ minWidth: "80px", flexShrink: 0 }}
            >
              {fs.name}{" "}
              <span className={styles.tokenValue}>({fs.value})</span>
            </span>
            <span style={{ fontSize: fs.value, lineHeight: 1.4 }}>
              風のように軽やかな
            </span>
          </div>
        ))}
      </div>

      {/* ---- Spacing ---- */}
      <h2 className={styles.sectionTitle}>スペーシング</h2>
      <div>
        {spacingScale.map((space) => (
          <div key={space.name} className={styles.spacingRow}>
            <span className={styles.spacingLabel}>
              {space.name} ({space.size}px)
            </span>
            <div
              className={styles.spacingBar}
              style={{ width: `${space.size}px` }}
            />
          </div>
        ))}
      </div>

      {/* ---- Border Radius ---- */}
      <h2 className={styles.sectionTitle}>角丸</h2>
      <div className={styles.tokenGrid}>
        {borderRadii.map((radius) => (
          <div key={radius.name} className={styles.tokenCard}>
            <div
              className={styles.tokenSwatch}
              style={{
                background: "var(--zinc-200)",
                borderRadius: radius.value,
                border: "2px solid var(--zinc-400)",
              }}
            />
            <div className={styles.tokenInfo}>
              <div className={styles.tokenName}>radius-{radius.name}</div>
              <div className={styles.tokenValue}>{radius.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Shadows ---- */}
      <h2 className={styles.sectionTitle}>シャドウ</h2>
      <div className={styles.shadowGrid}>
        {shadows.map((shadow) => (
          <div
            key={shadow.name}
            className={styles.shadowCard}
            style={{ boxShadow: shadow.variable }}
          >
            <div className={styles.tokenName}>shadow-{shadow.name}</div>
            <div className={styles.tokenValue}>{shadow.variable}</div>
          </div>
        ))}
      </div>

      {/* ---- Transitions ---- */}
      <h2 className={styles.sectionTitle}>トランジション</h2>

      <h3 className={styles.subsectionTitle}>持続時間</h3>
      <div className={styles.codeBlock}>
        {durations.map((dur) => (
          <div key={dur.name} style={{ marginBottom: "8px" }}>
            <code className={styles.inlineCode}>--duration-{dur.name}</code>{" "}
            <span className={styles.tokenValue}>{dur.value}</span>
          </div>
        ))}
      </div>

      <h3 className={styles.subsectionTitle}>イージング</h3>
      <div className={styles.codeBlock}>
        {easings.map((ease) => (
          <div key={ease.name} style={{ marginBottom: "8px" }}>
            <code className={styles.inlineCode}>{ease.name}</code>{" "}
            <span className={styles.tokenValue}>{ease.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
