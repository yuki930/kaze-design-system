"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu, Search as SearchIcon } from "lucide-react";
import { useTheme } from "@/hooks";
import { Logo } from "@/components/Logo";
import {
  Button,
  type Command,
  CommandPalette,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerTitle,
} from "@/components";
import styles from "@/views/docs/docs.module.css";
import { NPM_URL, REPO_URL } from "@/views/site/repo";
import { categories } from "@/views/docs/ComponentsOverview";

interface NavItem {
  href: string;
  label: string;
  exact?: boolean;
  /** Extra search terms for the docs search */
  keywords?: string[];
}

const componentSections = categories.map((category) => ({
  title: category.title,
  items: category.components.map(
    (c): NavItem => ({
      href: `/docs/components/${c.path}`,
      label: c.name,
      keywords: [c.path, c.description],
    }),
  ),
}));

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "はじめに",
    items: [
      {
        href: "/docs",
        label: "はじめに",
        exact: true,
        keywords: ["getting started", "インストール"],
      },
      {
        href: "/docs/tokens",
        label: "デザイントークン",
        keywords: ["tokens", "余白", "角丸", "フォント"],
      },
      { href: "/docs/colors", label: "カラー", keywords: ["colors", "色", "パレット", "チャート"] },
    ],
  },
  {
    title: "コンポーネント",
    items: [
      {
        href: "/docs/components",
        label: "コンポーネント一覧",
        exact: true,
        keywords: ["components"],
      },
    ],
  },
  ...componentSections,
  {
    title: "ユーティリティ",
    items: [
      { href: "/docs/utilities", label: "CSS ユーティリティ", keywords: ["utilities", "クラス"] },
    ],
  },
];

export default function DocsLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // ⌘K on Apple platforms, Ctrl K elsewhere. Read after mount so SSR and hydration agree.
  const [shortcut, setShortcut] = useState("Ctrl K");

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) setShortcut("⌘K");
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" && !e.isComposing) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Close the mobile menu once a link has taken the reader to another page
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger, not a value used inside
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const commands = useMemo<Command[]>(
    () =>
      navSections.flatMap((section) =>
        section.items.map((item) => ({
          id: item.href,
          label: item.label,
          group: section.title,
          keywords: item.keywords,
          onSelect: () => router.push(item.href),
        })),
      ),
    [router],
  );

  const nav = (
    <nav className={styles.nav} aria-label="ドキュメント">
      {navSections.map((section) => (
        <div key={section.title} className={styles.navSection}>
          <h3 className={styles.navTitle}>{section.title}</h3>
          <ul className={styles.navList}>
            {section.items.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const footer = (
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
        <a href="/storybook/index.html" className={styles.externalLink}>
          Storybook
        </a>
      </div>
    </div>
  );

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Logo />
          <span className={styles.version}>v{process.env.NEXT_PUBLIC_KAZE_VERSION}</span>
        </div>
        <div className={styles.searchRow}>
          <button
            type="button"
            className={styles.searchTrigger}
            onClick={() => setSearchOpen(true)}
            aria-haspopup="dialog"
          >
            <SearchIcon size={14} aria-hidden="true" />
            <span>検索</span>
            <kbd className={styles.searchKbd}>{shortcut}</kbd>
          </button>
        </div>
        {nav}
        {footer}
      </aside>

      <main className={styles.main}>
        <header className={styles.mobileBar}>
          <Logo />
          <div className={styles.mobileBarActions}>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label="検索"
              aria-haspopup="dialog"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon size={18} aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label="メニュー"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={18} aria-hidden="true" />
            </Button>
          </div>
        </header>
        <div className={styles.content}>{children}</div>
      </main>

      <Drawer open={menuOpen} onOpenChange={setMenuOpen} side="left" size="sm">
        <DrawerHeader>
          <DrawerTitle>メニュー</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className={styles.drawerNav}>
          {nav}
          {footer}
        </DrawerBody>
      </Drawer>

      <CommandPalette
        open={searchOpen}
        onOpenChange={setSearchOpen}
        commands={commands}
        label="ドキュメント検索"
        searchLabel="ドキュメントを検索"
        placeholder="コンポーネント名や用途で検索（例: 日付、タブ、チャート）"
        emptyMessage="該当するページがありません"
      />
    </div>
  );
}
