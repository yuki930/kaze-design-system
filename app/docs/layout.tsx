"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/hooks";
import { Logo } from "@/components/Logo";
import styles from "@/views/docs/docs.module.css";

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
    items: [
      { href: "/docs/components", label: "コンポーネント", exact: true },
      { href: "/docs/components/button", label: "Button" },
      { href: "/docs/components/fab", label: "FAB" },
      { href: "/docs/components/input", label: "Input" },
      { href: "/docs/components/select", label: "Select" },
      { href: "/docs/components/number-field", label: "NumberField" },
      { href: "/docs/components/checkbox", label: "Checkbox" },
      { href: "/docs/components/radio", label: "Radio" },
      { href: "/docs/components/textarea", label: "Textarea" },
      { href: "/docs/components/card", label: "Card" },
      { href: "/docs/components/badge", label: "Badge" },
      { href: "/docs/components/table", label: "Table" },
      { href: "/docs/components/tabs", label: "Tabs" },
      { href: "/docs/components/avatar", label: "Avatar" },
      { href: "/docs/components/metric", label: "Metric" },
      { href: "/docs/components/watermark", label: "Watermark" },
      { href: "/docs/components/dialog", label: "Dialog" },
      { href: "/docs/components/tooltip", label: "Tooltip" },
      { href: "/docs/components/dropdown", label: "Dropdown" },
      { href: "/docs/components/toast", label: "Toast" },
      { href: "/docs/components/form-field", label: "FormField" },
      { href: "/docs/components/icon", label: "Icon" },
      { href: "/docs/components/sidebar", label: "Sidebar" },
      { href: "/docs/components/topbar", label: "TopBar" },
      { href: "/docs/components/command-palette", label: "CommandPalette" },
      { href: "/docs/components/layout", label: "AppLayout" },
      { href: "/docs/components/divider", label: "Divider" },
      { href: "/docs/components/search", label: "Search" },
      { href: "/docs/components/logo", label: "Logo" },
      { href: "/docs/components/heading", label: "Heading" },
      { href: "/docs/components/text", label: "Text" },
      { href: "/docs/components/grid", label: "Grid" },
      { href: "/docs/components/list", label: "List" },
      { href: "/docs/components/description-list", label: "DescriptionList" },
      { href: "/docs/components/timeline", label: "Timeline" },
      { href: "/docs/components/bar-chart", label: "BarChart" },
      { href: "/docs/components/donut-chart", label: "DonutChart" },
      { href: "/docs/components/sparkline", label: "Sparkline" },
      { href: "/docs/components/alert", label: "Alert" },
      { href: "/docs/components/progress", label: "Progress" },
      { href: "/docs/components/meter", label: "Meter" },
      { href: "/docs/components/tracker", label: "Tracker" },
      { href: "/docs/components/bar-list", label: "BarList" },
      { href: "/docs/components/switch", label: "Switch" },
      { href: "/docs/components/skeleton", label: "Skeleton" },
      { href: "/docs/components/empty-state", label: "EmptyState" },
      { href: "/docs/components/breadcrumb", label: "Breadcrumb" },
      { href: "/docs/components/pagination", label: "Pagination" },
      { href: "/docs/components/stepper", label: "Stepper" },
    ],
  },
  {
    title: "ユーティリティ",
    items: [{ href: "/docs/utilities", label: "CSS ユーティリティ" }],
  },
  {
    title: "ランディングページ",
    items: [
      { href: "/docs/components/navbar", label: "Navbar" },
      { href: "/docs/components/hero", label: "Hero" },
      { href: "/docs/components/section", label: "Section" },
      { href: "/docs/components/split-section", label: "SplitSection" },
      { href: "/docs/components/feature-grid", label: "FeatureGrid" },
      { href: "/docs/components/stats", label: "Stats" },
      { href: "/docs/components/pricing", label: "Pricing" },
      { href: "/docs/components/testimonial", label: "Testimonial" },
      { href: "/docs/components/faq", label: "FAQ" },
      { href: "/docs/components/cta-banner", label: "CTABanner" },
      { href: "/docs/components/lp-footer", label: "LPFooter" },
    ],
  },
];

export default function DocsLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Logo />
          <span className={styles.version}>v0.1.0</span>
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
            className={styles.themeToggle}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "ライトモード" : "ダークモード"}
          </button>
          <Link href="/" className={styles.navLink}>
            サンプル集
          </Link>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
