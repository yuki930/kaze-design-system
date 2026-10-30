import { useState } from "react";
import {
  AnnouncementBar,
  Badge,
  Button,
  Link,
  LPFooter,
  Logo,
  Metric,
  NavItem,
  Navbar,
  NavbarLink,
  NavbarLinks,
  Sidebar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components";
import { useTheme } from "@/hooks";
import { categories } from "@/views/docs/ComponentsOverview";
import { GitHubMark } from "@/views/site/GitHubMark";
import { NPM_URL, REPO_URL, repoFileUrl } from "@/views/site/repo";
import {
  ArrowRight,
  Building2,
  Check,
  Copy,
  FileText,
  LayoutDashboard,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import styles from "./ShowcasePage.module.css";

/* ── Data ──────────────────────────────────────────────────────── */

/** Counted from the docs catalog, so the numbers never drift from the real set. */
const countOf = (layer: "application-ui" | "marketing") =>
  categories.filter((c) => c.layer === layer).reduce((sum, c) => sum + c.components.length, 0);
const applicationCount = countOf("application-ui");
const marketingCount = countOf("marketing");
const componentCount = applicationCount + marketingCount;

interface Sample {
  title: string;
  description: string;
  href: string;
  /** File name in public/showcase/ (light and dark screenshots) */
  shot?: string;
}

/** Featured samples carry a screenshot; the rest are listed as links. */
const featured: Sample[] = [
  {
    title: "ダッシュボード",
    description: "主要な指標、チャート、取引の一覧",
    href: "/dashboard",
    shot: "dashboard",
  },
  {
    title: "ランディングページ",
    description: "ヒーロー、特長、料金、よくある質問",
    href: "/lp",
    shot: "lp",
  },
  {
    title: "記事ページ",
    description: "本文、目次、著者の紹介",
    href: "/article",
    shot: "article",
  },
  {
    title: "アナリティクス",
    description: "アクセスの推移と流入元",
    href: "/analytics",
    shot: "analytics",
  },
  {
    title: "料金プラン",
    description: "プランの比較と機能の一覧",
    href: "/pricing",
    shot: "pricing",
  },
  {
    title: "設定",
    description: "プロフィール、通知、プラン",
    href: "/settings",
    shot: "settings",
  },
];

const moreSamples: Sample[] = [
  { title: "ブログ一覧", description: "", href: "/blog" },
  { title: "ログイン", description: "", href: "/login" },
  { title: "404 エラー", description: "", href: "/404" },
  { title: "プロジェクト管理", description: "", href: "/projects" },
  { title: "EC 管理画面", description: "", href: "/ec-dashboard" },
  { title: "ギャラリー", description: "", href: "/gallery" },
  { title: "画像ランディングページ", description: "", href: "/lp2" },
  { title: "Todo アプリ", description: "", href: "/todo" },
  { title: "お買い物リスト", description: "", href: "/shopping" },
  { title: "求人検索", description: "", href: "/jobs" },
  { title: "SaaS 統計", description: "", href: "/saas-stats" },
  { title: "ヘルプセンター", description: "", href: "/help" },
  { title: "注文確認メール", description: "", href: "/examples/email-order-confirmation.html" },
  { title: "ウェルカムメール", description: "", href: "/examples/email-welcome.html" },
  { title: "ニュースレター", description: "", href: "/examples/email-newsletter.html" },
];

const sampleCount = featured.length + moreSamples.length;

const steps = [
  { label: "1 指示書を置く", title: "AGENTS.md に Kaze の組み方", code: "npx kaze-init" },
  { label: "2 頼む", title: "ふだんの言葉で", code: "取引先の一覧を、検索付きで作って" },
  { label: "3 組む", title: "部品とトークンだけで", code: "AppLayout / Table / EmptyState" },
  { label: "4 確かめる", title: "文言を規則で検査", code: "kaze-copy: error 0 件" },
];

// kaze-copy-ignore-start: each "before" breaks the writing rules on purpose
const copyPairs = [
  { scene: "ボタン", before: "OK", after: "招待を送る" },
  {
    scene: "エラー",
    before: "エラーが発生しました",
    after: "カードの有効期限が切れています。新しいカードを登録してください",
  },
  { scene: "表記", before: "Kazeを使えば12席まで", after: "Kaze を使えば 12 席まで" },
];
// kaze-copy-ignore-end

type InvoiceStatus = "paid" | "waiting" | "overdue";

const invoices: { id: string; client: string; amount: string; status: InvoiceStatus }[] = [
  { id: "INV-1042", client: "株式会社ノーツ", amount: "1,280,000", status: "waiting" },
  { id: "INV-1040", client: "合同会社潮目", amount: "92,400", status: "overdue" },
  { id: "INV-1039", client: "株式会社みなも", amount: "330,000", status: "paid" },
];

const statusBadge: Record<
  InvoiceStatus,
  { label: string; tone: "default" | "negative" | "positive" }
> = {
  waiting: { label: "入金待ち", tone: "default" },
  overdue: { label: "期限切れ", tone: "negative" },
  paid: { label: "入金済み", tone: "positive" },
};

/* ── Parts ─────────────────────────────────────────────────────── */

const INIT_COMMAND = "npx kaze-init";

function CommandChip() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INIT_COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <span className={styles.command}>
      <code>
        <span aria-hidden="true" className={styles.prompt}>
          $
        </span>{" "}
        {INIT_COMMAND}
      </code>
      <button
        type="button"
        className={styles.copyButton}
        onClick={copy}
        aria-label={copied ? "コピーしました" : "コマンドをコピー"}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </span>
  );
}

