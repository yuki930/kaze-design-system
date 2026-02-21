import {
  Navbar,
  NavbarLinks,
  NavbarLink,
  Logo,
  Button,
  Badge,
  Avatar,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  Tabs,
  Tab,
  Input,
} from "@/components";
import { Pagination } from "@/components/Pagination/Pagination";
import { Heading } from "@/components/Heading/Heading";
import { Heart, Search, Bookmark, TrendingUp } from "lucide-react";

/* ── Data ──────────────────────────────────────────────────── */

const featuredArticle = {
  image:
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop",
  category: "テクノロジー",
  title: "2026年のフロントエンド開発：React Server Componentsがもたらす変革",
  excerpt:
    "React Server Componentsが本格的に普及し始めた2026年。サーバーとクライアントの境界が曖昧になる中、フロントエンドエンジニアはどのようにアーキテクチャを設計すべきなのか。最新のベストプラクティスを徹底解説します。",
  author: "原山 悠",
  authorFallback: "YH",
  date: "2026年2月18日",
  readTime: "12分",
  likes: 342,
};

const articles = [
  {
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
    category: "デザイン",
    categoryVariant: "info" as const,
    title: "デザインシステムを小さく始める方法",
    excerpt:
      "大規模なデザインシステムを構築する必要はありません。最小限のトークンと5つのコンポーネントから始める実践的なアプローチを紹介します。",
    author: "佐藤 花子",
    authorFallback: "SH",
    date: "2026年2月16日",
    likes: 198,
  },
  {
    image:
      "https://images.unsplash.com/photo-1550439062-609e1531270e?w=600&h=400&fit=crop",
    category: "テクノロジー",
    categoryVariant: "positive" as const,
    title: "TypeScript 5.8の新機能を徹底解説",
    excerpt:
      "TypeScript 5.8で追加された型推論の改善、パフォーマンス最適化、新しいユーティリティ型について、実際のコード例を交えて解説します。",
    author: "田中 太郎",
    authorFallback: "TT",
    date: "2026年2月14日",
    likes: 256,
  },
  {
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    category: "AI",
    categoryVariant: "warning" as const,
    title: "AIコーディングアシスタントを最大限活用するプロンプト術",
    excerpt:
      "AIコーディングツールを日常の開発で活用するための具体的なプロンプトテクニック。効率を3倍にする実践的な使い方を紹介。",
    author: "鈴木 一郎",
    authorFallback: "SI",
    date: "2026年2月12日",
    likes: 421,
  },
  {
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=400&fit=crop",
    category: "インフラ",
    categoryVariant: "negative" as const,
    title: "エッジワーカーで実現するエッジコンピューティング入門",
    excerpt:
      "サーバーレスの次のステップとして注目されるエッジコンピューティング。エッジワーカーを使った実装パターンをゼロから解説します。",
    author: "中村 美咲",
    authorFallback: "NM",
    date: "2026年2月10日",
    likes: 167,
  },
  {
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    category: "キャリア",
    categoryVariant: "info" as const,
    title: "エンジニアからプロダクトマネージャーへの転身記",
    excerpt:
      "5年間のフロントエンド開発経験を経てPMに転身した筆者が、技術バックグラウンドを活かしたプロダクトマネジメントの実践を語ります。",
    author: "高橋 健太",
    authorFallback: "TK",
    date: "2026年2月8日",
    likes: 189,
  },
  {
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop",
    category: "デザイン",
    categoryVariant: "info" as const,
    title: "CSSカスタムプロパティでダークモードを完全攻略する",
    excerpt:
      "CSS変数を使ったダークモード実装の決定版。デザイントークンの設計からアニメーション付きトランジションまで、包括的に解説します。",
    author: "山田 愛",
    authorFallback: "YA",
    date: "2026年2月6日",
    likes: 234,
  },
];

