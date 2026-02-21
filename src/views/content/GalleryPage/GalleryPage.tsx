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

type Category = "すべて" | "風景" | "建築" | "ポートレート" | "抽象";

interface GalleryItem {
  id: number;
  title: string;
  author: string;
  category: Exclude<Category, "すべて">;
  gradient: string;
}

/* ── Data ─────────────────────────────────────────────────── */

const categories: Category[] = [
  "すべて",
  "風景",
  "建築",
  "ポートレート",
  "抽象",
];

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "朝霧の湖畔",
    author: "山田 太郎",
    category: "風景",
    gradient: "linear-gradient(135deg, var(--blue-400) 0%, var(--violet-500) 100%)",
  },
  {
    id: 2,
    title: "東京タワーの夜景",
    author: "佐藤 花子",
    category: "建築",
    gradient: "linear-gradient(135deg, var(--pink-400) 0%, var(--red-400) 100%)",
  },
  {
    id: 3,
    title: "光と影のポートレート",
    author: "鈴木 一郎",
    category: "ポートレート",
    gradient: "linear-gradient(135deg, var(--cyan-300) 0%, var(--blue-400) 100%)",
  },
  {
    id: 4,
    title: "幾何学模様",
    author: "田中 美咲",
    category: "抽象",
    gradient: "linear-gradient(135deg, var(--emerald-400) 0%, var(--teal-300) 100%)",
  },
  {
    id: 5,
    title: "富士山と桜",
    author: "高橋 大輔",
    category: "風景",
    gradient: "linear-gradient(135deg, var(--orange-400) 0%, var(--amber-300) 100%)",
  },
  {
    id: 6,
    title: "コンクリートと空",
    author: "渡辺 裕子",
    category: "建築",
    gradient: "linear-gradient(135deg, var(--violet-300) 0%, var(--pink-200) 100%)",
  },
  {
    id: 7,
    title: "窓辺の横顔",
    author: "伊藤 健太",
    category: "ポートレート",
    gradient: "linear-gradient(135deg, var(--amber-100) 0%, var(--orange-200) 100%)",
  },
  {
    id: 8,
    title: "流れるインク",
    author: "中村 あい",
    category: "抽象",
    gradient: "linear-gradient(135deg, var(--cyan-200) 0%, var(--blue-400) 100%)",
  },
  {
    id: 9,
    title: "棚田の夕暮れ",
    author: "小林 誠",
    category: "風景",
    gradient: "linear-gradient(135deg, var(--pink-200) 0%, var(--violet-100) 100%)",
  },
  {
    id: 10,
    title: "ガラスの反射",
    author: "加藤 真理",
    category: "建築",
    gradient: "linear-gradient(135deg, var(--lime-300) 0%, var(--green-300) 100%)",
  },
  {
    id: 11,
    title: "モノクロームの瞳",
    author: "松本 翔",
    category: "ポートレート",
    gradient: "linear-gradient(135deg, var(--zinc-200) 0%, var(--zinc-300) 100%)",
  },
  {
    id: 12,
    title: "波紋のリズム",
    author: "吉田 優",
    category: "抽象",
    gradient: "linear-gradient(135deg, var(--yellow-100) 0%, var(--amber-200) 100%)",
  },
];

function categoryVariant(
  category: GalleryItem["category"]
): "info" | "positive" | "warning" | "negative" {
  switch (category) {
    case "風景":
      return "positive";
    case "建築":
      return "info";
    case "ポートレート":
      return "warning";
    case "抽象":
      return "negative";
  }
}

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
            <Button size="sm">お問い合わせ</Button>
          </div>
        }
      >
        <NavbarLinks>
          <NavbarLink href="/gallery" active>
            作品集
          </NavbarLink>
          <NavbarLink href="#">About</NavbarLink>
          <NavbarLink href="#">Contact</NavbarLink>
        </NavbarLinks>
      </Navbar>

      {/* Hero */}
      <Hero
        title="Gallery"
        subtitle="日本の美しさを切り取った写真コレクション。風景、建築、ポートレート、抽象アートまで幅広く展示しています。"
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
            <Card key={item.id} variant="interactive">
              <div
                className={styles.galleryImage}
                style={{ background: item.gradient }}
              />
              <CardBody>
                <div className={styles.galleryMeta}>
                  <div>
                    <Text as="div" size="sm" weight="semibold">{item.title}</Text>
                    <Text as="div" variant="caption">{item.author}</Text>
                  </div>
                  <Badge variant={categoryVariant(item.category)}>
                    {item.category}
                  </Badge>
                </div>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </div>

      {/* CTA */}
      <div className={styles.ctaWrapper}>
        <Button variant="outline" size="lg">
          もっと見る
        </Button>
      </div>

      {/* Footer */}
      <LPFooter
        logo={<Logo size="sm" />}
        description="写真を通じて、日本の美しさを世界に届けるギャラリーサイトです。"
        columns={[
          {
            title: "ギャラリー",
            links: [
              { label: "風景", href: "#" },
              { label: "建築", href: "#" },
              { label: "ポートレート", href: "#" },
              { label: "抽象", href: "#" },
            ],
          },
          {
            title: "情報",
            links: [
              { label: "About", href: "#" },
              { label: "Contact", href: "#" },
              { label: "プライバシーポリシー", href: "#" },
              { label: "利用規約", href: "#" },
            ],
          },
          {
            title: "SNS",
            links: [
              { label: "Instagram", href: "#" },
              { label: "Twitter", href: "#" },
              { label: "Behance", href: "#" },
              { label: "Dribbble", href: "#" },
            ],
          },
        ]}
        bottomLeft={
          <span>
            &copy; {new Date().getFullYear()} Kaze Gallery. All rights reserved.
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
