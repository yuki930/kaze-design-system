import {
  Navbar,
  NavbarLinks,
  NavbarLink,
  Avatar,
  Badge,
  Button,
  Logo,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  Divider,
  Heading,
  DescriptionList,
  DescriptionItem,
} from "@/components";
import { Switch } from "@/components/Switch/Switch";
import { Alert } from "@/components/Alert/Alert";
import { Progress } from "@/components/Progress/Progress";
import { Breadcrumb } from "@/components/Breadcrumb/Breadcrumb";
import {
  Settings,
  User,
  Bell,
  CreditCard,
  Shield,
  Trash2,
  Mail,
  Smartphone,
  Megaphone,
  CheckCircle,
  PenLine,
  Crown,
  HardDrive,
  Users,
  Zap,
} from "lucide-react";

export function SettingsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* ── Navbar ─────────────────────────────────────────── */}
      <Navbar
        logo={<Logo size="sm" />}
        actions={
          <div className="navbar__actions">
            <Button variant="ghost" size="sm">
              ヘルプ
            </Button>
            <Avatar fallback="TY" size="sm" />
          </div>
        }
      >
        <NavbarLinks>
          <NavbarLink href="#">ダッシュボード</NavbarLink>
          <NavbarLink href="#">プロジェクト</NavbarLink>
          <NavbarLink href="#" active>
            設定
          </NavbarLink>
        </NavbarLinks>
      </Navbar>

      {/* ── Main Content ──────────────────────────────────── */}
      <main
        style={{
          maxWidth: "48rem",
          margin: "0 auto",
          padding: "var(--space-8) var(--space-4)",
        }}
      >
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "ホーム", href: "#" },
            { label: "設定" },
          ]}
          style={{ marginBottom: "var(--space-6)" }}
        />

        {/* Page Title */}
        <Heading
          level={1}
          description="アカウントとアプリケーションの設定を管理します"
          style={{ marginBottom: "var(--space-8)" }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
            <Settings size={24} />
            設定
          </span>
        </Heading>

        {/* ── Account Status Alert ────────────────────────── */}
        <Alert
          variant="positive"
          icon={<CheckCircle size={18} />}
          title="アカウントは正常です"
          style={{ marginBottom: "var(--space-8)" }}
        >
          メールアドレスの確認が完了しています。すべての機能をご利用いただけます。
        </Alert>

        {/* ── Profile Section ─────────────────────────────── */}
        <Card style={{ marginBottom: "var(--space-6)" }}>
          <CardHeader>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <User size={18} style={{ color: "var(--color-fg-secondary)" }} />
                <CardTitle>プロフィール</CardTitle>
              </div>
              <Button variant="outline" size="sm">
                <PenLine size={14} />
                編集
              </Button>
            </div>
            <CardDescription>
              公開プロフィール情報を管理します
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div className="settings-profile">
              <Avatar
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face"
                fallback="TY"
                size="lg"
              />
              <DescriptionList
                horizontal
                bordered
                style={{ flex: 1 }}
              >
                <DescriptionItem term="表示名">
                  山田 太郎
                </DescriptionItem>
                <DescriptionItem term="メールアドレス">
                  yamada@example.com
                </DescriptionItem>
                <DescriptionItem term="ユーザーID">
                  @t-yamada
                </DescriptionItem>
                <DescriptionItem term="自己紹介">
                  フロントエンドエンジニア。デザインシステムとアクセシビリティに情熱を持っています。TypeScript / React / CSS が得意です。
                </DescriptionItem>
                <DescriptionItem term="所在地">
                  東京都千代田区
                </DescriptionItem>
                <DescriptionItem term="参加日">
                  2024年4月12日
                </DescriptionItem>
              </DescriptionList>
            </div>
          </CardBody>
        </Card>

        {/* ── Notification Settings ───────────────────────── */}
        <Card style={{ marginBottom: "var(--space-6)" }}>
          <CardHeader>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <Bell size={18} style={{ color: "var(--color-fg-secondary)" }} />
              <CardTitle>通知設定</CardTitle>
            </div>
            <CardDescription>
              受信する通知の種類を選択します
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              {/* Email Notifications */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "2.25rem",
                      height: "2.25rem",
                      borderRadius: "var(--radius-md)",
                      background: "var(--color-bg-secondary)",
                    }}
                  >
                    <Mail size={16} style={{ color: "var(--color-fg-secondary)" }} />
                  </span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 500, color: "var(--color-fg)" }}>
                      メール通知
                    </p>
                    <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--color-fg-secondary)" }}>
                      プロジェクトの更新やコメントをメールで受信
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <Divider subtle />

              {/* Push Notifications */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "2.25rem",
                      height: "2.25rem",
                      borderRadius: "var(--radius-md)",
                      background: "var(--color-bg-secondary)",
                    }}
                  >
                    <Smartphone size={16} style={{ color: "var(--color-fg-secondary)" }} />
                  </span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 500, color: "var(--color-fg)" }}>
                      プッシュ通知
                    </p>
                    <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--color-fg-secondary)" }}>
                      ブラウザのプッシュ通知をリアルタイムで受信
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <Divider subtle />

              {/* Marketing Notifications */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "2.25rem",
                      height: "2.25rem",
                      borderRadius: "var(--radius-md)",
                      background: "var(--color-bg-secondary)",
                    }}
                  >
                    <Megaphone size={16} style={{ color: "var(--color-fg-secondary)" }} />
                  </span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 500, color: "var(--color-fg)" }}>
                      マーケティング通知
                    </p>
                    <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--color-fg-secondary)" }}>
                      新機能やキャンペーン情報をメールで受信
                    </p>
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* ── Plan & Subscription ─────────────────────────── */}
        <Card style={{ marginBottom: "var(--space-6)" }}>
          <CardHeader>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <CreditCard size={18} style={{ color: "var(--color-fg-secondary)" }} />
              <CardTitle>プランと利用状況</CardTitle>
            </div>
            <CardDescription>
              現在のサブスクリプションとリソース使用状況
            </CardDescription>
          </CardHeader>
          <CardBody>
            {/* Current Plan */}
            <div
              className="settings-plan-row"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-primary)",
                    color: "var(--color-primary-fg)",
                    flexShrink: 0,
                  }}
                >
                  <Crown size={18} />
                </span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
                    <p style={{ margin: 0, fontWeight: 600, color: "var(--color-fg)" }}>
                      プロプラン
                    </p>
                    <Badge variant="info">現在のプラン</Badge>
                  </div>
                  <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--color-fg-secondary)" }}>
                    月額 ¥1,980 / 次回請求日: 2026年3月12日
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                プラン変更
              </Button>
            </div>

            {/* Usage Progress Bars */}
            <Heading level={4} style={{ marginBottom: "var(--space-4)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
                <Zap size={16} />
                リソース使用状況
              </span>
            </Heading>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "var(--space-1)",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      fontSize: "var(--font-size-sm)",
                      color: "var(--color-fg-secondary)",
                    }}
                  >
                    <HardDrive size={14} />
                    ストレージ
                  </span>
                  <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-fg-secondary)" }}>
                    7.2 GB / 10 GB
                  </span>
                </div>
                <Progress value={72} color="default" size="sm" />
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "var(--space-1)",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      fontSize: "var(--font-size-sm)",
                      color: "var(--color-fg-secondary)",
                    }}
                  >
                    <Users size={14} />
                    チームメンバー
                  </span>
                  <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-fg-secondary)" }}>
                    8 / 15 人
                  </span>
                </div>
                <Progress value={53} color="info" size="sm" />
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "var(--space-1)",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      fontSize: "var(--font-size-sm)",
                      color: "var(--color-fg-secondary)",
                    }}
                  >
                    <Zap size={14} />
                    API リクエスト (今月)
                  </span>
                  <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-fg-secondary)" }}>
                    45,230 / 50,000
                  </span>
                </div>
                <Progress value={90} color="warning" size="sm" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* ── Security ────────────────────────────────────── */}
        <Card style={{ marginBottom: "var(--space-6)" }}>
          <CardHeader>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <Shield size={18} style={{ color: "var(--color-fg-secondary)" }} />
              <CardTitle>セキュリティ</CardTitle>
            </div>
            <CardDescription>
              アカウントのセキュリティ設定を管理します
            </CardDescription>
          </CardHeader>
          <CardBody>
            <DescriptionList horizontal bordered>
              <DescriptionItem term="パスワード">
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <span style={{ color: "var(--color-fg-secondary)" }}>
                    最終更新: 2025年12月15日
                  </span>
                  <Button variant="outline" size="sm">
                    変更
                  </Button>
                </div>
              </DescriptionItem>
              <DescriptionItem term="二要素認証">
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <Badge variant="positive" dot>有効</Badge>
                  <Button variant="outline" size="sm">
                    設定
                  </Button>
                </div>
              </DescriptionItem>
              <DescriptionItem term="アクティブセッション">
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <span style={{ color: "var(--color-fg-secondary)" }}>
                    3 デバイス
                  </span>
                  <Button variant="outline" size="sm">
                    管理
                  </Button>
                </div>
              </DescriptionItem>
            </DescriptionList>
          </CardBody>
        </Card>

        {/* ── Danger Zone ─────────────────────────────────── */}
        <Card
          style={{
            marginBottom: "var(--space-10)",
            borderColor: "var(--color-negative)",
          }}
        >
          <CardHeader>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <Trash2 size={18} style={{ color: "var(--color-negative)" }} />
              <CardTitle style={{ color: "var(--color-negative)" }}>
                危険エリア
              </CardTitle>
            </div>
            <CardDescription>
              この操作は取り消すことができません。十分にご注意ください。
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div
              className="settings-danger-row"
            >
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 500, color: "var(--color-fg)" }}>
                  アカウントを削除
                </p>
                <p
                  style={{
                    margin: "var(--space-1) 0 0",
                    fontSize: "var(--font-size-sm)",
                    color: "var(--color-fg-secondary)",
                  }}
                >
                  すべてのデータ、プロジェクト、設定が完全に削除されます。この操作は元に戻せません。
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                style={{ flexShrink: 0 }}
              >
                <Trash2 size={14} />
                アカウント削除
              </Button>
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
