import {
  Zap,
  Palette,
  Accessibility,
  Moon,
  Sun,
  Sparkles,
  Rocket,
  Github,
} from "lucide-react";
import {
  Navbar,
  NavbarLinks,
  NavbarLink,
  Hero,
  Section,
  SectionHeader,
  FeatureGrid,
  FeatureCard,
  Stats,
  StatItem,
  TestimonialGrid,
  TestimonialCard,
  PricingGrid,
  PricingCard,
  FAQ,
  FAQItem,
  CTABanner,
  LPFooter,
  Button,
  Logo,
  FAB,
} from "@/components";
import { useTheme } from "@/hooks";
import styles from "./LandingPage.module.css";

/* ── Feature data ─────────────────────────────────────────── */

const features = [
  {
    icon: <Zap size={24} />,
    title: "圧倒的な軽量さ",
    description:
      "ランタイム JavaScript ゼロ。gzip 後 4KB 未満の CSS で、すべてのコンポーネントをスタイリング。パフォーマンスを犠牲にしません。",
    bg: "linear-gradient(135deg, var(--blue-500), var(--cyan-400))",
  },
  {
    icon: <Palette size={24} />,
    title: "デザイントークン",
    description:
      "カラー・タイポグラフィ・スペーシングを一元管理。CSS カスタムプロパティベースで、テーマの切り替えもわずか数行。",
    bg: "linear-gradient(135deg, var(--violet-500), var(--pink-400))",
  },
  {
    icon: <Accessibility size={24} />,
    title: "アクセシビリティ",
    description:
      "WAI-ARIA ガイドラインに準拠。キーボード操作、スクリーンリーダー対応を標準搭載し、すべてのユーザーに最適な体験を。",
    bg: "linear-gradient(135deg, var(--emerald-500), var(--teal-400))",
  },
  {
    icon: <Moon size={24} />,
    title: "ダークモード",
    description:
      "ライト / ダークをワンクリックで切り替え。デザイントークンの自動変換により、追加の CSS は一切不要です。",
    bg: "linear-gradient(135deg, var(--amber-500), var(--orange-400))",
  },
];

/* ── Testimonial data ─────────────────────────────────────── */

const testimonials = [
  {
    quote:
      "Kaze を導入してから、UIの実装スピードが劇的に向上しました。デザイントークンのおかげで、デザイナーとエンジニアの認識のズレがなくなり、手戻りが大幅に減りました。",
    name: "田中 太郎",
    role: "フロントエンドリード — マルシェテック",
    initial: "T",
  },
  {
    quote:
      "軽量でありながら、アクセシビリティまでしっかり対応しているのが素晴らしい。ダークモードの実装もトークンの切り替えだけで完了し、工数を大幅に削減できました。",
    name: "佐藤 花子",
    role: "プロダクトデザイナー — ワークフロー",
    initial: "S",
  },
  {
    quote:
      "依存関係ゼロというのは本当に心強い。バンドルサイズを気にせず使えるので、パフォーマンスを最優先にするプロジェクトでも安心して採用できます。",
    name: "鈴木 一郎",
    role: "CTO — スタートアップ",
    initial: "I",
  },
];

/* ── Stats data ───────────────────────────────────────────── */

const stats = [
  { value: "54+", label: "コンポーネント" },
  { value: "0", label: "依存関係" },
  { value: "100%", label: "TypeScript" },
  { value: "<4KB", label: "CSS gzipped" },
];

/* ── LandingPage ──────────────────────────────────────────── */

