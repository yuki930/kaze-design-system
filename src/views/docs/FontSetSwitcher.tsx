"use client";

import { SegmentedControl } from "@/components";
import { type FontSet, useTheme } from "@/hooks";
import styles from "./docs.module.css";

const options: { value: FontSet; label: string }[] = [
  { value: "standard", label: "標準" },
  { value: "neutral", label: "ニュートラル" },
  { value: "crisp", label: "硬質" },
];

/** Switches the whole docs site between the Kaze font sets. */
export function FontSetSwitcher() {
  const { fontSet, setFontSet } = useTheme();
  return (
    <div className={styles.paletteSwitcher}>
      <SegmentedControl
        aria-label="書体"
        value={fontSet}
        onValueChange={(v) => setFontSet(v as FontSet)}
        options={options}
      />
      <pre className={styles.codeBlock}>
        {fontSet === "standard" ? "<html>" : `<html data-font="${fontSet}">`}
      </pre>
    </div>
  );
}
