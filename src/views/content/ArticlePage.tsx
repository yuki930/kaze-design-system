import {
  Navbar,
  NavbarLinks,
  NavbarLink,
  Avatar,
  Badge,
  Button,
  Logo,
} from "@/components";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";

export function ArticlePage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* ── Navbar ─────────────────────────────────────────── */}
      <Navbar
        logo={<Logo size="sm" />}
        actions={
          <div className="navbar__actions">
            <Button variant="ghost" size="sm">
              ログイン
            </Button>
            <Button size="sm">会員登録</Button>
          </div>
        }
      >
        <NavbarLinks>
          <NavbarLink href="#">おすすめ</NavbarLink>
          <NavbarLink href="#" active>
            テクノロジー
          </NavbarLink>
          <NavbarLink href="#">デザイン</NavbarLink>
          <NavbarLink href="#">ビジネス</NavbarLink>
        </NavbarLinks>
      </Navbar>

      {/* ── Article ────────────────────────────────────────── */}
      <article className="article" style={{ paddingTop: "var(--space-10)" }}>
        {/* Cover Image */}
        <img
          className="article__cover"
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=675&fit=crop"
          alt="コードエディタのスクリーンショット"
        />

        {/* Header */}
        <header className="article__header">
          <span className="article__category">デザインシステム</span>
          <h1 className="article__title">
            なぜデザインシステムが必要なのか
            ―小さなチームこそ導入すべき理由
          </h1>
          <div className="article__meta">
            <div className="article__meta-author">
              <Avatar fallback="YH" size="sm" />
              <span className="article__meta-author-name">原山 悠</span>
            </div>
            <span className="article__meta-dot" />
            <time>2026年2月18日</time>
            <span className="article__meta-dot" />
            <span>8分で読めます</span>
          </div>
        </header>

        {/* Body */}
        <div className="article__body prose">
          <p>
            「デザインシステムは大企業のもの」—そう思っていませんか？
            実は、少人数のチームこそデザインシステムの恩恵を最も受けられます。
            この記事では、小さなチームがデザインシステムを導入すべき理由と、
            最小構成で始める方法を解説します。
          </p>

          <h2>デザインシステムとは何か</h2>

          <p>
            デザインシステムとは、UIコンポーネント、デザイントークン（色・タイポグラフィ・スペーシング）、
            そしてそれらの使い方を定めたガイドラインの集合体です。
            単なるコンポーネントライブラリではなく、
            <strong>チーム全体の共通言語</strong>として機能します。
          </p>

          <blockquote>
            デザインシステムは製品ではなく、プロセスである。
            チームが一貫した体験を効率的に構築するための基盤だ。
          </blockquote>

          <h2>小さなチームこそ必要な3つの理由</h2>

          <h3>1. 意思決定の疲労を減らす</h3>

          <p>
            ボタンの角丸は何pxにするか。テキストカラーは<code>#333</code>か<code>#1a1a1a</code>か。
            小さなチームでは、こうした細かい意思決定が一人ひとりにのしかかります。
            デザイントークンとして定義しておけば、毎回悩む必要がなくなります。
          </p>

          <pre><code>{`:root {
  --color-fg: #09090b;
  --color-fg-secondary: #71717a;
  --radius-md: 0.5rem;
  --space-4: 1rem;
}`}</code></pre>

          <h3>2. オンボーディングが劇的に速くなる</h3>

          <p>
            新しいメンバーが加わったとき、デザインシステムがあれば「このプロジェクトではこう書く」が明確です。
            コードレビューの指摘事項も減り、立ち上がりが格段に早くなります。
          </p>

          <ul>
            <li>コンポーネントの使い方がドキュメント化されている</li>
            <li>命名規則やスペーシングのルールが統一されている</li>
            <li>アクセシビリティの要件が組み込まれている</li>
            <li>ダークモード対応が自動的に行われる</li>
          </ul>

          <h3>3. 品質の一貫性を保てる</h3>

          <p>
            大企業のように品質保証チームがいない小さなチームでは、
            UIの一貫性を維持するのは特に困難です。
            デザインシステムは、コンポーネント単位でアクセシビリティとレスポンシブ対応を
            テスト済みの状態で提供します。
          </p>

          <figure>
            <img
              src="https://images.unsplash.com/photo-1522542550221-31fd8575a1f3?w=800&h=400&fit=crop"
              alt="デザインツールの画面"
            />
            <figcaption>
              デザイントークンを使えば、デザインとコードの間のギャップを最小化できる
            </figcaption>
          </figure>

          <h2>最小構成で始める</h2>

          <p>
            デザインシステムを一から作る必要はありません。
            最小限のトークン定義と、よく使うコンポーネント5〜6個から始めましょう。
          </p>

          <ol>
            <li>
              <strong>カラートークン</strong>を定義する（背景、テキスト、ボーダーの3種）
            </li>
            <li>
              <strong>タイポグラフィスケール</strong>を決める（4〜5段階で十分）
            </li>
            <li>
              <strong>スペーシングスケール</strong>を設定する（4の倍数が基本）
            </li>
            <li>
              <strong>Button、Input、Card</strong>を最初のコンポーネントとして実装する
            </li>
            <li>
              ドキュメントは<strong>使いながら書く</strong>（完璧を求めない）
            </li>
          </ol>

          <hr />

          <h2>まとめ</h2>

          <p>
            デザインシステムは「大きな投資」ではなく「小さな習慣」です。
            最初からすべてを用意する必要はありません。
            日々の開発で繰り返し使うパターンをトークンとコンポーネントに落とし込んでいけば、
            それが自然とあなたのチームのデザインシステムになります。
          </p>

          <p>
            まずは今日、プロジェクトの<code>tokens.css</code>を作ることから始めてみませんか。
          </p>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: "var(--space-2)", margin: "var(--space-8) 0 0", flexWrap: "wrap" }}>
          <Badge>デザインシステム</Badge>
          <Badge>フロントエンド</Badge>
          <Badge>CSS</Badge>
          <Badge>React</Badge>
          <Badge>UI設計</Badge>
        </div>

        {/* Actions */}
        <div className="article__actions">
          <div className="article__actions-left">
            <button className="article__action-btn article__action-btn--active">
              <Heart size={16} />
              <span>128</span>
            </button>
            <button className="article__action-btn">
              <MessageCircle size={16} />
              <span>24</span>
            </button>
          </div>
          <div className="article__actions-right">
            <button className="article__action-btn">
              <Bookmark size={16} />
            </button>
            <button className="article__action-btn">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Author Card */}
        <div className="article__author-card">
          <Avatar fallback="YH" size="lg" />
          <div className="article__author-card-info">
            <h3 className="article__author-card-name">原山 悠</h3>
            <p className="article__author-card-bio">
              フロントエンドエンジニア / デザインシステムを作るのが好き。
              日々の開発で「あったらいいな」を形にしています。
              TypeScript、React、CSSが得意。
            </p>
            <Button variant="outline" size="sm">
              フォロー
            </Button>
          </div>
        </div>

        {/* Related Articles */}
        <div className="article__related">
          <h2 className="article__related-title">関連記事</h2>
          <div className="article__related-grid">
            {[
              {
                title: "CSSカスタムプロパティで作るダークモード",
                image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop",
                author: "鈴木 一郎",
                date: "2026年2月12日",
              },
              {
                title: "アクセシビリティを最初から考える設計",
                image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=250&fit=crop",
                author: "佐藤 花子",
                date: "2026年2月10日",
              },
              {
                title: "Reactコンポーネントの命名規則ベストプラクティス",
                image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
                author: "田中 太郎",
                date: "2026年2月8日",
              },
            ].map((article) => (
              <a key={article.title} href="#" className="article__related-card">
                <img src={article.image} alt={article.title} />
                <span className="article__related-card-title">{article.title}</span>
                <span className="article__related-card-meta">
                  {article.author}
                  <span className="article__meta-dot" />
                  {article.date}
                </span>
              </a>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
