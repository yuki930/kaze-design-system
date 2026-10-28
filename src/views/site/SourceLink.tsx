"use client";

import { usePathname } from "next/navigation";
import { REPO_URL, repoFileUrl, SAMPLE_SOURCES } from "./repo";
import styles from "./SourceLink.module.css";

/** Floating "view source" link shown on every sample page. */
export function SourceLink() {
  const pathname = usePathname();
  const source = SAMPLE_SOURCES[pathname];
  if (!source) return null;

  return (
    <nav className={styles.sourceLink} aria-label="ソースコード">
      <a href={repoFileUrl(source)} target="_blank" rel="noreferrer" className={styles.link}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m16 18 6-6-6-6" />
          <path d="m8 6-6 6 6 6" />
        </svg>
        このページのソース
      </a>
      <a href={REPO_URL} target="_blank" rel="noreferrer" className={styles.link}>
        GitHub
      </a>
    </nav>
  );
}
