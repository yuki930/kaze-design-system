import {
  Navbar,
  NavbarLinks,
  NavbarLink,
  Card,
  CardBody,
  Badge,
  Button,
  Logo,
  LPFooter,
  Section,
  Heading,
  Text,
  Grid,
  Divider,
  FAB,
} from "@/components";
import { useTheme } from "@/hooks";
import {
  Search,
  BookOpen,
  Settings,
  CreditCard,
  Users,
  Shield,
  Zap,
  FileText,
  ChevronRight,
  MessageCircle,
  Mail,
  Moon,
  Sun,
} from "lucide-react";
import styles from "./HelpPage.module.css";

/* ── Data ──────────────────────────────────────────────────── */

const categories = [
  { icon: <BookOpen size={22} />, title: "はじめに", count: 8, color: "var(--chart-blue)" },
  { icon: <Settings size={22} />, title: "アカウント設定", count: 12, color: "var(--chart-emerald)" },
  { icon: <CreditCard size={22} />, title: "料金・お支払い", count: 6, color: "var(--chart-amber)" },
  { icon: <Users size={22} />, title: "チーム管理", count: 9, color: "var(--chart-purple)" },
  { icon: <Shield size={22} />, title: "セキュリティ", count: 5, color: "var(--chart-red)" },
  { icon: <Zap size={22} />, title: "API・連携", count: 11, color: "var(--chart-cyan)" },
];

const popularArticles = [
  { title: "アカウントを新規作成する", badge: "人気", badgeVariant: "info" as const },
  { title: "二要素認証を有効にする", badge: null, badgeVariant: "default" as const },
  { title: "プランをアップグレードする方法", badge: null, badgeVariant: "default" as const },
  { title: "チームメンバーを招待する", badge: "人気", badgeVariant: "info" as const },
  { title: "APIキーを発行・管理する", badge: null, badgeVariant: "default" as const },
  { title: "請求書をダウンロードする", badge: null, badgeVariant: "default" as const },
  { title: "Webhook の設定方法", badge: "NEW", badgeVariant: "positive" as const },
  { title: "データのエクスポート方法", badge: null, badgeVariant: "default" as const },
];

const recentArticles = [
  { title: "2026年2月のアップデート — ダッシュボード改善", badge: "NEW", badgeVariant: "positive" as const },
  { title: "チャットツール連携の設定手順が変わりました", badge: "更新", badgeVariant: "warning" as const },
  { title: "新しい権限モデルについて", badge: "NEW", badgeVariant: "positive" as const },
  { title: "モバイルアプリ v2.0 リリースノート", badge: null, badgeVariant: "default" as const },
];

/* ── HelpPage ──────────────────────────────────────────────── */