const popularTags = [
  "React",
  "TypeScript",
  "Next.js",
  "デザインシステム",
  "CSS",
  "AI",
  "Rust",
  "Go",
  "エッジコンピューティング",
  "アクセシビリティ",
  "テスト",
  "DevOps",
];

const popularAuthors = [
  { name: "原山 悠", fallback: "YH", articles: 42 },
  { name: "佐藤 花子", fallback: "SH", articles: 38 },
  { name: "田中 太郎", fallback: "TT", articles: 35 },
  { name: "鈴木 一郎", fallback: "SI", articles: 29 },
  { name: "中村 美咲", fallback: "NM", articles: 24 },
];

/* ── Styles ─────────────────────────────────────────────────── */

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--color-bg)",
    color: "var(--color-fg)",
  },

  /* Hero */
  hero: {
    textAlign: "center" as const,
    padding: "var(--space-16) var(--space-6) var(--space-10)",
    maxWidth: "48rem",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "clamp(1.5rem, 5vw, 2.25rem)",
    fontWeight: "var(--font-weight-bold, 700)",
    lineHeight: "1.2",
    color: "var(--color-fg)",
    margin: "0 0 var(--space-4)",
    letterSpacing: "-0.02em",
  },
  heroSubtitle: {
    fontSize: "var(--font-size-lg, 1.125rem)",
    color: "var(--color-fg-secondary)",
    lineHeight: "1.7",
    margin: "0 0 var(--space-8)",
  },
  heroSearch: {
    display: "flex",
    gap: "var(--space-2)",
    maxWidth: "32rem",
    margin: "0 auto",
  },

  /* Tabs */
  tabsRow: {
    display: "flex",
    justifyContent: "center",
    padding: "0 var(--space-6) var(--space-8)",
  },

  /* Layout */
  contentWrapper: {
    maxWidth: "80rem",
    margin: "0 auto",
    padding: "0 var(--space-4) var(--space-12)",
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "var(--space-10)",
  } as React.CSSProperties,
  contentWrapperDesktop: {
    gridTemplateColumns: "1fr 20rem",
  },
  mainColumn: {
    minWidth: 0,
  },

  /* Featured */
  featuredCard: {
    marginBottom: "var(--space-10)",
    overflow: "hidden",
    cursor: "pointer",
  },
  featuredImageWrapper: {
    position: "relative" as const,
    width: "100%",
    aspectRatio: "2 / 1",
    overflow: "hidden",
    borderRadius: "var(--radius-lg, 0.75rem) var(--radius-lg, 0.75rem) 0 0",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
  },
  featuredBadge: {
    position: "absolute" as const,
    top: "var(--space-4)",
    left: "var(--space-4)",
  },
  featuredBody: {
    padding: "var(--space-6)",
  },
  featuredTitle: {
    fontSize: "var(--font-size-2xl, 1.5rem)",
    fontWeight: "var(--font-weight-bold, 700)",
    margin: "0 0 var(--space-3)",
    lineHeight: "1.4",
    color: "var(--color-fg)",
  },
  featuredExcerpt: {
    fontSize: "var(--font-size-base, 1rem)",
    color: "var(--color-fg-secondary)",
    lineHeight: "1.7",
    margin: "0 0 var(--space-4)",
  },
  featuredMeta: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-3)",
    fontSize: "var(--font-size-sm, 0.875rem)",
    color: "var(--color-fg-secondary)",
  },
  featuredAuthor: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-2)",
  },
  metaDot: {
    width: "3px",
    height: "3px",
    borderRadius: "50%",
    background: "var(--color-border)",
    flexShrink: 0,
  },
  featuredLikes: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-1)",
    marginLeft: "auto",
    color: "var(--color-fg-secondary)",
  },

  /* Section heading */
  sectionTitle: {
    fontSize: "var(--font-size-xl, 1.25rem)",
    fontWeight: "var(--font-weight-semibold, 600)",
    color: "var(--color-fg)",
    margin: "0 0 var(--space-6)",
  },

  /* Article Grid */
  articleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "var(--space-6)",
    marginBottom: "var(--space-10)",
  },
  articleCard: {
    overflow: "hidden",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column" as const,
  },
  articleImageWrapper: {
    position: "relative" as const,
    width: "100%",
    aspectRatio: "3 / 2",
    overflow: "hidden",
    borderRadius: "var(--radius-lg, 0.75rem) var(--radius-lg, 0.75rem) 0 0",
  },
  articleImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
    transition: "transform 0.3s ease",
  },
  articleBadge: {
    position: "absolute" as const,
    top: "var(--space-3)",
    left: "var(--space-3)",
  },
  articleBody: {
    padding: "var(--space-4)",
    display: "flex",
    flexDirection: "column" as const,
    flex: 1,
  },
  articleTitle: {
    fontSize: "var(--font-size-base, 1rem)",
    fontWeight: "var(--font-weight-semibold, 600)",
    lineHeight: "1.5",
    margin: "0 0 var(--space-2)",
    color: "var(--color-fg)",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
  },
  articleExcerpt: {
    fontSize: "var(--font-size-sm, 0.875rem)",
    color: "var(--color-fg-secondary)",
    lineHeight: "1.6",
    margin: "0 0 var(--space-4)",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
    flex: 1,
  },
  articleFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "var(--font-size-xs, 0.75rem)",
    color: "var(--color-fg-secondary)",
  },
  articleAuthor: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-2)",
  },
  articleAuthorName: {
    fontWeight: "var(--font-weight-medium, 500)",
  },
  articleLikes: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-1)",
  },

  /* Sidebar */
  sidebar: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--space-8)",
  },
  sidebarSection: {
    padding: "var(--space-5)",
  },
  tagGrid: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "var(--space-2)",
  },
  tagBadge: {
    cursor: "pointer",
  },
  authorList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--space-4)",
  },
  authorItem: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-3)",
    cursor: "pointer",
  },
  authorInfo: {
    flex: 1,
    minWidth: 0,
  },
  authorName: {
    fontSize: "var(--font-size-sm, 0.875rem)",
    fontWeight: "var(--font-weight-medium, 500)",
    color: "var(--color-fg)",
    margin: 0,
  },
  authorArticles: {
    fontSize: "var(--font-size-xs, 0.75rem)",
    color: "var(--color-fg-secondary)",
    margin: 0,
  },

  /* Trending sidebar card */
  trendingItem: {
    display: "flex",
    gap: "var(--space-3)",
    padding: "var(--space-3) 0",
    borderBottom: "1px solid var(--color-border)",
    cursor: "pointer",
  },
  trendingRank: {
    fontSize: "var(--font-size-2xl, 1.5rem)",
    fontWeight: "var(--font-weight-bold, 700)",
    color: "var(--color-border)",
    lineHeight: "1",
    minWidth: "1.5rem",
    flexShrink: 0,
  },
  trendingTitle: {
    fontSize: "var(--font-size-sm, 0.875rem)",
    fontWeight: "var(--font-weight-medium, 500)",
    color: "var(--color-fg)",
    lineHeight: "1.4",
    margin: "0 0 var(--space-1)",
  },
  trendingMeta: {
    fontSize: "var(--font-size-xs, 0.75rem)",
    color: "var(--color-fg-secondary)",
    margin: 0,
  },

  /* Pagination wrapper */
  paginationWrapper: {
    display: "flex",
    justifyContent: "center",
    padding: "var(--space-8) 0 var(--space-16)",
    maxWidth: "80rem",
    margin: "0 auto",
  },

  /* Responsive (CSS-in-JS fallback) */
  "@media (max-width: 64rem)": {},
} as const;

