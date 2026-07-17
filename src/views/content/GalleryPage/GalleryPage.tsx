import { useState } from "react";
import {
  Navbar,
  NavbarLinks,
  NavbarLink,
  Button,
  Badge,
  Card,
  CardBody,
  Tabs,
  Tab,
  Logo,
  LPFooter,
  Hero,
  Grid,
  Text,
  FAB,
} from "@/components";
import { useTheme } from "@/hooks";
import { Moon, Sun } from "lucide-react";
import styles from "./GalleryPage.module.css";

/* ── Types ────────────────────────────────────────────────── */

type Category = "すべて" | "ダッシュボード" | "アプリ" | "コンテンツ";

interface GalleryItem {
  id: number;
  title: string;
  pageHref: string;
  author: string;
  category: Exclude<Category, "すべて">;
  image: string;
  theme: "light" | "dark";
}

/* ── Data ─────────────────────────────────────────────────────
   kaze-design-system で実装したデモページのスクリーンショット集。
   dev サーバー (npm run dev) 上で各ページを light / dark 両テーマで
   実際にキャプチャし、public/gallery/ に webp で保存したもの。
   ------------------------------------------------------------ */

const categories: Category[] = ["すべて", "ダッシュボード", "アプリ", "コンテンツ"];

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "ダッシュボード",
    pageHref: "/dashboard",
    author: "相楽 実咲",
    category: "ダッシュボード",
    image: "/gallery/dashboard-light.webp",
    theme: "light",
  },
  {
    id: 2,
    title: "EC管理画面",
    pageHref: "/ec-dashboard",
    author: "堀内 昌平",
    category: "ダッシュボード",
    image: "/gallery/ec-dashboard-dark.webp",
    theme: "dark",
  },
  {
    id: 3,
    title: "アナリティクス",
    pageHref: "/analytics",
    author: "宮田 千夏",
    category: "ダッシュボード",
    image: "/gallery/analytics-light.webp",
    theme: "light",
  },
  {
    id: 4,
    title: "プロジェクト管理",
    pageHref: "/projects",
    author: "呉羽 直樹",
    category: "ダッシュボード",
    image: "/gallery/projects-dark.webp",
    theme: "dark",
  },
  {
    id: 5,
    title: "設定",
    pageHref: "/settings",
    author: "桐生 あかね",
    category: "ダッシュボード",
    image: "/gallery/settings-dark.webp",
    theme: "dark",
  },
  {
    id: 6,
    title: "ヘルプセンター",
    pageHref: "/help",
    author: "野々村 圭",
    category: "ダッシュボード",
    image: "/gallery/help-dark.webp",
    theme: "dark",
  },
  {
    id: 7,
    title: "ログイン",
    pageHref: "/login",
    author: "早瀬 遼平",
    category: "アプリ",
    image: "/gallery/login-light.webp",
    theme: "light",
  },
  {
    id: 8,
    title: "Todoアプリ",
    pageHref: "/todo",
    author: "志摩 このみ",
    category: "アプリ",
    image: "/gallery/todo-dark.webp",
    theme: "dark",
  },
  {
    id: 9,
    title: "お買い物リスト",
    pageHref: "/shopping",
    author: "三隅 拓海",
    category: "アプリ",
    image: "/gallery/shopping-light.webp",
    theme: "light",
  },
  {
    id: 10,
    title: "求人検索",
    pageHref: "/jobs",
    author: "綿貫 玲奈",
    category: "アプリ",
    image: "/gallery/jobs-dark.webp",
    theme: "dark",
  },
  {
    id: 11,
    title: "ブログ一覧",
    pageHref: "/blog",
    author: "大迫 航",
    category: "コンテンツ",
    image: "/gallery/blog-light.webp",
    theme: "light",
  },
  {
    id: 12,
    title: "デザイントークン",
    pageHref: "/docs/tokens",
    author: "藤枝 蒼",
    category: "コンテンツ",
    image: "/gallery/docs-tokens-light.webp",
    theme: "light",
  },
];