export function HelpPage() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <div className={styles.page}>
      {/* ── Navbar ───────────────────────────────────────── */}
      <Navbar
        logo={<Logo size="md" />}
        actions={
          <Button size="sm" variant="outline">
            お問い合わせ
          </Button>
        }
      >
        <NavbarLinks>
          <NavbarLink href="/help" active>ヘルプセンター</NavbarLink>
          <NavbarLink href="#">コミュニティ</NavbarLink>
          <NavbarLink href="#">ステータス</NavbarLink>
        </NavbarLinks>
      </Navbar>

      {/* ── Search Hero ─────────────────────────────────── */}
      <Section background="muted" className={styles.searchHero}>
        <div className={styles.searchHeroInner}>
          <Heading level={1}>何かお困りですか？</Heading>
          <Text color="muted">
            キーワードで記事を検索するか、カテゴリから探してください。
          </Text>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="例: パスワードをリセットしたい"
              className={styles.searchInput}
            />
          </div>
        </div>
      </Section>

      {/* ── Main Content ────────────────────────────────── */}
      <div className={styles.content}>
        {/* ── Categories ──────────────────────────────── */}
        <Heading level={2}>カテゴリから探す</Heading>
        <Grid columns={3} columnsMd={2} columnsSm={2} gap="var(--space-4)" className={styles.catGridSpacing}>
          {categories.map((cat) => (
            <Card key={cat.title} variant="interactive" className={styles.catCard}>
              <CardBody>
                <div
                  className={styles.catIconWrap}
                  style={{
                    background: `color-mix(in srgb, ${cat.color} 12%, transparent)`,
                    color: cat.color,
                  }}
                >
                  {cat.icon}
                </div>
                <Text as="div" size="sm" weight="semibold">{cat.title}</Text>
                <Text as="div" variant="caption">{cat.count} 記事</Text>
              </CardBody>
            </Card>
          ))}
        </Grid>

        <Divider />

        {/* ── Popular Articles ────────────────────────── */}
        <Heading level={2}>よく読まれている記事</Heading>
        <ul className={styles.articleList}>
          {popularArticles.map((article) => (
            <li key={article.title}>
              <a href="#" className={styles.articleItem}>
                <FileText size={16} className={styles.articleIcon} />
                <span className={styles.articleTitle}>{article.title}</span>
                {article.badge && (
                  <Badge variant={article.badgeVariant} className={styles.articleBadge}>
                    {article.badge}
                  </Badge>
                )}
                <ChevronRight size={14} className={styles.articleArrow} />
              </a>
            </li>
          ))}
        </ul>

        <Divider />

        {/* ── Recent Articles ─────────────────────────── */}
        <Heading level={2}>最近の更新</Heading>
        <ul className={styles.articleList}>
          {recentArticles.map((article) => (
            <li key={article.title}>
              <a href="#" className={styles.articleItem}>
                <FileText size={16} className={styles.articleIcon} />
                <span className={styles.articleTitle}>{article.title}</span>
                {article.badge && (
                  <Badge variant={article.badgeVariant} className={styles.articleBadge}>
                    {article.badge}
                  </Badge>
                )}
                <ChevronRight size={14} className={styles.articleArrow} />
              </a>
            </li>
          ))}
        </ul>

        <Divider />

        {/* ── Contact Section ─────────────────────────── */}
        <Heading level={2}>解決しない場合は</Heading>
        <Grid columns={3} columnsSm={1} gap="var(--space-4)">
          <Card>
            <CardBody>
              <div className={styles.contactIcon}>
                <MessageCircle size={20} />
              </div>
              <Text as="div" size="sm" weight="semibold">チャットサポート</Text>
              <Text variant="caption">
                平日 9:00〜18:00 にリアルタイムでお答えします。平均応答時間は3分です。
              </Text>
              <Button size="sm">チャットを開始</Button>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className={styles.contactIcon}>
                <Mail size={20} />
              </div>
              <Text as="div" size="sm" weight="semibold">メールサポート</Text>
              <Text variant="caption">
                24時間受付。通常1営業日以内にご返信いたします。
              </Text>
              <Button size="sm" variant="outline">メールを送る</Button>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className={styles.contactIcon}>
                <Users size={20} />
              </div>
              <Text as="div" size="sm" weight="semibold">コミュニティ</Text>
              <Text variant="caption">
                他のユーザーやチームメンバーに質問できるフォーラムです。
              </Text>
              <Button size="sm" variant="outline">フォーラムへ</Button>
            </CardBody>
          </Card>
        </Grid>
      </div>

      {/* ── Footer ──────────────────────────────────────── */}
      <LPFooter
        logo={<Logo size="sm" />}
        description="お困りのことがあればいつでもお気軽にお問い合わせください。"
        columns={[
          {
            title: "サポート",
            links: [
              { label: "ヘルプセンター", href: "/help" },
              { label: "お問い合わせ", href: "#" },
              { label: "ステータスページ", href: "#" },
            ],
          },
          {
            title: "リソース",
            links: [
              { label: "ドキュメント", href: "/docs" },
              { label: "API リファレンス", href: "#" },
              { label: "変更履歴", href: "#" },
            ],
          },
          {
            title: "会社",
            links: [
              { label: "会社概要", href: "#" },
              { label: "プライバシーポリシー", href: "#" },
              { label: "利用規約", href: "#" },
            ],
          },
        ]}
        bottomLeft={
          <span>&copy; {new Date().getFullYear()} Kaze. All rights reserved.</span>
        }
      />

      {/* ── Floating Theme Toggle ───────────────────────── */}
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
