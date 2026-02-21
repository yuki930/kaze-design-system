import {
  Navbar,
  NavbarLinks,
  NavbarLink,
  Button,
  Card,
  CardBody,
  Hero,
  Section,
  SectionHeader,
  SplitSection,
  TestimonialGrid,
  TestimonialCard,
  CTABanner,
  LPFooter,
  FAB,
  Logo,
  Text,
  Grid,
} from "@/components";
import { useTheme } from "@/hooks";
import { Moon, Sun, ArrowRight } from "lucide-react";

/* ── Data ─────────────────────────────────────────────────── */

const products = [
  {
    name: "KAZE チェア",
    price: "¥89,800",
    gradient: "linear-gradient(160deg, #667eea 0%, #764ba2 100%)",
  },
  {
    name: "KAZE デスクライト",
    price: "¥24,800",
    gradient: "linear-gradient(160deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    name: "KAZE スピーカー",
    price: "¥34,800",
    gradient: "linear-gradient(160deg, #4facfe 0%, #00f2fe 100%)",
  },
];

/* ── Image Landing Page ───────────────────────────────────── */

export function ImageLandingPage() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* ── Navbar ──────────────────────────────────────────── */}
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
            <Button size="sm">今すぐ購入</Button>
          </div>
        }
      >
        <NavbarLinks>
          <NavbarLink href="/lp2" active>
            ホーム
          </NavbarLink>
          <NavbarLink href="#">プロダクト</NavbarLink>
          <NavbarLink href="#">ストーリー</NavbarLink>
          <NavbarLink href="#">ストア</NavbarLink>
        </NavbarLinks>
      </Navbar>

      {/* ── Full-width Hero ─────────────────────────────────── */}
      <Hero
        title={"暮らしを、\nデザインする。"}
        subtitle={"日本の美意識から生まれたプロダクトブランド KAZE。\n機能美と素材の質感にこだわった、上質な日常をお届けします。"}
        bg="linear-gradient(135deg, #0c0a09 0%, #292524 40%, #44403c 100%)"
        overlay={0.5}
        style={{ minHeight: "80vh" }}
      >
        <Button
          size="lg"
          style={{
            background: "#ffffff",
            color: "#0c0a09",
            border: "none",
          }}
        >
          コレクションを見る
        </Button>
        <Button
          size="lg"
          variant="outline"
          style={{
            borderColor: "rgba(255,255,255,0.4)",
            color: "#ffffff",
          }}
        >
          ストーリーを読む
        </Button>
      </Hero>

      {/* ── Feature Row 1 (Image Left, Text Right) ──────────── */}
      <SplitSection
        mediaBg="linear-gradient(135deg, #e7e4df 0%, #d6d2cc 50%, #a8a29e 100%)"
      >
        <Text variant="overline" as="div">Philosophy</Text>
        <Text as="div" size="2xl" weight="bold" style={{ letterSpacing: "var(--letter-spacing-tight)", lineHeight: "var(--line-height-tight)" }}>
          素材の声に
          <br />
          耳を傾ける
        </Text>
        <Text variant="lead">
          天然木、リネン、和紙。日本の伝統素材に現代のデザインを融合させ、五感で楽しめるプロダクトを生み出しています。手に取るたびに感じる、素材の温かみと職人の技。
        </Text>
        <div>
          <Button variant="outline">
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              詳しく見る
              <ArrowRight size={16} />
            </span>
          </Button>
        </div>
      </SplitSection>

      {/* ── Feature Row 2 (Text Left, Image Right) ──────────── */}
      <SplitSection
        mediaBg="linear-gradient(135deg, #d6d2cc 0%, #a8a29e 50%, #78716c 100%)"
        reverse
      >
        <Text variant="overline" as="div">Craftsmanship</Text>
        <Text as="div" size="2xl" weight="bold" style={{ letterSpacing: "var(--letter-spacing-tight)", lineHeight: "var(--line-height-tight)" }}>
          一つひとつ、
          <br />
          手仕事で仕上げる
        </Text>
        <Text variant="lead">
          量産では実現できない精度と質感。日本各地の工房と連携し、熟練の職人が一点ずつ丁寧に仕上げます。使い込むほどに味わいが増す、長く愛されるものづくりです。
        </Text>
        <div>
          <Button variant="outline">
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              工房を訪ねる
              <ArrowRight size={16} />
            </span>
          </Button>
        </div>
      </SplitSection>

      {/* ── Full-width Image Banner ─────────────────────────── */}
      <section
        style={{
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #44403c 0%, #292524 50%, #1c1917 100%)",
        }}
      >
        <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
          <Text as="div" size="2xl" weight="bold" color="inherit" style={{ color: "#ffffff", margin: "0 0 var(--space-2)" }}>
            2025 Spring Collection
          </Text>
          <Text as="div" color="inherit" style={{ color: "rgba(255,255,255,0.8)", margin: 0 }}>
            春の新作コレクション、まもなく公開
          </Text>
        </div>
      </section>

      {/* ── Product Grid ────────────────────────────────────── */}
      <Section size="lg">
        <SectionHeader
          title="人気のプロダクト"
          description="お客様に最も愛されているアイテムをご紹介します"
        />

        <Grid columns={3} columnsMd={2} columnsSm={1}>
          {products.map((product) => (
            <Card key={product.name} variant="interactive">
              <div
                style={{
                  aspectRatio: "4 / 5",
                  borderRadius: "var(--radius-lg)",
                  width: "100%",
                  background: product.gradient,
                }}
              />
              <CardBody>
                <Text as="div" weight="semibold" style={{ marginBottom: "var(--space-1)" }}>
                  {product.name}
                </Text>
                <Text as="div" variant="caption">{product.price}</Text>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* ── Testimonials ────────────────────────────────────── */}
      <Section size="lg" background="muted">
        <SectionHeader
          title="お客様の声"
          description="KAZE のプロダクトを愛用されている方々からの声をお届けします"
        />

        <TestimonialGrid>
          <TestimonialCard
            quote="KAZEのチェアに座ると、仕事への集中力が変わりました。見た目の美しさだけでなく、長時間座っても疲れない設計が素晴らしいです。"
            authorName="山本 真理子"
            authorRole="建築デザイナー"
            showIcon
          />
          <TestimonialCard
            quote="デスクライトの光が柔らかくて、夜の読書が楽しくなりました。和紙を通した光は、まるで月明かりのようです。"
            authorName="木村 健一"
            authorRole="編集者"
            showIcon
          />
          <TestimonialCard
            quote="スピーカーの音質と木の質感に一目惚れ。インテリアとしても美しく、毎日の暮らしに豊かさをもたらしてくれます。"
            authorName="林 美優"
            authorRole="インテリアスタイリスト"
            showIcon
          />
        </TestimonialGrid>
      </Section>

      {/* ── CTA Section ───────────────────────────────────────── */}
      <Section size="lg">
        <CTABanner
          title="あなたの日常に、KAZEを。"
          description="オンラインストアで全コレクションをご覧いただけます。送料無料・30日間返品保証。"
        >
          <Button size="lg">ストアへ行く</Button>
          <Button size="lg" variant="outline">カタログを見る</Button>
        </CTABanner>
      </Section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <LPFooter
        logo={<Logo size="sm" />}
        description="日本の美意識から生まれたプロダクトブランド。機能美と素材の質感にこだわった上質な日常をお届けします。"
        columns={[
          {
            title: "プロダクト",
            links: [
              { label: "チェア", href: "#" },
              { label: "デスクライト", href: "#" },
              { label: "スピーカー", href: "#" },
              { label: "全商品", href: "#" },
            ],
          },
          {
            title: "ブランド",
            links: [
              { label: "ストーリー", href: "#" },
              { label: "工房紹介", href: "#" },
              { label: "サステナビリティ", href: "#" },
              { label: "プレスルーム", href: "#" },
            ],
          },
          {
            title: "サポート",
            links: [
              { label: "お問い合わせ", href: "#" },
              { label: "配送について", href: "#" },
              { label: "返品ポリシー", href: "#" },
              { label: "FAQ", href: "#" },
            ],
          },
        ]}
        bottomLeft={
          <span>
            &copy; {new Date().getFullYear()} KAZE. All rights reserved.
          </span>
        }
      />

      {/* Floating Theme Toggle */}
      <FAB label="テーマ切替" variant="secondary" size="sm" onClick={toggleTheme} aria-label="テーマ切替">
        {resolvedTheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </FAB>
    </div>
  );
}
