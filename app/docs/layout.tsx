"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/hooks";
import { Logo } from "@/components/Logo";
import styles from "@/views/docs/docs.module.css";
import { NPM_URL, REPO_URL } from "@/views/site/repo";
import { categories } from "@/views/docs/ComponentsOverview";

const componentSections = categories.map((category) => ({
  title: category.title,
  items: category.components.map((c) => ({
    href: `/docs/components/${c.path}`,
    label: c.name,
  })),
}));

const navSections = [
  {
    title: "はじめに",
    items: [
      { href: "/docs", label: "はじめに", exact: true },
      { href: "/docs/tokens", label: "デザイントークン" },
      { href: "/docs/colors", label: "カラー" },
    ],
  },
  {
    title: "コンポーネント",
    items: [{ href: "/docs/components", label: "コンポーネント一覧", exact: true }],
  },
  ...componentSections,
  {
    title: "ユーティリティ",
    items: [{ href: "/docs/utilities", label: "CSS ユーティリティ" }],
  },
];

export default function DocsLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Logo />
          <span className={styles.version}>v{process.env.NEXT_PUBLIC_KAZE_VERSION}</span>
        </div>

        <nav className={styles.nav}>
          {navSections.map((section) => (
            <div key={section.title} className={styles.navSection}>
              <h3 className={styles.navTitle}>{section.title}</h3>
              <ul className={styles.navList}>
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${
                        isActive(item.href, "exact" in item ? item.exact : undefined)
                          ? styles.navLinkActive
                          : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            type="button"
            className={styles.themeToggle}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "ライトモード" : "ダークモード"}
          </button>
          <Link href="/" className={styles.navLink}>
            サンプル集
          </Link>
          <div className={styles.externalLinks}>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className={styles.externalLink}>
              GitHub
            </a>
            <a href={NPM_URL} target="_blank" rel="noreferrer" className={styles.externalLink}>
              npm
            </a>
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
