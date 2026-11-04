"use client";
import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  DataStatus,
  DescriptionItem,
  DescriptionList,
  EmptyState,
  FormField,
  FormSection,
  Grid,
  Heading,
  Input,
  Metric,
  NumberField,
  SaveBar,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  Toolbar,
  type SaveState,
} from "@/components";

/** Synthetic examples only. Persistence is intentionally owned by this page. */
export function DashboardPatterns() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [budget, setBudget] = useState<number | null>(100000);
  const [saved, setSaved] = useState<number | null>(100000);
  const [state, setState] = useState<SaveState>("idle");
  const [fail, setFail] = useState(false);
  const [available, setAvailable] = useState(false);
  const rows = [
    { name: "定期レポート", status: "完了" },
    { name: "月次レビュー", status: "確認待ち" },
  ].filter((r) => r.name.includes(query) && (!filter || r.status === filter));
  async function save() {
    if (state === "saving") return;
    setState("saving");
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (fail) setState("error");
    else {
      setSaved(budget);
      setState("saved");
    }
  }
  return (
    <Stack gap="xl">
      <Heading
        level={1}
        description="既存部品を組み合わせた画面構成の参考例です。ここでの操作は保存されないサンプルです。"
      >
        ダッシュボードの画面パターン
      </Heading>
      <section>
        <Stack>
          <Heading level={2}>1. 一覧：検索と絞り込みをまとめる</Heading>
          <Text>
            Toolbar
            に検索・絞り込みを置き、件数と条件解除を近くに配置します。複数ページに分ける場合は
            Pagination を追加します。
          </Text>
          <Toolbar
            aria-label="サンプル一覧の絞り込み"
            end={
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setFilter("");
                }}
                disabled={!query && !filter}
              >
                条件を解除
              </Button>
            }
          >
            <FormField label="名前で検索">
              <Input value={query} onChange={(e) => setQuery(e.target.value)} />
            </FormField>
            <FormField label="状態">
              <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="">すべて</option>
                <option>完了</option>
                <option>確認待ち</option>
              </Select>
            </FormField>
          </Toolbar>
          <Text role="status">{rows.length}件</Text>
          {rows.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名前</TableHead>
                  <TableHead>状態</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.name}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              title="条件に一致する項目はありません"
              description="検索語や状態の条件を変えてください。"
            />
          )}
        </Stack>
      </section>
      <section>
        <Stack>
          <Heading level={2}>2. 設定：入力のまとまりと保存状態</Heading>
          <Text>
            FormSection で関連項目をまとめます。SaveBar
            の状態はアプリから渡し、保存に失敗した場合も入力を残します。
          </Text>
          <FormSection
            title="予算"
            description="月あたりの上限を入力してください。"
            disabled={state === "saving"}
          >
            <FormField label="月額上限" required>
              <NumberField
                value={budget}
                min={0}
                currency="JPY"
                onValueChange={(v) => {
                  setBudget(v);
                  setState(v === saved ? "idle" : "dirty");
                }}
              />
            </FormField>
            <FormField label="保存結果のデモ">
              <Select
                value={fail ? "error" : "success"}
                onChange={(e) => setFail(e.target.value === "error")}
              >
                <option value="success">成功</option>
                <option value="error">失敗</option>
              </Select>
            </FormField>
          </FormSection>
          <SaveBar
            state={state}
            disabled={budget === null}
            onSave={save}
            onReset={() => {
              setBudget(saved);
              setState("idle");
            }}
          />
        </Stack>
      </section>
      <section>
        <Stack>
          <Heading level={2}>3. 比較：前提と結果を近くに置く</Heading>
          <Text>
            共通の条件は DescriptionList、比較対象は同じ項目・単位の Card と Metric
            で揃えます。実績と試算は見出しで区別します。
          </Text>
          <DescriptionList horizontal bordered>
            <DescriptionItem term="期間">12 か月</DescriptionItem>
            <DescriptionItem term="月額上限">
              {budget === null ? "未入力" : `${budget.toLocaleString("ja-JP")}円`}
            </DescriptionItem>
            <DescriptionItem term="保存状態">
              {budget === saved ? "保存済みの条件" : "変更中の条件"}
            </DescriptionItem>
          </DescriptionList>
          <Grid columns={2} columnsSm={1}>
            <Card>
              <CardBody>
                <Metric
                  label="現在の条件・年間予算（試算）"
                  value={budget === null ? "未入力" : `${(budget * 12).toLocaleString("ja-JP")}円`}
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Metric
                  label="月額を 10%抑えた年間予算（試算）"
                  value={
                    budget === null
                      ? "未入力"
                      : `${Math.round(budget * 0.9 * 12).toLocaleString("ja-JP")}円`
                  }
                />
              </CardBody>
            </Card>
          </Grid>
        </Stack>
      </section>
      <section>
        <Stack>
          <Heading level={2}>4. データ不足：影響と次の操作</Heading>
          <DataStatus
            status={available ? "available" : "partial"}
            fetchedAt="2026 年 1 月 8 日 10:00 JST"
            asOf={available ? "2026 年 1 月 7 日" : "2026 年 1 月 6 日〜7 日"}
          >
            {available
              ? "サンプルデータの基準日が揃いました。"
              : "一部のデータは前日の値です。取得日時とデータ基準日は異なります。"}
          </DataStatus>
          {!available && (
            <Alert tone="warning" role="status">
              同じ基準日での比較はまだできません。取得済みの内容のみ確認できます。
            </Alert>
          )}
          <Button variant="outline" onClick={() => setAvailable((v) => !v)}>
            {available ? "データ不足の例に戻す" : "データが揃った例を見る"}
          </Button>
        </Stack>
      </section>
      <section>
        <Stack>
          <Heading level={2}>ナビゲーションのグルーピング</Heading>
          <Text>
            同じ目的のページを Sidebar のグループにまとめ、Tabs
            は一つの目的の中で表示を切り替えるときに使います。「その他」への集約より、利用者が探す目的をグループ名にします。具体的な分類は利用アプリで決めます。
          </Text>
          <Heading level={3}>部品の使い分け</Heading>
          <DescriptionList bordered>
            <DescriptionItem term="DataStatus">
              取得と基準の情報。鮮度を自動判定しません。日付・タイムゾーン・欠損範囲はアプリが渡します。
            </DescriptionItem>
            <DescriptionItem term="SaveBar">
              画面内に残す保存状態と操作。保存処理、入力検証、画面を離れる際の制御はアプリが持ちます。
            </DescriptionItem>
            <DescriptionItem term="Alert / Toast">
              対応が必要な説明は Alert、操作完了の一時通知は Toast。SaveBar
              と同じ内容を重ねて読み上げないようにします。
            </DescriptionItem>
            <DescriptionItem term="Skeleton / EmptyState">
              読込中は Skeleton、取得結果が空なら
              EmptyState。未登録と検索結果ゼロは文言と次の操作を分けます。
            </DescriptionItem>
          </DescriptionList>
        </Stack>
      </section>
    </Stack>
  );
}