/* ── Gallery Page ─────────────────────────────────────────── */

export function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("すべて");
  const { resolvedTheme, toggleTheme } = useTheme();

  const filtered =
    activeCategory === "すべて"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* Navbar */}
      <Navbar
        logo={<Logo size="md" />}
        actions={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              onClick={toggleTheme}
              aria-label="テーマ切替"
            >
              {resolvedTheme === "light" ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}
            </Button>
            <a href="/docs">
              <Button size="sm">ドキュメント</Button>
            </a>
          </div>
        }
      >
        <NavbarLinks>
          <NavbarLink href="/gallery" active>
            ギャラリー
          </NavbarLink>
          <NavbarLink href="/">サンプル集</NavbarLink>
          <NavbarLink href="/docs">ドキュメント</NavbarLink>
        </NavbarLinks>
      </Navbar>

      {/* Hero */}
      <Hero
        title="デモページギャラリー"
        subtitle="Kaze で実装したデモページのスクリーンショット集です。ダッシュボードからアプリ、ドキュメントまで、light / dark 両テーマでの見え方をまとめています。"
      />

      {/* Category Filter */}
      <div className={styles.filterBar}>
        <Tabs variant="pills">
          {categories.map((cat) => (
            <Tab
              key={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Tab>
          ))}
        </Tabs>
      </div>

      {/* Gallery Grid */}
      <div className={styles.galleryGridWrapper}>
        <Grid columns={3} columnsMd={2} columnsSm={1} gap="var(--space-4)">
          {filtered.map((item) => (
            <a key={item.id} href={item.pageHref} className={styles.galleryLink}>
              <Card variant="interactive">
                <div className={styles.galleryImageWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={`${item.title}ページのスクリーンショット（${item.theme === "light" ? "ライト" : "ダーク"}テーマ）`}
                    className={styles.galleryImage}
                    loading="lazy"
                    width={800}
                    height={500}
                  />
                  <span className={styles.themeTag}>
                    {item.theme === "light" ? "Light" : "Dark"}
                  </span>
                </div>
                <CardBody>
                  <div className={styles.galleryMeta}>
                    <div>
                      <Text as="div" size="sm" weight="semibold">{item.title}</Text>
                      <Text as="div" variant="caption">撮影: {item.author}</Text>
                    </div>
                    <Badge variant="default">{item.category}</Badge>
                  </div>
                </CardBody>
              </Card>
            </a>
          ))}
        </Grid>
      </div>

      {/* CTA */}
      <div className={styles.ctaWrapper}>
        <a href="/">
          <Button variant="outline" size="lg">
            サンプル集をもっと見る
          </Button>
        </a>
      </div>

      {/* Footer */}
      <LPFooter
        logo={<Logo size="sm" />}
        description="kaze-design-system で組んだ画面をまとめたスクリーンショットギャラリーです。"
        columns={[
          {
            title: "カテゴリ",
            links: [
              { label: "ダッシュボード", href: "#" },
              { label: "アプリ", href: "#" },
              { label: "コンテンツ", href: "#" },
            ],
          },
          {
            title: "リソース",
            links: [
              { label: "ドキュメント", href: "/docs" },
              { label: "サンプル集", href: "/showcase" },
              { label: "デザイントークン", href: "/docs/tokens" },
              { label: "GitHub", href: "https://github.com/yuki930/kaze-design-system" },
            ],
          },
          {
            title: "情報",
            links: [
              { label: "会社概要", href: "#" },
              { label: "プライバシーポリシー", href: "#" },
              { label: "利用規約", href: "#" },
            ],
          },
        ]}
        bottomLeft={
          <span>
            &copy; {new Date().getFullYear()} Kaze Design System. All rights reserved.
          </span>
        }
      />

      {/* Floating Theme Toggle */}
      <FAB
        label="テーマ切替"
        variant="secondary"
        size="sm"
        onClick={toggleTheme}
        aria-label="テーマ切替"
      >
        {resolvedTheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </FAB>
    </div>
  );
}