/* ── Trending articles for sidebar ──────────────────────────── */

const trendingArticles = [
  {
    title: "Bunが実現する高速なJavaScriptランタイムの未来",
    author: "山本 隆",
    likes: 534,
  },
  {
    title: "WebAssemblyでブラウザゲーム開発を始めよう",
    author: "石田 亮",
    likes: 412,
  },
  {
    title: "デザインツールからコードへ：デザインとコードの架け橋",
    author: "佐藤 花子",
    likes: 387,
  },
  {
    title: "モノレポ管理のベストプラクティス 2026年版",
    author: "田中 太郎",
    likes: 356,
  },
];

/* ── Component ──────────────────────────────────────────────── */

export function BlogPage() {
  return (
    <div style={styles.page}>
      {/* ── Navbar ───────────────────────────────────────────── */}
      <Navbar
        logo={<Logo size="sm" />}
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <Button variant="ghost" size="sm">
              ログイン
            </Button>
            <Button size="sm">新規登録</Button>
          </div>
        }
      >
        <NavbarLinks>
          <NavbarLink href="#" active>
            トレンド
          </NavbarLink>
          <NavbarLink href="#">最新</NavbarLink>
          <NavbarLink href="#">テクノロジー</NavbarLink>
          <NavbarLink href="#">デザイン</NavbarLink>
        </NavbarLinks>
      </Navbar>

      {/* ── Hero / Header ───────────────────────────────────── */}
      <header style={styles.hero}>
        <h1 style={styles.heroTitle}>テクノロジーとデザインの最前線</h1>
        <p style={styles.heroSubtitle}>
          エンジニアとデザイナーのための技術メディア。最新のフロントエンド、UI/UX、AI、インフラの知見を日本語でお届けします。
        </p>
        <div style={styles.heroSearch}>
          <Input placeholder="記事を検索..." style={{ flex: 1 }} />
          <Button>
            <Search size={16} />
          </Button>
        </div>
      </header>

      {/* ── Category Tabs ───────────────────────────────────── */}
      <div style={styles.tabsRow}>
        <Tabs variant="pills">
          <Tab active>
            <TrendingUp size={14} style={{ marginRight: "var(--space-1)" }} />
            トレンド
          </Tab>
          <Tab>最新</Tab>
          <Tab>テクノロジー</Tab>
          <Tab>デザイン</Tab>
          <Tab>AI</Tab>
          <Tab>キャリア</Tab>
        </Tabs>
      </div>

      {/* ── Main Content ────────────────────────────────────── */}
      <div className="blog-layout" style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 var(--space-4) var(--space-12)" }}>
        <main style={styles.mainColumn}>
          {/* Featured Article */}
          <Card variant="interactive" style={styles.featuredCard}>
            <div style={styles.featuredImageWrapper}>
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                style={styles.featuredImage}
              />
              <div style={styles.featuredBadge}>
                <Badge variant="positive">{featuredArticle.category}</Badge>
              </div>
            </div>
            <div style={styles.featuredBody}>
              <h2 style={styles.featuredTitle}>{featuredArticle.title}</h2>
              <p style={styles.featuredExcerpt}>{featuredArticle.excerpt}</p>
              <div style={styles.featuredMeta}>
                <div style={styles.featuredAuthor}>
                  <Avatar fallback={featuredArticle.authorFallback} size="sm" />
                  <span>{featuredArticle.author}</span>
                </div>
                <span style={styles.metaDot} />
                <span>{featuredArticle.date}</span>
                <span style={styles.metaDot} />
                <span>{featuredArticle.readTime}で読めます</span>
                <div style={styles.featuredLikes}>
                  <Heart size={14} />
                  <span>{featuredArticle.likes}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Article Grid Heading */}
          <Heading level={2} bordered>
            最新の記事
          </Heading>

          {/* Article Grid */}
          <div style={styles.articleGrid}>
            {articles.map((article) => (
              <Card
                key={article.title}
                variant="interactive"
                style={styles.articleCard}
              >
                <div style={styles.articleImageWrapper}>
                  <img
                    src={article.image}
                    alt={article.title}
                    style={styles.articleImage}
                  />
                  <div style={styles.articleBadge}>
                    <Badge variant={article.categoryVariant}>
                      {article.category}
                    </Badge>
                  </div>
                </div>
                <div style={styles.articleBody}>
                  <h3 style={styles.articleTitle}>{article.title}</h3>
                  <p style={styles.articleExcerpt}>{article.excerpt}</p>
                  <div style={styles.articleFooter}>
                    <div style={styles.articleAuthor}>
                      <Avatar fallback={article.authorFallback} size="xs" />
                      <span style={styles.articleAuthorName}>
                        {article.author}
                      </span>
                      <span style={styles.metaDot} />
                      <span>{article.date}</span>
                    </div>
                    <div style={styles.articleLikes}>
                      <Heart size={12} />
                      <span>{article.likes}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside style={styles.sidebar}>
          {/* Trending Articles */}
          <Card style={styles.sidebarSection}>
            <CardHeader>
              <CardTitle>
                <TrendingUp
                  size={16}
                  style={{
                    marginRight: "var(--space-2)",
                    verticalAlign: "text-bottom",
                  }}
                />
                トレンド記事
              </CardTitle>
            </CardHeader>
            <CardBody>
              {trendingArticles.map((item, index) => (
                <div
                  key={item.title}
                  style={{
                    ...styles.trendingItem,
                    ...(index === trendingArticles.length - 1
                      ? { borderBottom: "none", paddingBottom: 0 }
                      : {}),
                    ...(index === 0 ? { paddingTop: 0 } : {}),
                  }}
                >
                  <span style={styles.trendingRank}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p style={styles.trendingTitle}>{item.title}</p>
                    <p style={styles.trendingMeta}>
                      {item.author}
                      <span
                        style={{
                          ...styles.metaDot,
                          display: "inline-block",
                          margin: "0 var(--space-1)",
                          verticalAlign: "middle",
                        }}
                      />
                      <Heart
                        size={10}
                        style={{
                          verticalAlign: "middle",
                          marginRight: "2px",
                        }}
                      />
                      {item.likes}
                    </p>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Popular Tags */}
          <Card style={styles.sidebarSection}>
            <CardHeader>
              <CardTitle>人気タグ</CardTitle>
            </CardHeader>
            <CardBody>
              <div style={styles.tagGrid}>
                {popularTags.map((tag) => (
                  <Badge key={tag} style={styles.tagBadge}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Popular Authors */}
          <Card style={styles.sidebarSection}>
            <CardHeader>
              <CardTitle>人気の著者</CardTitle>
            </CardHeader>
            <CardBody>
              <div style={styles.authorList}>
                {popularAuthors.map((author) => (
                  <div key={author.name} style={styles.authorItem}>
                    <Avatar fallback={author.fallback} size="sm" />
                    <div style={styles.authorInfo}>
                      <p style={styles.authorName}>{author.name}</p>
                      <p style={styles.authorArticles}>
                        {author.articles}件の記事
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      フォロー
                    </Button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Bookmark CTA */}
          <Card
            style={{
              ...styles.sidebarSection,
              background: "var(--color-bg-muted, var(--color-bg-secondary))",
              textAlign: "center" as const,
            }}
          >
            <CardBody>
              <Bookmark
                size={32}
                style={{
                  color: "var(--color-fg-secondary)",
                  margin: "0 auto var(--space-3)",
                  display: "block",
                }}
              />
              <CardTitle
                style={{
                  fontSize: "var(--font-size-base, 1rem)",
                  marginBottom: "var(--space-2)",
                }}
              >
                リーディングリスト
              </CardTitle>
              <CardDescription>
                気になる記事をブックマークして、あとでまとめて読みましょう。
              </CardDescription>
              <Button
                variant="outline"
                size="sm"
                style={{ marginTop: "var(--space-4)" }}
              >
                無料で始める
              </Button>
            </CardBody>
          </Card>
        </aside>
      </div>

      {/* ── Pagination ───────────────────────────────────────── */}
      <div style={styles.paginationWrapper}>
        <Pagination currentPage={1} totalPages={12} />
      </div>
    </div>
  );
}
