import { useState } from "react";
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  Logo,
  Navbar,
  NavbarLinks,
  NavbarLink,
  Hero,
  Section,
  SectionHeader,
  FeatureGrid,
  FeatureCard,
  CTABanner,
  Heading,
  LPFooter,
  FAB,
  Text,
} from "@/components";
import { DonutChart } from "@/components/DonutChart/DonutChart";
import { useTheme } from "@/hooks";
import {
  Zap,
  Palette,
  Moon,
  ArrowRight,
  Github,
  Layers,
  Boxes,
  Droplets,
  LayoutGrid,
  FormInput,
  Table2,
  Compass,
  MessageSquare,
  BarChart3,
  Megaphone,
  Wrench,
  PieChart,
  Rocket,
  PenLine,
  BookOpen,
  Coins,
  Settings,
  Lock,
  AlertTriangle,
  TrendingUp,
  ClipboardList,
  ShoppingCart,
  Image,
  Mountain,
  CheckSquare,
  ShoppingBag,
  Briefcase,
  HelpCircle,
  Package,
  PartyPopper,
  Newspaper,
} from "lucide-react";
import styles from "./ShowcasePage.module.css";

/* ── Data ──────────────────────────────────────────────────────── */

interface SamplePage {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  category: string;
  categoryVariant: "default" | "positive" | "info" | "warning" | "negative";
}

const samplePages: SamplePage[] = [
  {
    title: "ダッシュボード",
    description: "SaaS管理画面 — データ可視化、チャート、主要指標の一覧",
    href: "/dashboard",
    icon: <PieChart size={20} />,
    category: "SaaS",
    categoryVariant: "info",
  },
  {
    title: "ランディングページ",
    description: "プロダクト紹介 — ヒーロー、料金、よくある質問",
    href: "/lp",
    icon: <Rocket size={20} />,
    category: "マーケティング",
    categoryVariant: "positive",
  },
  {
    title: "記事ページ",
    description: "ブログ記事 — 本文、目次、著者情報",
    href: "/article",
    icon: <PenLine size={20} />,
    category: "コンテンツ",
    categoryVariant: "warning",
  },
  {
    title: "ブログ一覧",
    description: "記事の一覧表示 — タグ、ページ送り",
    href: "/blog",
    icon: <BookOpen size={20} />,
    category: "コンテンツ",
    categoryVariant: "warning",
  },
  {
    title: "料金プラン",
    description: "プラン比較 — 機能一覧、よくある質問",
    href: "/pricing",
    icon: <Coins size={20} />,
    category: "マーケティング",
    categoryVariant: "positive",
  },
  {
    title: "設定",
    description: "ユーザー設定 — プロフィール、通知、プラン管理",
    href: "/settings",
    icon: <Settings size={20} />,
    category: "SaaS",
    categoryVariant: "info",
  },
  {
    title: "ログイン",
    description: "認証画面 — ログインフォーム、外部認証",
    href: "/login",
    icon: <Lock size={20} />,
    category: "認証",
    categoryVariant: "negative",
  },
  {
    title: "404エラー",
    description: "エラーページ — ページが見つかりません",
    href: "/404",
    icon: <AlertTriangle size={20} />,
    category: "システム",
    categoryVariant: "default",
  },
  {
    title: "アナリティクス",
    description: "アクセス分析 — PV、セッション、コンバージョン",
    href: "/analytics",
    icon: <TrendingUp size={20} />,
    category: "SaaS",
    categoryVariant: "info",
  },
  {
    title: "プロジェクト管理",
    description: "タスク管理 — 進捗、チーム稼働、マイルストーン",
    href: "/projects",
    icon: <ClipboardList size={20} />,
    category: "SaaS",
    categoryVariant: "info",
  },
  {
    title: "EC管理画面",
    description: "コマース管理 — 注文、売上、在庫、顧客",
    href: "/ec-dashboard",
    icon: <ShoppingCart size={20} />,
    category: "コマース",
    categoryVariant: "positive",
  },
  {
    title: "ギャラリー",
    description: "写真一覧 — カテゴリ絞り込み、グリッド表示",
    href: "/gallery",
    icon: <Image size={20} />,
    category: "コンテンツ",
    categoryVariant: "warning",
  },
  {
    title: "画像ランディングページ",
    description: "ビジュアル重視の紹介ページ — 全幅ヒーロー、交互レイアウト",
    href: "/lp2",
    icon: <Mountain size={20} />,
    category: "マーケティング",
    categoryVariant: "positive",
  },
  {
    title: "Todoアプリ",
    description: "タスク管理 — フィルター、優先度、進捗表示",
    href: "/todo",
    icon: <CheckSquare size={20} />,
    category: "SaaS",
    categoryVariant: "info",
  },
  {
    title: "お買い物リスト",
    description: "買い物メモ — カテゴリ別、数量管理、予算表示",
    href: "/shopping",
    icon: <ShoppingBag size={20} />,
    category: "アプリ",
    categoryVariant: "positive",
  },
  {
    title: "求人検索",
    description: "求人検索結果 — カテゴリ別、保存・応募、検索フィルター",
    href: "/jobs",
    icon: <Briefcase size={20} />,
    category: "アプリ",
    categoryVariant: "positive",
  },
  {
    title: "SaaS統計",
    description: "統計セクション — ドーナツチャート、数値カード、背景色切替",
    href: "/saas-stats",
    icon: <BarChart3 size={20} />,
    category: "マーケティング",
    categoryVariant: "positive",
  },
  {
    title: "ヘルプセンター",
    description: "サポートページ — 検索、カテゴリ、人気記事、問い合わせ",
    href: "/help",
    icon: <HelpCircle size={20} />,
    category: "SaaS",
    categoryVariant: "info",
  },
  {
    title: "注文確認メール",
    description: "HTMLメール — 注文明細、お届け先、合計金額",
    href: "/examples/email-order-confirmation.html",
    icon: <Package size={20} />,
    category: "メール",
    categoryVariant: "warning",
  },
  {
    title: "ウェルカムメール",
    description: "HTMLメール — 会員登録完了、クーポン、ガイド",
    href: "/examples/email-welcome.html",
    icon: <PartyPopper size={20} />,
    category: "メール",
    categoryVariant: "warning",
  },
  {
    title: "ニュースレター",
    description: "HTMLメール — 特集記事、おすすめ商品、SNSリンク",
    href: "/examples/email-newsletter.html",
    icon: <Newspaper size={20} />,
    category: "メール",
    categoryVariant: "warning",
  },
];

