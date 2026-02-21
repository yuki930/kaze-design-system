import styles from "./docs.module.css";
import {
  Button,
  Input,
  Select,
  Checkbox,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Metric,
  Avatar,
  Tabs,
  Tab,
  NavItem,
  Divider,
  Search as SearchComponent,
  Logo,
} from "@/components";
import { Tooltip } from "@/components/Tooltip/Tooltip";
import { Icon } from "@/components/Icon/Icon";
import { Navbar, NavbarLinks, NavbarLink } from "@/components/Navbar/Navbar";
import { TopBar } from "@/components/TopBar/TopBar";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@/components/Dropdown/Dropdown";
import { FormField } from "@/components/FormField/FormField";
import { Hero } from "@/components/Hero/Hero";
import { Section, SectionHeader } from "@/components/Section/Section";
import { SplitSection } from "@/components/SplitSection/SplitSection";
import { FeatureGrid, FeatureCard } from "@/components/FeatureGrid/FeatureGrid";
import { Stats, StatItem } from "@/components/Stats/Stats";
import { PricingGrid, PricingCard } from "@/components/Pricing/Pricing";
import { TestimonialGrid, TestimonialCard } from "@/components/Testimonial/Testimonial";
import { FAQ, FAQItem } from "@/components/FAQ/FAQ";
import { CTABanner } from "@/components/CTABanner/CTABanner";
import { LPFooter } from "@/components/LPFooter/LPFooter";
import { Heading } from "@/components/Heading/Heading";
import { Text } from "@/components/Text/Text";
import { Grid } from "@/components/Grid/Grid";
import { List, ListItem } from "@/components/List/List";
import { DescriptionList, DescriptionItem } from "@/components/DescriptionList/DescriptionList";
import { Timeline, TimelineItem } from "@/components/Timeline/Timeline";
import { BarChart } from "@/components/BarChart/BarChart";
import { DonutChart } from "@/components/DonutChart/DonutChart";
import { Sparkline } from "@/components/Sparkline/Sparkline";
import { Alert } from "@/components/Alert/Alert";
import { Progress } from "@/components/Progress/Progress";
import { Switch } from "@/components/Switch/Switch";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Breadcrumb } from "@/components/Breadcrumb/Breadcrumb";
import { Pagination } from "@/components/Pagination/Pagination";
import { Stepper } from "@/components/Stepper/Stepper";
import { Radio, RadioGroup } from "@/components/Radio/Radio";
import { FAB } from "@/components/FAB/FAB";
import { Watermark } from "@/components/Watermark/Watermark";
import { Meter } from "@/components/Meter/Meter";
import { Tracker } from "@/components/Tracker/Tracker";
import { BarList } from "@/components/BarList/BarList";
import { NumberField } from "@/components/NumberField/NumberField";
import {
  Search as SearchIcon,
  Settings,
  Star,
  Heart,
  ChevronDown,
  Home,
  BarChart3,
  Users,
  Zap,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  FileX,
  Plus,
} from "lucide-react";


interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

interface ComponentDoc {
  title: string;
  description: string;
  preview: React.ReactNode;
  props: PropDoc[];
  usage: string;
}