/** A real Kaze screen, rendered with the library's own components. */
function HeroScreen() {
  return (
    <div className={styles.screen} aria-label="Kaze で組んだ請求書の画面" role="img">
      <div className={styles.screenBar} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className={styles.screenBody} inert>
        <Sidebar className={styles.screenSidebar} navLabel="見本のナビゲーション">
          <NavItem icon={<LayoutDashboard size={16} />}>ダッシュボード</NavItem>
          <NavItem icon={<FileText size={16} />} active>
            請求書
          </NavItem>
          <NavItem icon={<Building2 size={16} />}>取引先</NavItem>
          <NavItem icon={<Settings size={16} />}>設定</NavItem>
        </Sidebar>
        <div className={styles.screenMain}>
          <div className={styles.screenTitle}>
            <span>請求書</span>
            <Button size="sm">請求書を作成する</Button>
          </div>
          <div className={styles.screenMetrics}>
            <Metric
              label="今月の請求額"
              value="¥3,838,400"
              change={{ value: "前月比 +12.4%", trend: "positive" }}
            />
            <Metric label="入金待ち" value="¥1,766,000" />
            <Metric label="期限切れ" value="¥92,400" />
          </div>
          <div className={styles.screenTable}>
            <Table compact>
              <TableHeader>
                <TableRow>
                  <TableHead>請求番号</TableHead>
                  <TableHead>取引先</TableHead>
                  <TableHead className="table__cell--numeric">金額（円）</TableHead>
                  <TableHead>状態</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.id}</TableCell>
                    <TableCell>{inv.client}</TableCell>
                    <TableCell className="table__cell--numeric">{inv.amount}</TableCell>
                    <TableCell>
                      <Badge tone={statusBadge[inv.status].tone}>
                        {statusBadge[inv.status].label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ShowcasePage ──────────────────────────────────────────────── */

export function ShowcasePage() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <div className={styles.page}>
      <AnnouncementBar
        action={
          <Link href={repoFileUrl("CHANGELOG.md")} external>
            変更点を見る
          </Link>
        }
      >
        v{process.env.NEXT_PUBLIC_KAZE_VERSION} を公開しました。
      </AnnouncementBar>

      <Navbar
        logo={<Logo size="md" />}
        actions={
          <div className={styles.navActions}>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              onClick={toggleTheme}
              aria-label={resolvedTheme === "light" ? "ダークモードにする" : "ライトモードにする"}
            >
              {resolvedTheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
            <Button variant="ghost" size="sm" iconOnly asChild>
              <a href={REPO_URL} target="_blank" rel="noreferrer" aria-label="GitHub リポジトリ">
                <GitHubMark size={18} />
              </a>
            </Button>
          </div>
        }
      >
        <NavbarLinks>
          <NavbarLink href="/docs">ドキュメント</NavbarLink>
          <NavbarLink href="/docs/ai">AI と始める</NavbarLink>
          <NavbarLink href="/docs/writing">文言ガイド</NavbarLink>
          <NavbarLink href="#samples">サンプル</NavbarLink>
        </NavbarLinks>
      </Navbar>

      <main>
        {/* ── 1. Hero: the real screen ─────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              <span>美しい日本語の画面を、</span>
              <span>AI と数分で。</span>
            </h1>
            <p className={styles.heroLead}>
              Kaze は、数字と日本語を一日中読み続ける画面のための React
              デザインシステムです。部品と文言の規則を AI
              が読めるので、頼むだけで整った画面になります。
            </p>
            <div className={styles.heroActions}>
              <CommandChip />
              <Button size="lg" asChild>
                <a href="/docs/ai">AI と始める</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/docs/components">部品を見る</a>
              </Button>
            </div>
          </div>
          <HeroScreen />
        </section>

        {/* ── 2. How AI builds with Kaze ───────────────────────── */}
        <section className={`${styles.band} ${styles.bandMuted}`}>
          <div className={styles.bandInner}>
            <div className={styles.bandHead}>
              <h2 className={styles.bandTitle}>AI と組む</h2>
              <p className={styles.bandLead}>
                AGENTS.md に Kaze の組み方を書き込むと、Claude Code、Codex、Cursor
                が同じ規則で画面を組みます。
              </p>
            </div>
            <ol className={styles.steps}>
              {steps.map((s) => (
                <li key={s.label} className={styles.step}>
                  <span className={styles.stepLabel}>{s.label}</span>
                  <span className={styles.stepTitle}>{s.title}</span>
                  <code className={styles.stepCode}>{s.code}</code>
                </li>
              ))}
            </ol>
            <Link href="/docs/ai" className={styles.bandLink}>
              AI と始める手順を見る
            </Link>
          </div>
        </section>

        {/* ── 3. Japanese copy ─────────────────────────────────── */}
        <section className={styles.band}>
          <div className={styles.bandInner}>
            <div className={styles.bandHead}>
              <h2 className={styles.bandTitle}>わかりやすい日本語で</h2>
              <p className={styles.bandLead}>
                ボタンの言葉、エラーの書き方、英数字の前後のスペース。文言ガイドの規則を kaze-copy
                が検査して、直し方を示します。
              </p>
            </div>
            <div className={styles.pairs}>
              {copyPairs.map((p) => (
                <div key={p.scene} className={styles.pair}>
                  <span className={styles.pairScene}>{p.scene}</span>
                  <span className={styles.pairBefore}>
                    <span className="sr-only">直す前: </span>
                    {p.before}
                  </span>
                  <span className={styles.pairAfter}>
                    <span className="sr-only">直したあと: </span>
                    {p.after}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/docs/writing" className={styles.bandLink}>
              文言ガイドを読む
            </Link>
          </div>
        </section>

        {/* ── 4. Samples ───────────────────────────────────────── */}
        <section id="samples" className={`${styles.band} ${styles.bandMuted}`}>
          <div className={styles.bandInner}>
            <div className={styles.bandHead}>
              <h2 className={styles.bandTitle}>サンプル</h2>
              <p className={styles.bandLead}>
                {sampleCount} 枚のサンプルは、すべて Kaze の部品だけで組んでいます。
              </p>
            </div>
            <div className={styles.gallery}>
              {featured.map((s) => (
                <a key={s.href} href={s.href} className={styles.thumb}>
                  <span className={styles.thumbImage}>
                    <img
                      className={styles.shotLight}
                      src={`/showcase/${s.shot}-light.jpg`}
                      alt=""
                      width={1280}
                      height={800}
                      loading="lazy"
                    />
                    <img
                      className={styles.shotDark}
                      src={`/showcase/${s.shot}-dark.jpg`}
                      alt=""
                      width={1280}
                      height={800}
                      loading="lazy"
                    />
                  </span>
                  <span className={styles.thumbText}>
                    <span className={styles.thumbTitle}>{s.title}</span>
                    <span className={styles.thumbDescription}>{s.description}</span>
                  </span>
                </a>
              ))}
            </div>
            <div className={styles.more}>
              <span className={styles.moreLabel}>ほかのサンプル</span>
              <ul className={styles.moreList}>
                {moreSamples.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} className={styles.moreLink}>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── 5. Start ─────────────────────────────────────────── */}
        <section className={styles.band}>
          <div className={`${styles.bandInner} ${styles.start}`}>
            <div className={styles.bandHead}>
              <h2 className={styles.bandTitle}>使い始める</h2>
              <p className={styles.bandLead}>
                部品は {componentCount} 個（業務画面 {applicationCount}、LP {marketingCount}
                ）。CSS だけで動き、MIT ライセンスで使えます。
              </p>
            </div>
            <pre className={styles.startCode}>
              <code>{`npm install kaze-design-system
npx kaze-init`}</code>
            </pre>
            <div className={styles.heroActions}>
              <Button size="lg" asChild>
                <a href="/docs">ドキュメントを読む</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={NPM_URL} target="_blank" rel="noreferrer">
                  npm で見る
                  <ArrowRight size={16} />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <LPFooter
        logo={<Logo size="sm" />}
        description="数字と日本語を、一日中読める画面に。日本発のオープンソースのデザインシステムです。"
        columns={[
          {
            title: "はじめる",
            links: [
              { label: "ドキュメント", href: "/docs" },
              { label: "AI と始める", href: "/docs/ai" },
              { label: "文言ガイド", href: "/docs/writing" },
              { label: "コンポーネント", href: "/docs/components" },
            ],
          },
          {
            title: "基礎",
            links: [
              { label: "デザイントークン", href: "/docs/tokens" },
              { label: "カラー", href: "/docs/colors" },
              { label: "ユーティリティ", href: "/docs/utilities" },
              { label: "Storybook", href: "/storybook/index.html" },
            ],
          },
          {
            title: "コミュニティ",
            links: [
              { label: "GitHub", href: REPO_URL },
              { label: "npm", href: NPM_URL },
              { label: "Issues", href: `${REPO_URL}/issues` },
              { label: "ライセンス", href: repoFileUrl("LICENSE") },
            ],
          },
        ]}
        bottomLeft={<span>&copy; {new Date().getFullYear()} Kaze Design System</span>}
      />
    </div>
  );
}