interface ComponentCategory {
  name: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const componentCategories: ComponentCategory[] = [
  { name: "レイアウト", count: 5, icon: <LayoutGrid size={18} />, color: "var(--chart-blue)" },
  { name: "フォーム", count: 9, icon: <FormInput size={18} />, color: "var(--chart-emerald)" },
  { name: "データ表示", count: 10, icon: <Table2 size={18} />, color: "var(--chart-purple)" },
  { name: "ナビゲーション", count: 7, icon: <Compass size={18} />, color: "var(--chart-amber)" },
  { name: "フィードバック", count: 7, icon: <MessageSquare size={18} />, color: "var(--chart-red)" },
  { name: "チャート", count: 6, icon: <BarChart3 size={18} />, color: "var(--chart-cyan)" },
  { name: "マーケティング", count: 9, icon: <Megaphone size={18} />, color: "var(--chart-pink)" },
  { name: "ユーティリティ", count: 6, icon: <Wrench size={18} />, color: "var(--chart-lime)" },
];

const INITIAL_SHOW = 6;

/* ── ShowcasePage ──────────────────────────────────────────────── */

export function ShowcasePage() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [showAll, setShowAll] = useState(false);

  const visiblePages = showAll ? samplePages : samplePages.slice(0, INITIAL_SHOW);