const componentDocs: Record<string, ComponentDoc> = {
  button: {
    title: "Button",
    description: "ボタンコンポーネント",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1.5rem" }}>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            バリアント
          </p>
          <div className={styles.preview}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </div>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            サイズ
          </p>
          <div className={styles.preview} style={{ alignItems: "center" }}>
            <Button variant="primary" size="xs">XS</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
        </div>
      </div>
    ),
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "outline" | "ghost" | "destructive"',
        default: '"primary"',
        description: "ボタンのスタイルバリアント",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg"',
        default: '"md"',
        description: "ボタンのサイズ",
      },
      {
        name: "fullWidth",
        type: "boolean",
        default: "false",
        description: "幅を100%にするかどうか",
      },
      {
        name: "iconOnly",
        type: "boolean",
        default: "false",
        description: "アイコンのみのボタンにするかどうか",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "無効状態にするかどうか",
      },
    ],
    usage: `<Button variant="primary" size="md">ボタン</Button>`,
  },

  input: {
    title: "Input",
    description: "テキスト入力",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1rem", maxWidth: "320px" }}>
        <Input placeholder="デフォルト入力" />
        <Input placeholder="入力してください" />
        <Input placeholder="エラー状態" error />
      </div>
    ),
    props: [
      {
        name: "error",
        type: "boolean",
        default: "false",
        description: "エラー状態を表示するかどうか",
      },
      {
        name: "className",
        type: "string",
        default: "undefined",
        description: "追加のCSSクラス名",
      },
    ],
    usage: `<Input placeholder="入力してください" />`,
  },

  select: {
    title: "Select",
    description: "セレクトボックス",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1rem", maxWidth: "320px" }}>
        <Select>
          <option value="">選択してください</option>
          <option value="1">選択肢1</option>
          <option value="2">選択肢2</option>
          <option value="3">選択肢3</option>
        </Select>
        <Select error>
          <option value="">エラー状態</option>
        </Select>
      </div>
    ),
    props: [
      {
        name: "error",
        type: "boolean",
        default: "false",
        description: "エラー状態を表示するかどうか",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "optionエレメント",
      },
    ],
    usage: `<Select>
  <option>選択肢1</option>
  <option>選択肢2</option>
</Select>`,
  },

  checkbox: {
    title: "Checkbox",
    description: "チェックボックス",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1rem" }}>
        <Checkbox label="未選択" id="cb-unchecked" />
        <Checkbox label="選択済み" checked id="cb-checked" onChange={() => {}} />
      </div>
    ),
    props: [
      {
        name: "label",
        type: "string",
        description: "チェックボックスのラベルテキスト",
      },
      {
        name: "checked",
        type: "boolean",
        default: "false",
        description: "選択状態",
      },
      {
        name: "onChange",
        type: "(e: ChangeEvent) => void",
        description: "変更時のコールバック",
      },
      {
        name: "id",
        type: "string",
        description: "要素のID（labelとの紐付けに使用）",
      },
    ],
    usage: `<Checkbox label="同意する" />`,
  },

  textarea: {
    title: "Textarea",
    description: "テキストエリア",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1rem", maxWidth: "400px" }}>
        <Textarea placeholder="メッセージを入力してください" />
        <Textarea placeholder="エラー状態" error />
      </div>
    ),
    props: [
      {
        name: "error",
        type: "boolean",
        default: "false",
        description: "エラー状態を表示するかどうか",
      },
      {
        name: "className",
        type: "string",
        default: "undefined",
        description: "追加のCSSクラス名",
      },
    ],
    usage: `<Textarea placeholder="メッセージ" />`,
  },

  card: {
    title: "Card",
    description: "カードコンポーネント",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1.5rem", maxWidth: "400px" }}>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>デフォルト</p>
          <Card>
            <CardHeader>
              <CardTitle>カードタイトル</CardTitle>
            </CardHeader>
            <CardBody>
              <p style={{ margin: 0, color: "var(--color-fg-secondary)" }}>
                ボーダー + 白背景のスタンダードなカードです。
              </p>
            </CardBody>
          </Card>
        </div>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>Fill</p>
          <Card variant="fill">
            <CardHeader>
              <CardTitle>背景カード</CardTitle>
            </CardHeader>
            <CardBody>
              <p style={{ margin: 0, color: "var(--color-fg-secondary)" }}>
                ボーダーなし、背景色のみのカードです。
              </p>
            </CardBody>
          </Card>
        </div>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>Interactive</p>
          <Card variant="interactive">
            <CardBody>
              <p style={{ margin: 0, color: "var(--color-fg-secondary)" }}>
                ホバーでボーダーが強調されるカードです。
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    ),
    props: [
      {
        name: "variant",
        type: '"default" | "fill" | "interactive" | "compact"',
        default: '"default"',
        description: "カードのスタイルバリアント",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "カードの内容",
      },
      {
        name: "CardHeader",
        type: "サブコンポーネント",
        description: "カードのヘッダー領域",
      },
      {
        name: "CardTitle",
        type: "サブコンポーネント",
        description: "カードのタイトル",
      },
      {
        name: "CardBody",
        type: "サブコンポーネント",
        description: "カードの本文領域",
      },
      {
        name: "CardFooter",
        type: "サブコンポーネント",
        description: "カードのフッター領域",
      },
    ],
    usage: `{/* デフォルト（ボーダー付き） */}
<Card>
  <CardHeader>
    <CardTitle>タイトル</CardTitle>
  </CardHeader>
  <CardBody>内容</CardBody>
</Card>

{/* Fill（背景のみ、ボーダーなし） */}
<Card variant="fill">
  <CardBody>背景カード</CardBody>
</Card>`,
  },

  badge: {
    title: "Badge",
    description: "バッジ",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1rem" }}>
        <div className={styles.preview}>
          <Badge>デフォルト</Badge>
          <Badge variant="positive">成功</Badge>
          <Badge variant="negative">エラー</Badge>
          <Badge variant="warning">警告</Badge>
          <Badge variant="info">情報</Badge>
        </div>
        <div className={styles.preview}>
          <Badge dot>ドット付き</Badge>
          <Badge variant="positive" dot>オンライン</Badge>
        </div>
        <div className={styles.preview}>
          <Badge solid>デフォルト</Badge>
          <Badge variant="positive" solid>成功</Badge>
          <Badge variant="negative" solid>エラー</Badge>
          <Badge variant="warning" solid>警告</Badge>
          <Badge variant="info" solid>情報</Badge>
        </div>
      </div>
    ),
    props: [
      {
        name: "variant",
        type: '"default" | "positive" | "negative" | "warning" | "info"',
        default: '"default"',
        description: "バッジのスタイルバリアント",
      },
      {
        name: "dot",
        type: "boolean",
        default: "false",
        description: "ドットインジケーターを表示するかどうか",
      },
      {
        name: "solid",
        type: "boolean",
        default: "false",
        description: "反転スタイル（塗り背景 + 白文字）",
      },
    ],
    usage: `<Badge variant="positive">成功</Badge>
<Badge variant="negative" solid>エラー</Badge>`,
  },

  table: {
    title: "Table",
    description: "テーブル",
    preview: (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名前</TableHead>
            <TableHead>メール</TableHead>
            <TableHead>役割</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>田中太郎</TableCell>
            <TableCell>tanaka@example.com</TableCell>
            <TableCell>管理者</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>佐藤花子</TableCell>
            <TableCell>sato@example.com</TableCell>
            <TableCell>編集者</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>鈴木一郎</TableCell>
            <TableCell>suzuki@example.com</TableCell>
            <TableCell>閲覧者</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
    props: [
      {
        name: "Table",
        type: "コンポーネント",
        description: "テーブルのルート要素",
      },
      {
        name: "TableHeader",
        type: "サブコンポーネント",
        description: "テーブルのヘッダー部分（thead）",
      },
      {
        name: "TableBody",
        type: "サブコンポーネント",
        description: "テーブルの本体部分（tbody）",
      },
      {
        name: "TableRow",
        type: "サブコンポーネント",
        description: "テーブルの行（tr）",
      },
      {
        name: "TableHead",
        type: "サブコンポーネント",
        description: "ヘッダーセル（th）",
      },
      {
        name: "TableCell",
        type: "サブコンポーネント",
        description: "データセル（td）",
      },
    ],
    usage: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>名前</TableHead>
      <TableHead>メール</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>田中太郎</TableCell>
      <TableCell>tanaka@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
  },

  tabs: {
    title: "Tabs",
    description: "タブナビゲーション",
    preview: (
      <Tabs>
        <Tab active>タブ1</Tab>
        <Tab>タブ2</Tab>
        <Tab>タブ3</Tab>
      </Tabs>
    ),
    props: [
      {
        name: "active",
        type: "boolean",
        default: "false",
        description: "アクティブ状態かどうか（Tab）",
      },
      {
        name: "onClick",
        type: "() => void",
        description: "クリック時のコールバック（Tab）",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "タブの内容",
      },
    ],
    usage: `<Tabs>
  <Tab active>タブ1</Tab>
  <Tab>タブ2</Tab>
</Tabs>`,
  },

  avatar: {
    title: "Avatar",
    description: "アバター",
    preview: (
      <div className={styles.preview} style={{ alignItems: "center" }}>
        <Avatar
          src="https://i.pravatar.cc/150?img=3"
          alt="ユーザー"
          size="sm"
        />
        <Avatar
          src="https://i.pravatar.cc/150?img=5"
          alt="ユーザー"
          size="md"
        />
        <Avatar fallback="KZ" size="md" />
        <Avatar fallback="TN" size="lg" />
      </div>
    ),
    props: [
      {
        name: "src",
        type: "string",
        description: "アバター画像のURL",
      },
      {
        name: "alt",
        type: "string",
        description: "画像の代替テキスト",
      },
      {
        name: "fallback",
        type: "string",
        description: "画像がない場合に表示するテキスト（イニシャルなど）",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "アバターのサイズ",
      },
    ],
    usage: `<Avatar fallback="KZ" size="md" />`,
  },

  metric: {
    title: "Metric",
    description: "メトリクス表示",
    preview: (
      <div className={styles.preview} style={{ gap: "2rem" }}>
        <Metric label="ユーザー数" value="1,234" />
        <Metric
          label="売上"
          value="1,234,567"
          change={{ value: "+12%", trend: "positive" }}
        />
        <Metric
          label="離脱率"
          value="3.2%"
          change={{ value: "-0.5%", trend: "negative" }}
        />
        <Metric label="総収益" value="¥12,345,678" large />
      </div>
    ),
    props: [
      {
        name: "label",
        type: "string",
        description: "メトリクスのラベル",
      },
      {
        name: "value",
        type: "string",
        description: "表示する値",
      },
      {
        name: "change",
        type: '{ value: string; trend: "positive" | "negative" }',
        description: "変化率の表示",
      },
      {
        name: "large",
        type: "boolean",
        default: "false",
        description: "大きいサイズで表示するかどうか",
      },
    ],
    usage: `<Metric label="売上" value="1,234,567" change={{ value: "+12%", trend: "positive" }} />`,
  },

  dialog: {
    title: "Dialog",
    description: "ダイアログ",
    preview: (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "var(--color-fg-secondary)",
        }}
      >
        <p>
          ダイアログはモーダルウィンドウとして表示されるため、ここではプレビューを省略しています。
        </p>
        <p>
          <code>open</code> プロパティを <code>true</code>{" "}
          にすることで表示されます。
        </p>
      </div>
    ),
    props: [
      {
        name: "open",
        type: "boolean",
        description: "ダイアログの表示状態",
      },
      {
        name: "onClose",
        type: "() => void",
        description: "閉じる時のコールバック",
      },
      {
        name: "title",
        type: "string",
        description: "ダイアログのタイトル",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "ダイアログの内容",
      },
    ],
    usage: `<Dialog open={isOpen} onClose={() => setOpen(false)} title="確認">
  <p>本当に削除しますか？</p>
</Dialog>`,
  },

  tooltip: {
    title: "Tooltip",
    description: "ツールチップ",
    preview: (
      <div className={styles.preview}>
        <Tooltip content="ヘルプテキスト">
          <Button variant="outline">ホバーしてください</Button>
        </Tooltip>
        <Tooltip content="設定を開く" side="bottom">
          <Button variant="secondary">下に表示</Button>
        </Tooltip>
      </div>
    ),
    props: [
      {
        name: "content",
        type: "string",
        description: "ツールチップに表示するテキスト",
      },
      {
        name: "side",
        type: '"top" | "bottom" | "left" | "right"',
        default: '"top"',
        description: "ツールチップの表示位置",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "トリガーとなる要素",
      },
    ],
    usage: `<Tooltip content="ヘルプテキスト">
  <Button>ホバー</Button>
</Tooltip>`,
  },

  dropdown: {
    title: "Dropdown",
    description: "ドロップダウンメニュー",
    preview: (
      <div className={styles.preview}>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="outline">メニューを開く</Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem>プロフィール</DropdownItem>
            <DropdownItem>設定</DropdownItem>
            <DropdownItem>ログアウト</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    ),
    props: [
      {
        name: "Dropdown",
        type: "コンポーネント",
        description: "ドロップダウンのルート要素",
      },
      {
        name: "DropdownTrigger",
        type: "サブコンポーネント",
        description: "ドロップダウンを開くトリガー要素",
      },
      {
        name: "DropdownMenu",
        type: "サブコンポーネント",
        description: "ドロップダウンのメニューコンテナ",
      },
      {
        name: "DropdownItem",
        type: "サブコンポーネント",
        description: "メニューアイテム",
      },
      {
        name: "DropdownSeparator",
        type: "サブコンポーネント",
        description: "メニューアイテム間のセパレーター",
      },
    ],
    usage: `<Dropdown>
  <DropdownTrigger>
    <Button>メニュー</Button>
  </DropdownTrigger>
  <DropdownMenu>
    <DropdownItem>項目1</DropdownItem>
    <DropdownItem>項目2</DropdownItem>
  </DropdownMenu>
</Dropdown>`,
  },

  toast: {
    title: "Toast",
    description: "トースト通知",
    preview: (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "var(--color-fg-secondary)",
        }}
      >
        <p>
          トースト通知は画面の端に一時的に表示されるため、ここではプレビューを省略しています。
        </p>
        <p>
          <code>variant</code> プロパティで通知の種類を指定できます。
        </p>
      </div>
    ),
    props: [
      {
        name: "variant",
        type: '"success" | "error" | "warning" | "info"',
        description: "トーストの種類",
      },
      {
        name: "title",
        type: "string",
        description: "トーストのタイトル",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "トーストの内容",
      },
    ],
    usage: `<Toast variant="success" title="保存完了">
  データが正常に保存されました。
</Toast>`,
  },

  "form-field": {
    title: "FormField",
    description: "フォームフィールド",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1.5rem", maxWidth: "400px" }}>
        <FormField label="名前" description="フルネームを入力してください">
          <Input placeholder="山田太郎" />
        </FormField>
        <FormField label="メールアドレス" required error="正しいメールアドレスを入力してください">
          <Input placeholder="email@example.com" error />
        </FormField>
        <FormField label="自己紹介" maxLength={200} currentLength={45}>
          <Textarea placeholder="自己紹介を入力してください" />
        </FormField>
      </div>
    ),
    props: [
      {
        name: "label",
        type: "string",
        description: "フィールドのラベル",
      },
      {
        name: "description",
        type: "string",
        description: "フィールドの説明テキスト",
      },
      {
        name: "error",
        type: "string",
        description: "エラーメッセージ",
      },
      {
        name: "required",
        type: "boolean",
        default: "false",
        description: "必須フィールドかどうか",
      },
      {
        name: "maxLength",
        type: "number",
        description: "最大文字数（カウンター表示用）",
      },
      {
        name: "currentLength",
        type: "number",
        description: "現在の文字数（カウンター表示用）",
      },
    ],
    usage: `<FormField label="メール" error="入力してください">
  <Input />
</FormField>`,
  },

  icon: {
    title: "Icon",
    description: "アイコン",
    preview: (
      <div className={styles.preview} style={{ alignItems: "center", gap: "1.5rem" }}>
        <div style={{ textAlign: "center" }}>
          <Icon icon={SearchIcon} size="xs" />
          <p style={{ fontSize: "0.75rem", marginTop: "0.25rem", color: "var(--color-fg-secondary)" }}>xs (12px)</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <Icon icon={Settings} size="sm" />
          <p style={{ fontSize: "0.75rem", marginTop: "0.25rem", color: "var(--color-fg-secondary)" }}>sm (14px)</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <Icon icon={Star} size="md" />
          <p style={{ fontSize: "0.75rem", marginTop: "0.25rem", color: "var(--color-fg-secondary)" }}>md (16px)</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <Icon icon={Heart} size="lg" />
          <p style={{ fontSize: "0.75rem", marginTop: "0.25rem", color: "var(--color-fg-secondary)" }}>lg (20px)</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <Icon icon={ChevronDown} size="xl" />
          <p style={{ fontSize: "0.75rem", marginTop: "0.25rem", color: "var(--color-fg-secondary)" }}>xl (24px)</p>
        </div>
      </div>
    ),
    props: [
      {
        name: "icon",
        type: "LucideIcon",
        description: "lucide-react のアイコンコンポーネント",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg" | "xl"',
        default: '"md"',
        description: "アイコンのサイズ（xs=12, sm=14, md=16, lg=20, xl=24）",
      },
      {
        name: "label",
        type: "string",
        description: "アクセシブルラベル（省略時は装飾アイコンとして aria-hidden）",
      },
    ],
    usage: `import { Search, Settings } from "lucide-react";
import { Icon } from "@kaze-ds/react";

<Icon icon={Search} size="md" />
<Icon icon={Settings} size="lg" label="設定" />`,
  },

  sidebar: {
    title: "Sidebar",
    description: "サイドバーナビゲーション",
    preview: (
      <div style={{ position: "relative", height: "280px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Sidebar logo={<Logo size="sm" />} style={{ position: "absolute" }}>
            <NavItem icon={<Home size={18} />} active>ダッシュボード</NavItem>
            <NavItem icon={<BarChart3 size={18} />}>分析</NavItem>
            <NavItem icon={<Users size={18} />}>ユーザー</NavItem>
            <NavItem icon={<Settings size={18} />}>設定</NavItem>
          </Sidebar>
        </div>
      </div>
    ),
    props: [
      {
        name: "logo",
        type: "React.ReactNode",
        description: "サイドバー上部に表示するロゴ要素",
      },
      {
        name: "footer",
        type: "React.ReactNode",
        description: "サイドバー下部のフッター要素",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "ナビゲーション項目など",
      },
    ],
    usage: `<Sidebar logo={<Logo />}>
  <NavItem icon={<Home />} active>ダッシュボード</NavItem>
  <NavItem icon={<Settings />}>設定</NavItem>
</Sidebar>`,
  },

  topbar: {
    title: "TopBar",
    description: "トップバー",
    preview: (
      <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <TopBar actions={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button variant="ghost" size="sm" iconOnly><SearchIcon size={16} /></Button>
            <Button variant="ghost" size="sm" iconOnly><Settings size={16} /></Button>
          </div>
        }>
          <h2 style={{ fontSize: "var(--font-size-base)", fontWeight: 600, margin: 0 }}>ダッシュボード</h2>
        </TopBar>
      </div>
    ),
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        description: "トップバーの主要コンテンツ（タイトルなど）",
      },
      {
        name: "actions",
        type: "React.ReactNode",
        description: "右側に表示するアクション要素",
      },
    ],
    usage: `<TopBar actions={<Button>新規作成</Button>}>
  <h2>ダッシュボード</h2>
</TopBar>`,
  },

  "command-palette": {
    title: "CommandPalette",
    description: "コマンドパレット",
    preview: (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "var(--color-fg-secondary)",
        }}
      >
        <p>コマンドパレットはモーダルオーバーレイとして表示されます。</p>
        <p>
          <code>Cmd+K</code> などのキーボードショートカットで開くのが一般的です。
        </p>
      </div>
    ),
    props: [
      {
        name: "open",
        type: "boolean",
        description: "表示状態",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "表示状態変更時のコールバック",
      },
      {
        name: "commands",
        type: "Command[]",
        description: "コマンドの配列 { id, label, icon?, group?, onSelect }",
      },
      {
        name: "placeholder",
        type: "string",
        default: '"コマンドを検索..."',
        description: "検索入力のプレースホルダー",
      },
    ],
    usage: `<CommandPalette
  open={isOpen}
  onOpenChange={setOpen}
  commands={[
    { id: "1", label: "ホーム", onSelect: () => navigate("/") },
    { id: "2", label: "設定", group: "一般", onSelect: () => navigate("/settings") },
  ]}
/>`,
  },

  layout: {
    title: "AppLayout",
    description: "アプリレイアウト",
    preview: (
      <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden", height: "200px" }}>
        <div style={{ display: "flex", height: "100%" }}>
          <div style={{ width: "60px", background: "var(--color-surface)", borderRight: "1px solid var(--color-border)", display: "flex", flexDirection: "column", alignItems: "center", padding: "0.5rem", gap: "0.5rem" }}>
            <div style={{ width: "32px", height: "32px", background: "var(--color-primary)", borderRadius: "var(--radius-md)", marginBottom: "0.5rem" }} />
            <div style={{ width: "24px", height: "24px", background: "var(--color-bg-tertiary)", borderRadius: "var(--radius-sm)" }} />
            <div style={{ width: "24px", height: "24px", background: "var(--color-bg-tertiary)", borderRadius: "var(--radius-sm)" }} />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ height: "36px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", padding: "0 0.75rem", fontSize: "0.75rem", fontWeight: 600 }}>TopBar</div>
            <div style={{ flex: 1, padding: "0.75rem", background: "var(--color-bg-secondary)", fontSize: "0.75rem", color: "var(--color-fg-secondary)" }}>コンテンツエリア</div>
          </div>
        </div>
      </div>
    ),
    props: [
      {
        name: "sidebar",
        type: "React.ReactNode",
        description: "サイドバー要素",
      },
      {
        name: "topbar",
        type: "React.ReactNode",
        description: "トップバー要素",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "メインコンテンツ",
      },
    ],
    usage: `<AppLayout
  sidebar={<Sidebar logo={<Logo />}>...</Sidebar>}
  topbar={<TopBar>ページタイトル</TopBar>}
>
  <p>メインコンテンツ</p>
</AppLayout>`,
  },

  divider: {
    title: "Divider",
    description: "区切り線",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1.5rem" }}>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>デフォルト</p>
          <Divider />
        </div>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>Subtle</p>
          <Divider subtle />
        </div>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>テキスト付き</p>
          <Divider text="または" />
        </div>
      </div>
    ),
    props: [
      {
        name: "text",
        type: "string",
        description: "中央に表示するテキスト（指定するとテキスト付き区切り線になる）",
      },
      {
        name: "subtle",
        type: "boolean",
        default: "false",
        description: "薄い色のバリアント",
      },
    ],
    usage: `<Divider />
<Divider subtle />
<Divider text="または" />`,
  },

  search: {
    title: "Search",
    description: "検索入力",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1rem", maxWidth: "320px" }}>
        <SearchComponent placeholder="検索..." />
        <SearchComponent placeholder="⌘K で検索" shortcut="⌘K" />
      </div>
    ),
    props: [
      {
        name: "placeholder",
        type: "string",
        description: "プレースホルダーテキスト",
      },
      {
        name: "shortcut",
        type: "string",
        description: "キーボードショートカットの表示テキスト",
      },
      {
        name: "onSearch",
        type: "(value: string) => void",
        description: "検索テキスト変更時のコールバック",
      },
      {
        name: "aria-label",
        type: "string",
        description: "アクセシビリティ用のラベル",
      },
    ],
    usage: `<Search placeholder="検索..." shortcut="⌘K" onSearch={handleSearch} />`,
  },

  logo: {
    title: "Logo",
    description: "ロゴ",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1.5rem" }}>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.75rem" }}>サイズ</p>
          <div className={styles.preview} style={{ alignItems: "center", gap: "2rem" }}>
            <Logo size="sm" />
            <Logo size="md" />
            <Logo size="lg" />
          </div>
        </div>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.75rem" }}>マークのみ</p>
          <div className={styles.preview} style={{ alignItems: "center", gap: "1.5rem" }}>
            <Logo size="sm" showText={false} />
            <Logo size="md" showText={false} />
            <Logo size="lg" showText={false} />
          </div>
        </div>
      </div>
    ),
    props: [
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "ロゴのサイズ",
      },
      {
        name: "showText",
        type: "boolean",
        default: "true",
        description: "テキスト（kaze 風）を表示するかどうか",
      },
    ],
    usage: `<Logo size="md" />
<Logo size="sm" showText={false} />`,
  },

  navbar: {
    title: "Navbar",
    description: "マーケティングサイト用ナビゲーションバー",
    preview: (
      <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <Navbar logo={<Logo size="sm" />} actions={<Button size="sm">はじめる</Button>}>
          <NavbarLinks>
            <NavbarLink href="#" active>機能</NavbarLink>
            <NavbarLink href="#">料金</NavbarLink>
            <NavbarLink href="#">FAQ</NavbarLink>
          </NavbarLinks>
        </Navbar>
      </div>
    ),
    props: [
      { name: "logo", type: "React.ReactNode", description: "ロゴ要素" },
      { name: "actions", type: "React.ReactNode", description: "右側のアクション要素" },
      { name: "transparent", type: "boolean", default: "false", description: "透明背景にするかどうか" },
      { name: "NavbarLinks", type: "サブコンポーネント", description: "ナビリンクのコンテナ" },
      { name: "NavbarLink", type: "サブコンポーネント", description: "個々のナビリンク（active prop 対応）" },
    ],
    usage: `<Navbar logo={<Logo />} actions={<Button>はじめる</Button>}>
  <NavbarLinks>
    <NavbarLink href="/features" active>機能</NavbarLink>
    <NavbarLink href="/pricing">料金</NavbarLink>
  </NavbarLinks>
</Navbar>`,
  },

  hero: {
    title: "Hero",
    description: "ヒーローセクション",
    preview: (
      <Hero title="美しいUIを、もっと速く" subtitle="最小限のコードで最大限のデザインを。" badge="New">
        <Button>はじめる</Button>
        <Button variant="outline">ドキュメント</Button>
      </Hero>
    ),
    props: [
      { name: "title", type: "string", description: "メインタイトル" },
      { name: "subtitle", type: "string", description: "サブタイトル" },
      { name: "badge", type: "string", description: "タイトル上のバッジテキスト" },
      { name: "bg", type: "string", description: '背景色。例: "var(--blue-500)"' },
      { name: "bgImage", type: "string", description: '背景画像 URL または CSS gradient' },
      { name: "overlay", type: "boolean | number", description: "暗めオーバーレイの不透明度。true = 0.5" },
      { name: "children", type: "React.ReactNode", description: "CTAボタンなどのアクション要素" },
    ],
    usage: `<Hero title="メインタイトル" subtitle="説明テキスト" badge="New">
  <Button>はじめる</Button>
</Hero>

{/* 背景色付き */}
<Hero title="タイトル" subtitle="説明" bg="var(--blue-500)">
  <Button>CTA</Button>
</Hero>

{/* 背景画像 + オーバーレイ */}
<Hero title="タイトル" bgImage="url(...)" overlay={0.4}>
  <Button>CTA</Button>
</Hero>`,
  },

  section: {
    title: "Section",
    description: "汎用セクションラッパー",
    preview: (
      <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <Section size="sm">
          <SectionHeader title="セクションタイトル" description="セクションの説明テキストです。" />
          <p style={{ textAlign: "center", color: "var(--color-fg-secondary)", margin: 0 }}>コンテンツエリア</p>
        </Section>
      </div>
    ),
    props: [
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "上下パディングのサイズ" },
      { name: "background", type: '"default" | "muted" | "dark"', default: '"default"', description: "背景色バリアント" },
      { name: "children", type: "React.ReactNode", description: "セクションの内容" },
    ],
    usage: `<Section size="md" background="muted">
  <SectionHeader title="タイトル" description="説明" />
  <FeatureGrid>...</FeatureGrid>
</Section>`,
  },

  "split-section": {
    title: "SplitSection",
    description: "画像＋テキストの左右分割レイアウト。LP の交互セクションに最適。",
    preview: (
      <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <SplitSection mediaBg="linear-gradient(135deg, #e7e4df 0%, #d6d2cc 50%, #a8a29e 100%)">
          <p style={{ fontSize: "var(--font-size-xs)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, color: "var(--color-fg-muted)", margin: 0 }}>機能紹介</p>
          <p style={{ fontSize: "var(--font-size-xl)", fontWeight: 700, margin: 0, lineHeight: "var(--line-height-tight)" }}>左右分割<br />レイアウト</p>
          <p style={{ color: "var(--color-fg-muted)", margin: 0 }}>mediaBg でグラデーションや画像を指定。reverse で左右反転。</p>
        </SplitSection>
      </div>
    ),
    props: [
      { name: "media", type: "React.ReactNode", description: "メディアエリアに表示する要素" },
      { name: "mediaBg", type: "string", description: "メディアエリアの背景（CSS gradient / color）" },
      { name: "reverse", type: "boolean", default: "false", description: "テキスト左・画像右に反転" },
      { name: "children", type: "React.ReactNode", description: "テキストエリアの内容" },
    ],
    usage: `<SplitSection mediaBg="linear-gradient(135deg, #e7e4df, #a8a29e)">
  <Text variant="overline">Philosophy</Text>
  <Text size="2xl" weight="bold">見出しテキスト</Text>
  <Text variant="lead">説明テキスト</Text>
  <Button variant="outline">詳しく見る</Button>
</SplitSection>

<SplitSection mediaBg="..." reverse>
  {/* reverse で左右反転 */}
</SplitSection>`,
  },

  "feature-grid": {
    title: "FeatureGrid",
    description: "機能紹介グリッド",
    preview: (
      <FeatureGrid columns={3}>
        <FeatureCard icon={<Zap size={20} />} title="高速" description="最適化されたCSSで高速な描画" />
        <FeatureCard icon={<SearchIcon size={20} />} title="検索" description="コマンドパレットで素早く操作" />
        <FeatureCard icon={<Star size={20} />} title="高品質" description="細部までこだわったデザイン" />
      </FeatureGrid>
    ),
    props: [
      { name: "columns", type: "2 | 3 | 4", default: "3", description: "カラム数" },
    ],
    usage: `<FeatureGrid columns={3}>
  <FeatureCard icon={<Zap />} title="高速" description="説明テキスト" />
</FeatureGrid>`,
  },

  stats: {
    title: "Stats",
    description: "数値ハイライト",
    preview: (
      <Stats>
        <StatItem value="24+" label="コンポーネント" />
        <StatItem value="100%" label="TypeScript" />
        <StatItem value="0" label="依存関係" />
      </Stats>
    ),
    props: [
      { name: "value", type: "string", description: "数値（StatItem）" },
      { name: "label", type: "string", description: "ラベル（StatItem）" },
    ],
    usage: `<Stats>
  <StatItem value="24+" label="コンポーネント" />
  <StatItem value="100%" label="TypeScript" />
</Stats>`,
  },

  pricing: {
    title: "Pricing",
    description: "料金プラン",
    preview: (
      <PricingGrid>
        <PricingCard name="Free" description="個人利用向け" price="¥0" period="/月" features={["5プロジェクト", "基本コンポーネント"]}>
          <Button variant="outline" fullWidth>はじめる</Button>
        </PricingCard>
        <PricingCard name="Pro" price="¥2,980" period="/月" features={["無制限プロジェクト", "全コンポーネント", "優先サポート"]} featured badge="おすすめ">
          <Button fullWidth>アップグレード</Button>
        </PricingCard>
      </PricingGrid>
    ),
    props: [
      { name: "name", type: "string", description: "プラン名" },
      { name: "price", type: "string", description: "価格" },
      { name: "period", type: "string", description: "課金期間" },
      { name: "features", type: "string[]", description: "機能リスト" },
      { name: "featured", type: "boolean", default: "false", description: "ハイライト表示" },
      { name: "badge", type: "string", description: "バッジテキスト" },
    ],
    usage: `<PricingGrid>
  <PricingCard name="Pro" price="¥2,980" period="/月" features={["機能1", "機能2"]} featured badge="おすすめ">
    <Button fullWidth>選択</Button>
  </PricingCard>
</PricingGrid>`,
  },

  testimonial: {
    title: "Testimonial",
    description: "お客様の声",
    preview: (
      <TestimonialGrid>
        <TestimonialCard quote="Kazeのおかげで開発速度が2倍になりました。" authorName="田中太郎" authorRole="フロントエンドエンジニア" />
        <TestimonialCard quote="ミニマルで美しいデザインシステムです。" authorName="佐藤花子" authorRole="デザイナー" />
      </TestimonialGrid>
    ),
    props: [
      { name: "quote", type: "string", description: "引用テキスト" },
      { name: "authorName", type: "string", description: "著者名" },
      { name: "authorRole", type: "string", description: "役職" },
      { name: "authorImage", type: "string", description: "著者画像URL" },
    ],
    usage: `<TestimonialGrid>
  <TestimonialCard quote="素晴らしいです。" authorName="田中太郎" authorRole="エンジニア" />
</TestimonialGrid>`,
  },

  faq: {
    title: "FAQ",
    description: "よくある質問",
    preview: (
      <FAQ>
        <FAQItem question="Kazeは無料ですか？" answer="はい、MITライセンスで完全無料でご利用いただけます。" />
        <FAQItem question="TypeScriptに対応していますか？" answer="はい、全コンポーネントがTypeScript Strict Modeで型定義されています。" />
      </FAQ>
    ),
    props: [
      { name: "question", type: "string", description: "質問テキスト（FAQItem）" },
      { name: "answer", type: "string", description: "回答テキスト（FAQItem）" },
      { name: "children", type: "React.ReactNode", description: "回答コンテンツ（FAQItem、answerの代替）" },
    ],
    usage: `<FAQ>
  <FAQItem question="質問テキスト" answer="回答テキスト" />
</FAQ>`,
  },

  "cta-banner": {
    title: "CTABanner",
    description: "コール・トゥ・アクション",
    preview: (
      <CTABanner title="今すぐ始めましょう" description="無料で始められます。クレジットカードは不要です。">
        <Button variant="secondary">はじめる</Button>
      </CTABanner>
    ),
    props: [
      { name: "title", type: "string", description: "タイトル" },
      { name: "description", type: "string", description: "説明テキスト" },
      { name: "children", type: "React.ReactNode", description: "アクションボタン" },
    ],
    usage: `<CTABanner title="今すぐ始めましょう" description="無料で始められます。">
  <Button variant="secondary">はじめる</Button>
</CTABanner>`,
  },

  "lp-footer": {
    title: "LPFooter",
    description: "サイトフッター",
    preview: (
      <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <LPFooter
          logo={<Logo size="sm" />}
          description="美しいUIを、もっと速く。"
          columns={[
            { title: "プロダクト", links: [{ label: "機能", href: "#" }, { label: "料金", href: "#" }] },
            { title: "リソース", links: [{ label: "ドキュメント", href: "#" }, { label: "GitHub", href: "#" }] },
          ]}
          bottomLeft={<span>© 2026 Kaze</span>}
        />
      </div>
    ),
    props: [
      { name: "logo", type: "React.ReactNode", description: "ロゴ要素" },
      { name: "description", type: "string", description: "ブランド説明文" },
      { name: "columns", type: "FooterColumn[]", description: "フッターリンク列 { title, links: { label, href }[] }" },
      { name: "bottomLeft", type: "React.ReactNode", description: "フッター下部左側" },
      { name: "bottomRight", type: "React.ReactNode", description: "フッター下部右側" },
    ],
    usage: `<LPFooter
  logo={<Logo />}
  description="ブランド説明"
  columns={[
    { title: "プロダクト", links: [{ label: "機能", href: "/features" }] },
  ]}
  bottomLeft={<span>© 2026 Kaze</span>}
/>`,
  },

  /* ── Typography ──────────────────────────────────────────── */

  heading: {
    title: "Heading",
    description: "セマンティックな見出しコンポーネント。レベル1〜6、説明テキスト、ボーダー付きに対応。",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1.5rem" }}>
        <Heading level={1}>大見出し (h1)</Heading>
        <Heading level={2} description="見出しに説明文を添えることができます">
          中見出し (h2)
        </Heading>
        <Heading level={3}>小見出し (h3)</Heading>
        <Heading level={4}>h4 見出し</Heading>
        <Heading level={5}>h5 見出し</Heading>
        <Heading level={6}>h6 見出し</Heading>
        <Heading level={2} bordered>ボーダー付き見出し</Heading>
      </div>
    ),
    props: [
      { name: "level", type: "1 | 2 | 3 | 4 | 5 | 6", default: "2", description: "見出しレベル（サイズとセマンティクス）" },
      { name: "as", type: '"h1" | "h2" | ... | "h6"', description: "レンダリングするHTML要素を上書き" },
      { name: "description", type: "React.ReactNode", description: "見出し下の説明テキスト" },
      { name: "bordered", type: "boolean", default: "false", description: "下線ボーダーを表示" },
    ],
    usage: `<Heading level={1}>大見出し</Heading>
<Heading level={2} description="補足テキスト">中見出し</Heading>
<Heading level={3} bordered>ボーダー付き</Heading>`,
  },

  text: {
    title: "Text",
    description: "汎用テキストコンポーネント。variant / size / weight / color / align を prop で制御。LP や UI で独自 CSS なしにテキストを扱える。",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1rem" }}>
        <Text variant="overline">Overline — カテゴリラベル</Text>
        <Text variant="lead">Lead — ページやセクションの導入文。大きめのサイズとミュートカラーで読みやすく。</Text>
        <Text>Body — 標準の本文テキストです。デフォルトの variant です。</Text>
        <Text variant="caption">Caption — 補足説明やメタ情報に使う小さめテキスト。</Text>
        <Divider />
        <Text weight="bold">太字テキスト</Text>
        <Text color="primary">プライマリカラー</Text>
        <Text color="positive">成功カラー</Text>
        <Text color="negative">エラーカラー</Text>
        <Text align="center" color="muted">中央揃え・ミュートカラー</Text>
      </div>
    ),
    props: [
      { name: "variant", type: '"body" | "lead" | "caption" | "overline"', default: '"body"', description: "テキストの用途別スタイル" },
      { name: "size", type: '"xs" | "sm" | "base" | "lg" | "xl" | "2xl"', description: "フォントサイズの上書き" },
      { name: "weight", type: '"normal" | "medium" | "semibold" | "bold"', description: "フォントウェイトの上書き" },
      { name: "color", type: '"default" | "muted" | "subtle" | "inherit" | "primary" | "positive" | "warning" | "negative"', default: '"default"', description: "テキストカラー" },
      { name: "align", type: '"left" | "center" | "right"', description: "テキスト揃え" },
      { name: "as", type: '"p" | "span" | "div" | "label" | "small" | "strong" | "em"', default: '"p"', description: "レンダリングする HTML 要素" },
    ],
    usage: `<Text variant="lead">サービスの説明文がここに入ります。</Text>
<Text>通常の本文テキスト。</Text>
<Text variant="caption" color="muted">2024年1月1日 公開</Text>
<Text variant="overline">カテゴリ</Text>
<Text weight="bold" color="primary">重要なテキスト</Text>`,
  },

  grid: {
    title: "Grid",
    description: "レスポンシブ対応のグリッドレイアウト。ブレイクポイントごとのカラム数を prop で制御。",
    preview: (
      <Grid columns={3} columnsMd={2} columnsSm={1} gap="var(--space-4)">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            style={{
              background: "var(--color-bg-secondary)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-6)",
              textAlign: "center",
              fontWeight: 600,
              color: "var(--color-fg-muted)",
            }}
          >
            {n}
          </div>
        ))}
      </Grid>
    ),
    props: [
      { name: "columns", type: "1 | 2 | 3 | 4 | 5 | 6", default: "3", description: "デスクトップ時のカラム数" },
      { name: "columnsMd", type: "1 | 2 | 3 | 4 | 5 | 6", description: "≤1024px 時のカラム数（省略時は columns を継承）" },
      { name: "columnsSm", type: "1 | 2 | 3 | 4 | 5 | 6", description: "≤640px 時のカラム数（省略時は columnsMd を継承）" },
      { name: "gap", type: "string", default: "var(--space-6)", description: "アイテム間のギャップ（CSS値）" },
    ],
    usage: `<Grid columns={3} columnsMd={2} columnsSm={1}>
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</Grid>

<Grid columns={4} columnsSm={2} gap="var(--space-4)">
  {items.map(item => <Card key={item.id}>...</Card>)}
</Grid>`,
  },

  /* ── Lists ───────────────────────────────────────────────── */

  list: {
    title: "List",
    description: "アイテム一覧を表示するリストコンポーネント。アイコン・説明・アクション付き。",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "2rem" }}>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>基本リスト（区切り線あり）</p>
          <List divided>
            <ListItem
              leading={<Star size={16} />}
              title="お気に入り機能"
              description="よく使うアイテムをブックマークできます"
              trailing="新着"
            />
            <ListItem
              leading={<Settings size={16} />}
              title="設定"
              description="アプリケーションの設定を変更"
            />
            <ListItem
              leading={<Users size={16} />}
              title="チームメンバー"
              description="メンバーの管理と招待"
              trailing="5人"
            />
          </List>
        </div>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>インタラクティブ</p>
          <List>
            <ListItem interactive title="クリック可能なアイテム" leading={<Home size={16} />} />
            <ListItem interactive title="ホバーで背景が変わります" leading={<Zap size={16} />} />
          </List>
        </div>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>箇条書き</p>
          <List marker="disc">
            <ListItem title="シンプルなテキストリスト" />
            <ListItem title="マーカー付きの箇条書き" />
            <ListItem title="ドキュメントや説明文に最適" />
          </List>
        </div>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>番号付き</p>
          <List marker="decimal">
            <ListItem title="アカウントを作成する" />
            <ListItem title="プロフィールを設定する" />
            <ListItem title="チームメンバーを招待する" />
          </List>
        </div>
      </div>
    ),
    props: [
      { name: "divided", type: "boolean", default: "false", description: "アイテム間に区切り線を表示（List）" },
      { name: "marker", type: '"disc" | "decimal" | "none"', description: "リストマーカーのスタイル（List）" },
      { name: "leading", type: "React.ReactNode", description: "左側のアイコンなど（ListItem）" },
      { name: "title", type: "React.ReactNode", description: "アイテムのタイトル（ListItem）" },
      { name: "description", type: "React.ReactNode", description: "タイトル下の説明文（ListItem）" },
      { name: "trailing", type: "React.ReactNode", description: "右側の補足テキストやアイコン（ListItem）" },
      { name: "interactive", type: "boolean", default: "false", description: "ホバーエフェクトを有効化（ListItem）" },
    ],
    usage: `{/* アイコン付きリスト */}
<List divided>
  <ListItem
    leading={<Star size={16} />}
    title="お気に入り機能"
    description="よく使うアイテムをブックマーク"
    trailing="新着"
  />
  <ListItem
    leading={<Settings size={16} />}
    title="設定"
    description="アプリの設定を変更"
  />
</List>

{/* 箇条書き */}
<List marker="disc">
  <ListItem title="シンプルなテキスト" />
  <ListItem title="マーカー付き箇条書き" />
</List>

{/* 番号付き */}
<List marker="decimal">
  <ListItem title="手順1" />
  <ListItem title="手順2" />
</List>`,
  },

  "description-list": {
    title: "DescriptionList",
    description: "用語と説明のペアを表示する定義リストコンポーネント。",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "2rem" }}>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>縦並び</p>
          <DescriptionList bordered>
            <DescriptionItem term="プロジェクト名">Kaze Design System</DescriptionItem>
            <DescriptionItem term="バージョン">v0.1.0</DescriptionItem>
            <DescriptionItem term="ライセンス">MIT License</DescriptionItem>
          </DescriptionList>
        </div>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>横並び</p>
          <DescriptionList horizontal>
            <DescriptionItem term="ステータス">公開中</DescriptionItem>
            <DescriptionItem term="最終更新">2026年2月19日</DescriptionItem>
            <DescriptionItem term="コンポーネント数">54</DescriptionItem>
          </DescriptionList>
        </div>
      </div>
    ),
    props: [
      { name: "horizontal", type: "boolean", default: "false", description: "用語と説明を横並びで表示（DescriptionList）" },
      { name: "bordered", type: "boolean", default: "false", description: "各項目に下線ボーダーを表示（DescriptionList）" },
      { name: "term", type: "React.ReactNode", description: "用語・ラベル（DescriptionItem）" },
      { name: "children", type: "React.ReactNode", description: "説明・値（DescriptionItem）" },
    ],
    usage: `{/* 縦並び + ボーダー */}
<DescriptionList bordered>
  <DescriptionItem term="プロジェクト名">Kaze Design System</DescriptionItem>
  <DescriptionItem term="バージョン">v0.1.0</DescriptionItem>
</DescriptionList>

{/* 横並び */}
<DescriptionList horizontal>
  <DescriptionItem term="ラベル">値</DescriptionItem>
</DescriptionList>`,
  },

  timeline: {
    title: "Timeline",
    description: "時系列のイベントを縦に表示するタイムラインコンポーネント。",
    preview: (
      <Timeline>
        <TimelineItem
          time="2026年2月19日"
          title="v0.1.0 リリース"
          description="初回公開バージョン。41コンポーネントを収録。"
          status="positive"
        />
        <TimelineItem
          time="2026年2月15日"
          title="ベータテスト開始"
          description="社内チームによるレビューとフィードバック。"
          status="info"
        />
        <TimelineItem
          time="2026年2月10日"
          title="デザイントークン策定"
          description="カラー、タイポグラフィ、スペーシングの定義。"
        />
        <TimelineItem
          time="2026年2月1日"
          title="プロジェクト開始"
        />
      </Timeline>
    ),
    props: [
      { name: "time", type: "string", description: "タイムスタンプ表示（TimelineItem）" },
      { name: "title", type: "React.ReactNode", description: "イベントのタイトル（TimelineItem）" },
      { name: "description", type: "React.ReactNode", description: "イベントの詳細説明（TimelineItem）" },
      { name: "status", type: '"default" | "positive" | "negative" | "info" | "warning"', default: '"default"', description: "ドットの色（TimelineItem）" },
    ],
    usage: `<Timeline>
  <TimelineItem
    time="2026-02-19"
    title="イベント名"
    description="詳細説明"
    status="positive"
  />
</Timeline>`,
  },

  /* ── Charts ──────────────────────────────────────────────── */

  "bar-chart": {
    title: "BarChart",
    description: "水平棒グラフコンポーネント。データの比較を直感的に表示。",
    preview: (
      <BarChart
        aria-label="フレームワーク別人気度"
        data={[
          { label: "React", value: 85 },
          { label: "Vue", value: 62 },
          { label: "Angular", value: 45 },
          { label: "Svelte", value: 38 },
          { label: "Solid", value: 22 },
        ]}
        formatValue={(v) => `${v}%`}
      />
    ),
    props: [
      { name: "data", type: "BarChartItem[]", description: "{ label, value, color? } の配列" },
      { name: "max", type: "number", description: "最大値（省略時はデータの最大値）" },
      { name: "formatValue", type: "(value: number) => string", description: "値のフォーマット関数" },
    ],
    usage: `<BarChart
  aria-label="フレームワーク別人気度"
  data={[
    { label: "React", value: 85 },
    { label: "Vue", value: 62 },
  ]}
  formatValue={(v) => \`\${v}%\`}
/>`,
  },

  "donut-chart": {
    title: "DonutChart",
    description: "SVGベースのドーナツチャート。凡例とセンターラベル付き。",
    preview: (
      <DonutChart
        aria-label="デバイス別アクセス数"
        data={[
          { label: "デスクトップ", value: 4820 },
          { label: "モバイル", value: 3200 },
          { label: "タブレット", value: 980 },
        ]}
        centerLabel="9,000"
      />
    ),
    props: [
      { name: "data", type: "DonutChartSegment[]", description: "{ label, value, color? } の配列" },
      { name: "size", type: "number", default: "120", description: "SVGのサイズ（px）" },
      { name: "strokeWidth", type: "number", default: "16", description: "リングの太さ" },
      { name: "centerLabel", type: "string", description: "中央に表示するテキスト" },
      { name: "showLegend", type: "boolean", default: "true", description: "凡例を表示するか" },
    ],
    usage: `<DonutChart
  aria-label="デバイス別アクセス数"
  data={[
    { label: "デスクトップ", value: 4820 },
    { label: "モバイル", value: 3200 },
  ]}
  centerLabel="8,020"
/>`,
  },

  sparkline: {
    title: "Sparkline",
    description: "インラインのミニ折れ線グラフ。テーブルやメトリクスの横に配置。",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.875rem" }}>上昇トレンド</span>
          <Sparkline data={[10, 15, 12, 20, 18, 25, 30, 28, 35]} color="var(--chart-emerald)" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.875rem" }}>下降トレンド</span>
          <Sparkline data={[35, 30, 28, 25, 20, 18, 15, 12, 10]} color="var(--chart-red)" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.875rem" }}>エリア付き</span>
          <Sparkline data={[5, 15, 10, 25, 20, 30, 22, 35]} color="var(--chart-blue)" showArea width={120} height={32} />
        </div>
      </div>
    ),
    props: [
      { name: "data", type: "number[]", description: "数値の配列" },
      { name: "width", type: "number", default: "80", description: "SVGの幅" },
      { name: "height", type: "number", default: "24", description: "SVGの高さ" },
      { name: "color", type: "string", default: "var(--chart-emerald)", description: "線の色" },
      { name: "showArea", type: "boolean", default: "false", description: "塗りつぶしエリアを表示" },
    ],
    usage: `<Sparkline
  data={[10, 15, 12, 20, 18, 25]}
  color="var(--chart-emerald)"
  showArea
/>`,
  },

  /* ── Feedback & Status ─────────────────────────────────── */

  alert: {
    title: "Alert",
    description: "ユーザーに重要な情報を伝えるアラートコンポーネント。情報・成功・警告・エラーの4バリアント。",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1rem" }}>
        <Alert variant="info" icon={<Info size={18} />}>
          新しいバージョンが利用可能です。
        </Alert>
        <Alert variant="positive" icon={<CheckCircle size={18} />}>
          データが正常に保存されました。
        </Alert>
        <Alert variant="warning" icon={<AlertTriangle size={18} />}>
          ストレージの使用量が80%を超えています。
        </Alert>
        <Alert variant="negative" icon={<AlertCircle size={18} />}>
          ネットワーク接続に失敗しました。再試行してください。
        </Alert>
        <Alert variant="info" icon={<Info size={18} />} title="お知らせ">
          システムメンテナンスを2月25日に実施します。
        </Alert>
      </div>
    ),
    props: [
      { name: "variant", type: '"info" | "positive" | "warning" | "negative"', default: '"info"', description: "アラートのスタイルバリアント" },
      { name: "icon", type: "React.ReactNode", description: "左側に表示するアイコン" },
      { name: "title", type: "string", description: "アラートのタイトル（太字で表示）" },
      { name: "children", type: "React.ReactNode", description: "アラートの内容" },
    ],
    usage: `<Alert variant="info" icon={<Info size={18} />}>
  新しいバージョンが利用可能です。
</Alert>
<Alert variant="positive" icon={<CheckCircle size={18} />}>
  データが正常に保存されました。
</Alert>
<Alert variant="info" icon={<Info size={18} />} title="お知らせ">
  タイトル付きのアラートです。
</Alert>`,
  },

  progress: {
    title: "Progress",
    description: "処理の進捗状況を視覚的に表示するプログレスバーコンポーネント。サイズ・カラー・ラベル対応。",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1.5rem", maxWidth: "400px" }}>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>サイズ</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Progress value={60} size="sm" />
            <Progress value={60} size="md" />
            <Progress value={60} size="lg" />
          </div>
        </div>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>カラー</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Progress value={80} />
            <Progress value={65} color="positive" />
            <Progress value={45} color="warning" />
            <Progress value={30} color="negative" />
          </div>
        </div>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>ラベル付き</p>
          <Progress value={72} label="アップロード中..." showValue />
        </div>
      </div>
    ),
    props: [
      { name: "value", type: "number", description: "進捗値（0〜100）" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "プログレスバーの高さ" },
      { name: "color", type: '"primary" | "positive" | "warning" | "negative"', default: '"primary"', description: "バーの色" },
      { name: "label", type: "string", description: "バーの上に表示するラベルテキスト" },
      { name: "showValue", type: "boolean", default: "false", description: "パーセンテージ値を表示するかどうか" },
    ],
    usage: `<Progress value={72} label="アップロード中..." showValue />
<Progress value={45} color="warning" size="lg" />`,
  },

  switch: {
    title: "Switch",
    description: "オン・オフを切り替えるトグルスイッチコンポーネント。ラベル付きで使用可能。",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1rem" }}>
        <Switch label="通知を有効にする" />
        <Switch label="ダークモード" defaultChecked />
        <Switch label="無効状態" disabled />
      </div>
    ),
    props: [
      { name: "label", type: "string", description: "スイッチのラベルテキスト" },
      { name: "checked", type: "boolean", description: "制御モード時のオン・オフ状態" },
      { name: "defaultChecked", type: "boolean", default: "false", description: "非制御モード時の初期状態" },
      { name: "disabled", type: "boolean", default: "false", description: "無効状態にするかどうか" },
      { name: "onChange", type: "(checked: boolean) => void", description: "状態変更時のコールバック" },
    ],
    usage: `<Switch label="通知を有効にする" />
<Switch label="ダークモード" defaultChecked onChange={(v) => console.log(v)} />`,
  },

  skeleton: {
    title: "Skeleton",
    description: "コンテンツの読み込み中に表示するスケルトンプレースホルダーコンポーネント。",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1.5rem", maxWidth: "400px" }}>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>テキスト</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Skeleton width="80%" height="1em" />
            <Skeleton width="100%" height="1em" />
            <Skeleton width="60%" height="1em" />
          </div>
        </div>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>円形</p>
          <Skeleton circle width={48} height={48} />
        </div>
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>カード風レイアウト</p>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <Skeleton circle width={40} height={40} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Skeleton width="50%" height="1em" />
              <Skeleton width="100%" height="1em" />
              <Skeleton width="100%" height={80} />
            </div>
          </div>
        </div>
      </div>
    ),
    props: [
      { name: "width", type: "string | number", description: "幅（px または %）" },
      { name: "height", type: "string | number", description: "高さ（px）" },
      { name: "circle", type: "boolean", default: "false", description: "円形にする（border-radius: 50%）" },
    ],
    usage: `<Skeleton width="80%" height="1em" />
<Skeleton circle width={48} height={48} />
<Skeleton width="100%" height={120} />`,
  },

  "empty-state": {
    title: "EmptyState",
    description: "データが存在しない場合に表示する空状態コンポーネント。アイコン・説明・アクション付き。",
    preview: (
      <EmptyState
        icon={<FileX size={48} />}
        title="データがありません"
        description="まだデータが登録されていません。新しいアイテムを追加してください。"
        actions={<Button><Plus size={16} /> 新規作成</Button>}
      />
    ),
    props: [
      { name: "icon", type: "React.ReactNode", description: "中央に表示するアイコン" },
      { name: "title", type: "string", description: "タイトルテキスト" },
      { name: "description", type: "string", description: "説明テキスト" },
      { name: "actions", type: "React.ReactNode", description: "アクションボタンなどの要素" },
    ],
    usage: `<EmptyState
  icon={<FileX size={48} />}
  title="データがありません"
  description="新しいアイテムを追加してください。"
  actions={<Button>新規作成</Button>}
/>`,
  },

  /* ── Navigation ────────────────────────────────────────── */

  breadcrumb: {
    title: "Breadcrumb",
    description: "現在のページ位置を階層的に表示するパンくずリストコンポーネント。",
    preview: (
      <Breadcrumb
        items={[
          { label: "ホーム", href: "#" },
          { label: "プロジェクト", href: "#" },
          { label: "設定" },
        ]}
      />
    ),
    props: [
      { name: "items", type: "BreadcrumbItem[]", description: "パンくずアイテムの配列 { label, href? }" },
    ],
    usage: `<Breadcrumb
  items={[
    { label: "ホーム", href: "/" },
    { label: "プロジェクト", href: "/projects" },
    { label: "設定" },
  ]}
/>`,
  },

  pagination: {
    title: "Pagination",
    description: "ページ分割されたコンテンツをナビゲートするページネーションコンポーネント。",
    preview: (
      <Pagination currentPage={3} totalPages={10} />
    ),
    props: [
      { name: "currentPage", type: "number", description: "現在のページ番号" },
      { name: "totalPages", type: "number", description: "総ページ数" },
      { name: "onPageChange", type: "(page: number) => void", description: "ページ変更時のコールバック" },
      { name: "siblingCount", type: "number", default: "1", description: "現在のページの前後に表示するページ数" },
    ],
    usage: `<Pagination
  currentPage={3}
  totalPages={10}
  onPageChange={(page) => setCurrentPage(page)}
/>`,
  },

  stepper: {
    title: "Stepper",
    description: "複数ステップの進行状況を表示するステッパーコンポーネント。ウィザードやフォームに最適。",
    preview: (
      <Stepper
        currentStep={2}
        steps={[
          { label: "アカウント情報" },
          { label: "プロフィール設定" },
          { label: "確認" },
          { label: "完了" },
        ]}
      />
    ),
    props: [
      { name: "steps", type: "StepperStep[]", description: "ステップの配列 { label }" },
      { name: "currentStep", type: "number", description: "現在のステップ番号（0始まり）" },
    ],
    usage: `<Stepper
  currentStep={2}
  steps={[
    { label: "アカウント情報" },
    { label: "プロフィール設定" },
    { label: "確認" },
    { label: "完了" },
  ]}
/>`,
  },

  radio: {
    title: "Radio",
    description: "ラジオボタン",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1rem" }}>
        <RadioGroup label="お支払い方法" orientation="vertical">
          <Radio label="クレジットカード" name="payment" value="credit" defaultChecked />
          <Radio label="銀行振込" name="payment" value="bank" />
          <Radio label="代金引換" name="payment" value="cod" />
        </RadioGroup>
        <RadioGroup label="配送方法" orientation="horizontal">
          <Radio label="通常配送" name="delivery" value="normal" defaultChecked />
          <Radio label="速達" name="delivery" value="express" />
        </RadioGroup>
      </div>
    ),
    props: [
      { name: "label", type: "string", description: "ラジオボタンのラベル" },
      { name: "error", type: "boolean", default: "false", description: "エラー状態" },
    ],
    usage: `<RadioGroup label="選択肢">
  <Radio label="選択肢A" name="choice" value="a" />
  <Radio label="選択肢B" name="choice" value="b" />
</RadioGroup>`,
  },

  fab: {
    title: "FAB",
    description: "フローティングアクションボタン",
    preview: (
      <div className={styles.preview} style={{ alignItems: "center", gap: "1.5rem", position: "relative", minHeight: "80px" }}>
        <FAB label="追加" position="bottom-right" style={{ position: "relative" }}>
          <Plus size={20} />
        </FAB>
        <FAB label="新規作成" variant="secondary" extended position="bottom-right" style={{ position: "relative" }}>
          <Plus size={20} />
        </FAB>
      </div>
    ),
    props: [
      { name: "label", type: "string", description: "ボタンのアクセシブルラベル（必須）" },
      { name: "variant", type: '"primary" | "secondary"', default: '"primary"', description: "スタイルバリアント" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "ボタンのサイズ" },
      { name: "position", type: '"bottom-right" | "bottom-left" | "top-right" | "top-left"', default: '"bottom-right"', description: "配置位置" },
      { name: "extended", type: "boolean", default: "false", description: "ラベルテキストを表示するかどうか" },
    ],
    usage: `<FAB label="追加">
  <PlusIcon />
</FAB>`,
  },

  watermark: {
    title: "Watermark",
    description: "透かし表示",
    preview: (
      <div style={{ maxWidth: "400px" }}>
        <Watermark text="社外秘">
          <div style={{ padding: "2rem", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "8px" }}>
            <p>このコンテンツの上に透かしが表示されます。機密文書やプレビュー画面などに使用できます。</p>
          </div>
        </Watermark>
      </div>
    ),
    props: [
      { name: "text", type: "string", description: "透かしテキスト（必須）" },
      { name: "fontSize", type: "number", default: "16", description: "フォントサイズ（px）" },
      { name: "rotate", type: "number", default: "-22", description: "回転角度（度）" },
      { name: "gap", type: "number", default: "100", description: "透かし間の間隔（px）" },
      { name: "opacity", type: "number", default: "0.08", description: "透かしの不透明度" },
    ],
    usage: `<Watermark text="社外秘">
  <div>コンテンツ</div>
</Watermark>`,
  },

  meter: {
    title: "Meter",
    description: "メーター（既知範囲の値表示）",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1.5rem", maxWidth: "400px" }}>
        <Meter value={30} label="CPU 使用率" showValue />
        <Meter value={75} label="メモリ使用率" showValue />
        <Meter value={95} label="ディスク使用率" showValue />
      </div>
    ),
    props: [
      { name: "value", type: "number", description: "現在の値（必須）" },
      { name: "min", type: "number", default: "0", description: "最小値" },
      { name: "max", type: "number", default: "100", description: "最大値" },
      { name: "label", type: "string", description: "ラベルテキスト" },
      { name: "showValue", type: "boolean", default: "false", description: "値を表示するか" },
      { name: "color", type: '"default" | "positive" | "negative" | "warning" | "info"', description: "カラーバリアント" },
      { name: "warningThreshold", type: "number", default: "0.7", description: "警告しきい値（0-1）" },
      { name: "dangerThreshold", type: "number", default: "0.9", description: "危険しきい値（0-1）" },
    ],
    usage: `<Meter value={75} label="使用率" showValue />`,
  },

  tracker: {
    title: "Tracker",
    description: "時系列ステータス",
    preview: (
      <div style={{ maxWidth: "500px" }}>
        <Tracker
          data={[
            { status: "positive", tooltip: "正常" },
            { status: "positive", tooltip: "正常" },
            { status: "warning", tooltip: "遅延" },
            { status: "positive", tooltip: "正常" },
            { status: "negative", tooltip: "障害" },
            { status: "positive", tooltip: "正常" },
            { status: "positive", tooltip: "正常" },
            { status: "positive", tooltip: "正常" },
            { status: "warning", tooltip: "遅延" },
            { status: "positive", tooltip: "正常" },
            { status: "positive", tooltip: "正常" },
            { status: "positive", tooltip: "正常" },
          ]}
          label="過去12時間のステータス"
        />
      </div>
    ),
    props: [
      { name: "data", type: "TrackerItem[]", description: "ステータスセグメントの配列（必須）" },
      { name: "label", type: "string", description: "アクセシブルラベル" },
    ],
    usage: `<Tracker
  data={[
    { status: "positive", tooltip: "正常" },
    { status: "warning", tooltip: "遅延" },
    { status: "negative", tooltip: "障害" },
  ]}
  label="サービス稼働状況"
/>`,
  },

  "bar-list": {
    title: "BarList",
    description: "ランキングリスト",
    preview: (
      <div style={{ maxWidth: "400px" }}>
        <BarList
          data={[
            { label: "ワイズサーチ", value: 3420 },
            { label: "直接アクセス", value: 2150 },
            { label: "トークライン", value: 1280 },
            { label: "コードベース", value: 940 },
            { label: "テックノート", value: 520 },
          ]}
          valueFormatter={(v) => `${v.toLocaleString()} 件`}
        />
      </div>
    ),
    props: [
      { name: "data", type: "BarListItem[]", description: "データ配列（必須）" },
      { name: "sortOrder", type: '"ascending" | "descending" | "none"', default: '"descending"', description: "ソート順" },
      { name: "valueFormatter", type: "(value: number) => string", description: "値のフォーマッタ関数" },
    ],
    usage: `<BarList
  data={[
    { label: "ワイズサーチ", value: 3420 },
    { label: "トークライン", value: 1280 },
  ]}
/>`,
  },

  "number-field": {
    title: "NumberField",
    description: "通貨対応数値入力",
    preview: (
      <div className={styles.previewColumn} style={{ gap: "1.5rem", maxWidth: "320px" }}>
        <NumberField label="数量" value={100} />
        <NumberField label="金額" value={15000} currency="JPY" />
        <NumberField label="割引率" value={25} suffix="%" min={0} max={100} />
      </div>
    ),
    props: [
      { name: "value", type: "number | null", description: "現在の数値" },
      { name: "onChange", type: "(value: number | null) => void", description: "値変更時のコールバック" },
      { name: "currency", type: '"JPY" | "USD" | "EUR" | "GBP" | "CNY" | "KRW"', description: "通貨コード" },
      { name: "min", type: "number", description: "最小値" },
      { name: "max", type: "number", description: "最大値" },
      { name: "step", type: "number", default: "1", description: "増減のステップ値" },
      { name: "showStepper", type: "boolean", default: "true", description: "増減ボタンを表示するか" },
      { name: "prefix", type: "string", description: "接頭辞テキスト（通貨で自動設定）" },
      { name: "suffix", type: "string", description: "接尾辞テキスト" },
      { name: "label", type: "string", description: "ラベル" },
      { name: "error", type: "boolean", default: "false", description: "エラー状態" },
    ],
    usage: `<NumberField
  label="金額"
  value={15000}
  currency="JPY"
  onChange={(v) => setValue(v)}
/>`,
  },
};

export function ComponentPage({ name }: { name?: string } = {}) {

  const doc = name ? componentDocs[name] : undefined;

  if (!doc) {
    return (
      <div>
        <h1 className={styles.pageTitle}>コンポーネントが見つかりません</h1>
        <p className={styles.pageDescription}>
          指定されたコンポーネント「{name}」のドキュメントは存在しません。
          コンポーネント一覧から正しいコンポーネントを選択してください。
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>{doc.title}</h1>
      <p className={styles.pageDescription}>{doc.description}</p>

      <h2 className={styles.sectionTitle}>プレビュー</h2>
      {doc.preview}

      <h2 className={styles.sectionTitle}>使い方</h2>
      <pre className={styles.codeBlock}>
        <code>{doc.usage}</code>
      </pre>

      <h2 className={styles.sectionTitle}>プロパティ</h2>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>名前</th>
            <th>型</th>
            <th>デフォルト</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          {doc.props.map((prop) => (
            <tr key={prop.name}>
              <td>
                <code>{prop.name}</code>
              </td>
              <td>
                <code>{prop.type}</code>
              </td>
              <td>{prop.default ? <code>{prop.default}</code> : "—"}</td>
              <td>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
