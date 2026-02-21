import { useState } from "react";
import {
  Button,
  Badge,
  Logo,
  Navbar,
  NavbarLinks,
  NavbarLink,
  PricingGrid,
  PricingCard,
  FAQ,
  FAQItem,
  CTABanner,
  LPFooter,
  Section,
  SectionHeader,
  Tabs,
  Tab,
} from "@/components";
import { Heading } from "@/components/Heading/Heading";

/* ── Pricing data ────────────────────────────────────────────── */

const MONTHLY_PRICES = {
  free: "¥0",
  pro: "¥1,980",
  enterprise: "お問い合わせ",
} as const;

const YEARLY_PRICES = {
  free: "¥0",
  pro: "¥1,584",
  enterprise: "お問い合わせ",
} as const;

/* ── PricingPage ─────────────────────────────────────────────── */

export function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const prices = isYearly ? YEARLY_PRICES : MONTHLY_PRICES;
  const period = isYearly ? "月（年払い）" : "月";

  return (
    <>
      {/* ── 1. Navbar ──────────────────────────────────────────── */}
      <Navbar
        logo={<Logo size="md" />}
        actions={
          <>
            <Button variant="ghost" size="sm">
              ログイン
            </Button>
            <Button size="sm">無料で始める</Button>
          </>
        }
      >
        <NavbarLinks>
          <NavbarLink href="#features">機能</NavbarLink>
          <NavbarLink href="#pricing" active>
            料金
          </NavbarLink>
          <NavbarLink href="#docs">ドキュメント</NavbarLink>
        </NavbarLinks>
      </Navbar>

      {/* ── 2. Hero ────────────────────────────────────────────── */}
      <Section size="lg">
        <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto" }}>
          <Badge variant="info" style={{ marginBottom: "var(--space-4)" }}>
            すべてのプランで14日間無料トライアル
          </Badge>
          <Heading
            level={1}
            description="チームの規模やニーズに合わせて、最適なプランをお選びください。いつでもアップグレード・ダウングレードが可能です。"
          >
            シンプルな料金プラン
          </Heading>
        </div>
      </Section>

      {/* ── 3. Billing Toggle ──────────────────────────────────── */}
      <Section size="sm">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-3)",
          }}
        >
          <Tabs variant="pills">
            <Tab active={!isYearly} onClick={() => setIsYearly(false)}>
              月払い
            </Tab>
            <Tab active={isYearly} onClick={() => setIsYearly(true)}>
              年払い
              <Badge
                variant="positive"
                style={{ marginLeft: "var(--space-2)" }}
              >
                20% OFF
              </Badge>
            </Tab>
          </Tabs>
        </div>
      </Section>

      {/* ── 4. Pricing Cards ───────────────────────────────────── */}
      <Section id="pricing">
        <PricingGrid>
          {/* Free */}
          <PricingCard
            name="Free"
            description="個人開発やお試しに最適な無料プラン"
            price={prices.free}
            period={period}
            features={[
              "プロジェクト数 3件まで",
              "基本コンポーネントすべて利用可能",
              "コミュニティサポート",
              "月間 1,000 API リクエスト",
            ]}
          >
            <Button variant="outline" fullWidth>
              無料ではじめる
            </Button>
          </PricingCard>

          {/* Pro */}
          <PricingCard
            name="Pro"
            description="成長中のチームやスタートアップに最適"
            price={prices.pro}
            period={period}
            featured
            badge="おすすめ"
            features={[
              "プロジェクト数 無制限",
              "全コンポーネント＋テンプレート",
              "優先メールサポート",
              "月間 100,000 API リクエスト",
              "デザインファイル",
              "カスタムテーマ作成",
            ]}
          >
            <Button fullWidth>Pro を始める</Button>
          </PricingCard>

          {/* Enterprise */}
          <PricingCard
            name="Enterprise"
            description="大規模チーム・組織向けのフルカスタムプラン"
            price={prices.enterprise}
            features={[
              "Pro プランのすべて",
              "専任カスタマーサクセス",
              "カスタムコンポーネント開発",
              "SLA 99.99% 保証",
              "SSO / SAML 対応",
              "請求書払い・契約対応",
              "オンボーディング支援",
            ]}
          >
            <Button variant="outline" fullWidth>
              営業に相談する
            </Button>
          </PricingCard>
        </PricingGrid>
      </Section>

      {/* ── 5. FAQ ─────────────────────────────────────────────── */}
      <Section background="muted">
        <SectionHeader
          title="料金に関するよくある質問"
          description="ご不明な点がございましたら、お気軽にお問い合わせください。"
        />
        <FAQ>
          <FAQItem
            question="無料トライアル期間が終了したらどうなりますか？"
            answer="14日間の無料トライアル終了後は、自動的に Free プランに移行します。クレジットカードの事前登録は不要ですので、意図しない課金が発生することはありません。"
          />
          <FAQItem
            question="プランの変更はいつでもできますか？"
            answer="はい、いつでもアップグレード・ダウングレードが可能です。アップグレードの場合は即座に反映され、日割り計算で差額をお支払いいただきます。ダウングレードの場合は、現在の請求期間の終了時に反映されます。"
          />
          <FAQItem
            question="年払いの場合、途中解約はできますか？"
            answer="年払いの途中解約も可能です。未使用期間分の返金は、残り月数に応じて日割り計算でお返しいたします。詳しくはサポートチームまでご連絡ください。"
          />
          <FAQItem
            question="Enterprise プランの料金体系を教えてください。"
            answer="Enterprise プランは、チームの規模や必要な機能に応じてカスタム見積もりをご提供しています。専用のセキュリティ要件や SLA 保証、カスタム開発など、柔軟に対応可能です。まずはお気軽にお問い合わせください。"
          />
          <FAQItem
            question="どのような支払い方法に対応していますか？"
            answer="クレジットカード（Visa、Mastercard、American Express、JCB）に対応しています。Enterprise プランでは請求書払い（NET 30）もご利用いただけます。すべての決済は SSL 暗号化で安全に処理されます。"
          />
        </FAQ>
      </Section>

      {/* ── 6. CTA Banner ──────────────────────────────────────── */}
      <Section>
        <CTABanner
          title="まずは無料で体験してみませんか？"
          description="クレジットカード不要で、今すぐ始められます。チームの生産性を飛躍的に向上させましょう。"
        >
          <Button size="lg">無料で始める</Button>
          <Button size="lg" variant="outline">
            営業に相談する
          </Button>
        </CTABanner>
      </Section>

      {/* ── 7. Footer ──────────────────────────────────────────── */}
      <LPFooter
        logo={<Logo size="sm" />}
        description="日本発のオープンソースデザインシステム。美しく、軽く、アクセシブルな UI をすべての開発者に。"
        columns={[
          {
            title: "プロダクト",
            links: [
              { label: "コンポーネント", href: "#" },
              { label: "デザイントークン", href: "#" },
              { label: "テンプレート", href: "#" },
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
          <span>
            &copy; {new Date().getFullYear()} Kaze Design System. All rights
            reserved.
          </span>
        }
      />
    </>
  );
}