  return (
    <div className={styles.page}>
      {/* ── 1. Navbar ──────────────────────────────────────────── */}
      <Navbar
        logo={<Logo size="md" />}
        actions={
          <div className={styles.navActions}>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              onClick={toggleTheme}
              aria-label="テーマ切替"
            >
              {resolvedTheme === "light" ? <Moon size={18} /> : <Zap size={18} />}
            </Button>
            <a
              href="#"
              className={styles.iconLink}
              aria-label="リポジトリ"
            >
              <Button variant="ghost" size="sm" iconOnly aria-label="リポジトリ">
                <Github size={18} />
              </Button>
            </a>
            <a href="/docs">
              <Button size="sm">ドキュメント</Button>
            </a>
          </div>
        }
      >
        <NavbarLinks>
          <NavbarLink href="/showcase" active>
            サンプル集
          </NavbarLink>
          <NavbarLink href="/docs">ドキュメント</NavbarLink>
          <NavbarLink href="#" target="_blank">
            GitHub
          </NavbarLink>
        </NavbarLinks>
      </Navbar>

      {/* ── 2. Hero ────────────────────────────────────────────── */}
      <Hero
        badge="v0.1 リリース"
        title="Kaze Design System"
        subtitle="風のように軽やかな、日本語に最適化されたデザインシステム。CSS-in-JS ランタイム不要の軽量設計で、React や Next.js にすぐ組み込めます。"
        className={styles.heroSection}
      >
        <a href="/docs">
          <Button size="lg">ドキュメントを見る</Button>
        </a>
        <a href="#">
          <Button size="lg" variant="outline">
            <span className={styles.ctaGroup}>
              <Github size={16} />
              GitHub
            </span>
          </Button>
        </a>
      </Hero>

      {/* ── 3. Rich Stats ─────────────────────────────────────── */}
      <Section background="muted">
        <div className={styles.statsGrid}>
          {/* Card 1: コンポーネント + DonutChart */}
          <Card>
            <div className={styles.statsCardInner}>
              <div className={styles.statsCardText}>
                <div className={styles.statsCardLabel}>
                  <Layers size={16} />
                  <span>コンポーネント</span>
                </div>
                <div className={styles.statsCardNumber}>59</div>
                <Text size="sm" color="muted">
                  8カテゴリのコンポーネントで
                  <br />
                  あらゆるUIを構築できます。
                </Text>
              </div>
              <div className={styles.statsCardChart}>
                <DonutChart
                  aria-label="コンポーネントカテゴリ比率"
                  data={componentCategories.map((c) => ({
                    label: c.name,
                    value: c.count,
                    color: c.color,
                  }))}
                  size={120}
                  strokeWidth={24}
                  showLegend={false}
                />
              </div>
            </div>
          </Card>

          {/* Card 2: サンプルページ + bar chart */}
          <Card>
            <div className={styles.statsCardInner}>
              <div className={styles.statsCardText}>
                <div className={styles.statsCardLabel}>
                  <Boxes size={16} />
                  <span>サンプルページ</span>
                </div>
                <div className={styles.statsCardNumber}>{samplePages.length}</div>
                <Text size="sm" color="muted">
                  ダッシュボードからLP、メールまで
                  <br />
                  実践的なサンプルを収録。
                </Text>
              </div>
              <div className={styles.barChart}>
                <div className={styles.barLabels}>
                  {["SaaS", "LP", "App", "Mail", "他"].map((l) => (
                    <span key={l} className={styles.barLabel}>{l}</span>
                  ))}
                </div>
                <div className={styles.bars}>
                  {[
                    { h: 90, color: "var(--chart-blue)" },
                    { h: 60, color: "var(--chart-amber)" },
                    { h: 50, color: "var(--chart-emerald)" },
                    { h: 40, color: "var(--chart-pink)" },
                    { h: 30, color: "var(--chart-cyan)" },
                  ].map((bar, i) => (
                    <div
                      key={i}
                      className={styles.bar}
                      style={{ height: `${bar.h}%`, background: bar.color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Card 3: カラーパレット (wide) */}
          <Card className={styles.statsCardWide}>
            <div className={styles.statsCardInner}>
              <div className={styles.statsCardText}>
                <div className={styles.statsCardLabel}>
                  <Droplets size={16} />
                  <span>カラーシステム</span>
                </div>
                <div className={styles.statsCardNumber}>12×10</div>
                <Text size="sm" color="muted">
                  12色相 × 10階調のカラーパレットと Warm Zinc の中間色。
                  テーマを切り替えると配色が自動で変わります。
                </Text>
              </div>
              <div className={styles.statsCardChart}>
                <div className={styles.palettePreview}>
                  {["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "blue", "violet", "pink"].map((hue) => (
                    <div
                      key={hue}
                      className={styles.palettePreviewSwatch}
                      style={{ background: `var(--${hue}-500)` }}
                      title={hue}
                    />
                  ))}
                </div>
                <div className={styles.miniLegend}>
                  <div className={styles.miniLegendItem}>
                    <span className={styles.miniLegendDot} style={{ background: "var(--chart-blue)" }} />
                    <span>12色相 × 10階調</span>
                  </div>
                  <div className={styles.miniLegendItem}>
                    <span className={styles.miniLegendDot} style={{ background: "var(--color-fg-tertiary)" }} />
                    <span>Zinc 11段階</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* ── 4. Features — Why Kaze ─────────────────────────────── */}
      <Section>
        <SectionHeader
          title="Kaze の特徴"
          description="開発のしやすさと使い心地の両方にこだわった、モダンなデザインシステム。"
        />
        <FeatureGrid columns={3}>
          <FeatureCard
            icon={<Moon size={24} />}
            title="ダークモード対応"
            description="ライト・ダークの切り替えは属性ひとつ。すべてのコンポーネントが自動で配色を合わせます。"
          />
          <FeatureCard
            icon={<Palette size={24} />}
            title="日本語に最適化"
            description="日本語の文章に合わせた行間・文字間・フォント設定。読みやすく美しい画面を手軽に作れます。"
          />
          <FeatureCard
            icon={<Zap size={24} />}
            title="軽量設計"
            description="スタイリングは純粋な CSS で、CSS-in-JS のランタイムが不要。gzip 約 20KB の軽量パッケージです。"
          />
        </FeatureGrid>
      </Section>

      {/* ── 5. Components ──────────────────────────────────────── */}
      <Section background="muted">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeading}>
            <Heading
              level={2}
              description="フォーム、データ表示、ナビゲーション、チャートなど、よく使う UI 部品を一通り揃えています。"
            >
              59のコンポーネント
            </Heading>
          </div>

          <div className={styles.catGrid}>
            {componentCategories.map((cat) => (
              <Card key={cat.name} variant="interactive">
                <CardBody>
                  <div className={styles.catHeader}>
                    <div
                      className={styles.catIcon}
                      style={{
                        background: `color-mix(in srgb, ${cat.color} 12%, transparent)`,
                        color: cat.color,
                      }}
                    >
                      {cat.icon}
                    </div>
                    <div>
                      <Text as="div" size="sm" weight="medium">{cat.name}</Text>
                      <Text as="div" size="xs" color="subtle">
                        {cat.count} コンポーネント
                      </Text>
                    </div>
                  </div>
                  <div className={styles.catBar}>
                    <div
                      className={styles.catBarFill}
                      style={{
                        width: `${(cat.count / 10) * 100}%`,
                        background: cat.color,
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className={styles.catCta}>
            <a href="/docs/components">
              <Button variant="outline" size="lg">
                <span className={styles.ctaGroup}>
                  すべてのコンポーネントを見る
                  <ArrowRight size={16} />
                </span>
              </Button>
            </a>
          </div>
        </div>
      </Section>

      {/* ── 6. Sample Pages ────────────────────────────────────── */}
      <Section>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeading}>
            <Heading
              level={2}
              description="実際の画面を想定した作例です。Kaze だけでここまで作れます。"
            >
              サンプルページ
            </Heading>
          </div>

          <div className={styles.sampleGrid}>
            {visiblePages.map((page) => (
              <a
                key={page.href}
                href={page.href}
                className={styles.sampleLink}
              >
                <Card variant="interactive" className={styles.sampleCard}>
                  <CardHeader>
                    <div className={styles.sampleCardHeader}>
                      <div className={styles.sampleEmoji}>{page.icon}</div>
                      <Badge variant={page.categoryVariant}>
                        {page.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <CardTitle>{page.title}</CardTitle>
                    <CardDescription>{page.description}</CardDescription>
                    <div className={styles.sampleFooter}>
                      <span className={styles.sampleViewLink}>
                        見る
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </a>
            ))}
          </div>

          {!showAll && samplePages.length > INITIAL_SHOW && (
            <div className={styles.showMoreWrap}>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAll(true)}
              >
                すべてのサンプルを見る（{samplePages.length}件）
              </Button>
            </div>
          )}
        </div>
      </Section>

      {/* ── 7. CTA Banner ──────────────────────────────────────── */}
      <Section background="muted">
        <CTABanner
          title="今すぐ始めましょう"
          description="Kaze なら、きれいで速い画面をすぐに作れます。オープンソースで、今日から使えます。"
        >
          <a href="/docs">
            <Button size="lg">無料ではじめる</Button>
          </a>
          <a href="#">
            <Button size="lg" variant="outline">
              GitHubで見る
            </Button>
          </a>
        </CTABanner>
      </Section>

      {/* ── 8. Footer ──────────────────────────────────────────── */}
      <LPFooter
        logo={<Logo size="sm" />}
        description="日本発のオープンソースデザインシステム。軽くて美しく、誰でも使いやすい UI を目指しています。"
        columns={[
          {
            title: "プロダクト",
            links: [
              { label: "コンポーネント", href: "/docs/components" },
              { label: "デザイントークン", href: "/docs/tokens" },
              { label: "カラー", href: "/docs/colors" },
              { label: "ユーティリティ", href: "/docs/utilities" },
            ],
          },
          {
            title: "リソース",
            links: [
              { label: "ドキュメント", href: "/docs" },
              { label: "はじめに", href: "/docs/getting-started" },
              { label: "サンプル集", href: "/showcase" },
              { label: "GitHub", href: "#" },
            ],
          },
          {
            title: "コミュニティ",
            links: [
              { label: "コミュニティフォーラム", href: "#" },
              { label: "コントリビュート", href: "#" },
              { label: "ライセンス", href: "#" },
              { label: "行動規範", href: "#" },
            ],
          },
        ]}
        bottomLeft={
          <span>
            &copy; {new Date().getFullYear()} Kaze Design System
          </span>
        }
      />

      {/* ── Floating Theme Toggle ──────────────────────────────── */}
      <FAB
        label="テーマ切替"
        variant="secondary"
        size="sm"
        onClick={toggleTheme}
        aria-label="テーマ切替"
      >
        {resolvedTheme === "light" ? <Moon size={16} /> : <Zap size={16} />}
      </FAB>
    </div>
  );
}