export function LandingPage() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <div className={styles.page}>
      {/* ── 1. Navbar ──────────────────────────────────────── */}
      <Navbar
        logo={<Logo size="md" />}
        actions={
          <div className={styles.navActions}>
            <a href="#" aria-label="リポジトリ">
              <Button variant="ghost" size="sm" iconOnly aria-label="リポジトリ">
                <Github size={18} />
              </Button>
            </a>
            <Button size="sm">
              <span className={styles.btnIconLabel}>
                <Rocket size={14} />
                はじめる
              </span>
            </Button>
          </div>
        }
      >
        <NavbarLinks>
          <NavbarLink href="#features">機能</NavbarLink>
          <NavbarLink href="#pricing">料金</NavbarLink>
          <NavbarLink href="#testimonials">お客様の声</NavbarLink>
          <NavbarLink href="#faq">FAQ</NavbarLink>
        </NavbarLinks>
      </Navbar>

      {/* ── 2. Hero ────────────────────────────────────────── */}
      <Hero
        badge="AI & Human Friendly"
        title="美しいUIを、もっと速く"
        subtitle="Kaze は、人にもAIにも扱いやすいデザインシステムです。明快なトークン設計と軽量な CSS で、AI コーディングツールとの協業でも、手書きでも、迷わず美しい UI を組み立てられます。"
        bg="linear-gradient(135deg, var(--violet-600), var(--blue-600) 40%, var(--cyan-500) 70%, var(--emerald-400))"
        className={styles.heroSection}
      >
        <div className={styles.heroActions}>
          <Button size="lg">
            <span className={styles.btnIconLabel}>
              <Sparkles size={16} />
              はじめる
            </span>
          </Button>
          <Button size="lg" variant="outline">
            ドキュメント
          </Button>
        </div>
      </Hero>

      {/* ── 3. Stats ───────────────────────────────────────── */}
      <Section size="sm" className={styles.statsSection}>
        <Stats className={styles.statsGrid}>
          {stats.map((s) => (
            <StatItem key={s.label} value={s.value} label={s.label} className={styles.statCard} />
          ))}
        </Stats>
      </Section>

      {/* ── 4. Features ────────────────────────────────────── */}
      <Section id="features" className={styles.featuresSection}>
        <SectionHeader
          title="なぜ Kaze を選ぶのか"
          description="開発体験とユーザー体験の両方を追求した、モダンなデザインシステム。"
        />
        <FeatureGrid columns={2}>
          {features.map((f) => (
            <FeatureCard
              key={f.title}
              icon={
                <div className={styles.featureIconWrap} style={{ background: f.bg }}>
                  {f.icon}
                </div>
              }
              title={f.title}
              description={f.description}
            />
          ))}
        </FeatureGrid>
      </Section>

      {/* ── 5. Pricing ─────────────────────────────────────── */}
      <Section id="pricing" background="muted">
        <SectionHeader
          title="料金プラン"
          description="個人開発からエンタープライズまで、あらゆる規模に対応します。"
        />
        <PricingGrid>
          <PricingCard
            name="Free"
            description="個人プロジェクトやオープンソースに最適"
            price="¥0"
            period="月"
            features={[
              "全コンポーネント利用可能",
              "MIT ライセンス",
              "コミュニティサポート",
              "Issue トラッカーでの質問",
            ]}
          >
            <Button variant="outline" fullWidth>
              無料ではじめる
            </Button>
          </PricingCard>

          <PricingCard
            name="Pro"
            description="チーム開発やスタートアップ向け"
            price="¥2,980"
            period="月"
            featured
            badge="人気"
            features={[
              "Free プランのすべて",
              "デザインファイル",
              "優先メールサポート",
              "プライベートDiscordチャンネル",
              "新コンポーネントの先行アクセス",
            ]}
          >
            <Button fullWidth>Pro を始める</Button>
          </PricingCard>

          <PricingCard
            name="Enterprise"
            description="大規模チーム・組織向けカスタムプラン"
            price="お問い合わせ"
            features={[
              "Pro プランのすべて",
              "専任サポートエンジニア",
              "カスタムコンポーネント開発",
              "SLA 保証",
              "オンボーディング支援",
              "請求書払い対応",
            ]}
          >
            <Button variant="outline" fullWidth>
              営業に相談する
            </Button>
          </PricingCard>
        </PricingGrid>
      </Section>

      {/* ── 6. Testimonials ────────────────────────────────── */}
      <Section id="testimonials">
        <SectionHeader
          title="お客様の声"
          description="Kaze を導入したチームからいただいたフィードバックをご紹介します。"
        />
        <TestimonialGrid className={styles.testimonialGrid}>
          {testimonials.map((t) => (
            <TestimonialCard
              key={t.name}
              quote={t.quote}
              authorName={t.name}
              authorRole={t.role}
              showIcon
              className={styles.testimonialCard}
            />
          ))}
        </TestimonialGrid>
      </Section>

      {/* ── 7. FAQ ─────────────────────────────────────────── */}
      <Section id="faq" background="muted">
        <SectionHeader
          title="よくある質問"
          description="Kaze に関するよくある質問をまとめました。"
        />
        <FAQ>
          <FAQItem
            question="Kaze は商用プロジェクトで利用できますか？"
            answer="はい、Kaze は MIT ライセンスで提供されており、商用・非商用を問わず自由にご利用いただけます。クレジット表記も必須ではありません。"
          />
          <FAQItem
            question="既存のプロジェクトに段階的に導入できますか？"
            answer="はい、Kaze はコンポーネント単位でのインポートに対応しています。必要なコンポーネントだけをコピー&ペーストで導入できるため、既存のコードベースへの影響を最小限に抑えられます。"
          />
          <FAQItem
            question="他の CSS フレームワークと併用できますか？"
            answer="Kaze は BEM 命名規則に基づいたスコープ付きクラス名を使用しているため、Tailwind CSS や他のフレームワークとの競合が発生しにくい設計になっています。"
          />
          <FAQItem
            question="ダークモードはどのように実装されていますか？"
            answer="CSS カスタムプロパティ（CSS Variables）を活用したデザイントークンで実装されています。html 要素に data-theme='dark' 属性を付与するだけで、すべてのコンポーネントが自動的にダークモードに切り替わります。"
          />
          <FAQItem
            question="サポートされているブラウザを教えてください。"
            answer="モダンブラウザ（Chrome、Firefox、Safari、Edge）の最新2バージョンをサポートしています。IE 11 はサポート対象外です。"
          />
        </FAQ>
      </Section>

      {/* ── 8. CTA Banner ──────────────────────────────────── */}
      <Section>
        <CTABanner
          title="今すぐ始めましょう"
          description="Kaze で、美しく高速な UI を構築しませんか。オープンソースで、すぐに使い始められます。"
          className={styles.ctaBanner}
        >
          <Button size="lg" className={styles.ctaBtnPrimary}>
            <span className={styles.btnIconLabel}>
              <Sparkles size={16} />
              無料ではじめる
            </span>
          </Button>
          <Button size="lg" variant="outline" className={styles.ctaBtnOutline}>
            GitHubで見る
          </Button>
        </CTABanner>
      </Section>

      {/* ── 9. Footer ──────────────────────────────────────── */}
      <LPFooter
        logo={<Logo size="sm" />}
        description="日本発のオープンソースデザインシステム。美しく、軽く、アクセシブルなUIをすべての開発者に。"
        columns={[
          {
            title: "プロダクト",
            links: [
              { label: "コンポーネント", href: "#" },
              { label: "デザイントークン", href: "#" },
              { label: "デザインファイル", href: "#" },
              { label: "変更履歴", href: "#" },
            ],
          },
          {
            title: "リソース",
            links: [
              { label: "ドキュメント", href: "#" },
              { label: "はじめに", href: "#" },
              { label: "ブログ", href: "#" },
              { label: "GitHub", href: "#" },
            ],
          },
          {
            title: "会社",
            links: [
              { label: "会社概要", href: "#" },
              { label: "お問い合わせ", href: "#" },
              { label: "プライバシーポリシー", href: "#" },
              { label: "利用規約", href: "#" },
            ],
          },
        ]}
        bottomLeft={
          <span>&copy; {new Date().getFullYear()} Kaze Design System. All rights reserved.</span>
        }
      />

      {/* ── Floating Theme Toggle ──────────────────────────── */}
      <FAB
        label="テーマ切替"
        variant="secondary"
        size="sm"
        onClick={toggleTheme}
        aria-label="テーマ切替"
      >
        {resolvedTheme === "light" ? <Moon size={16} /> : <Sun size={16} />}
      </FAB>
    </div>
  );
}
