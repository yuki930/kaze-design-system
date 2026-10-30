"use client";

import { SegmentedControl } from "@/components";
import { type Palette, useTheme } from "@/hooks";
import styles from "./docs.module.css";

interface Option {
  value: Palette;
  label: string;
  description: string;
}

const WARM: Option = {
  value: "warm",
  label: "砂",
  description: "温かみのあるグレー。主ボタンは墨の黒。既定",
};

const options: Option[] = [
  WARM,
  { value: "cool", label: "霞", description: "青紫を含んだ涼しいグレー" },
  { value: "ink", label: "墨", description: "色味のない灰色と黒だけ。いちばん静か" },
  { value: "indigo", label: "藍", description: "青みのグレーに藍色。主ボタンとリンクが藍になる" },
];

/** Switches the whole docs site between the Kaze palettes, so the reader sees each one live. */
export function PaletteSwitcher() {
  const { palette, setPalette } = useTheme();
  const current = options.find((o) => o.value === palette) ?? WARM;
  return (
    <div className={styles.paletteSwitcher}>
      <SegmentedControl
        aria-label="色"
        value={palette}
        onValueChange={(v) => setPalette(v as Palette)}
        options={options.map(({ value, label }) => ({ value, label }))}
      />
      <p className={styles.tableNote}>{current.description}</p>
      <pre className={styles.codeBlock}>
        {current.value === "warm" ? "<html>" : `<html data-palette="${current.value}">`}
      </pre>
      {current.value === "warm" && (
        <p className={styles.tableNote}>砂は既定なので、属性を付けなくても使えます。</p>
      )}
    </div>
  );
}
