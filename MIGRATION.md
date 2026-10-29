# v1.0 への移行ガイド

v1.0 では、v0.10 で非推奨にした古い prop と型名を削除しました。v0.10 以降を使っていて、開発中のコンソールに `[kaze] … は … に改名しました` という警告が出ていなければ、そのまま上げられます。

警告が出ていた場合は、下の表のとおりに書き換えてください。どれも名前が変わっただけで、値と挙動は同じです。

## 意味色は `tone` に

| コンポーネント | v0.x | v1.0 |
|---|---|---|
| Badge | `<Badge variant="positive">` | `<Badge tone="positive">` |
| Alert | `<Alert variant="warning">` | `<Alert tone="warning">` |
| Toast | `toast({ title, variant: "negative" })` | `toast({ title, tone: "negative" })` |
| Progress | `<Progress color="info" />` | `<Progress tone="info" />` |
| Meter | `<Meter color="warning" />` | `<Meter tone="warning" />` |
| TimelineItem | `<TimelineItem status="positive" />` | `<TimelineItem tone="positive" />` |
| Tracker | `data={[{ status: "negative" }]}` | `data={[{ tone: "negative" }]}` |

型名も `Tone` にまとめました。

| v0.x | v1.0 |
|---|---|
| `AlertVariant` / `BadgeVariant` / `ToastVariant` / `ProgressColor` / `MeterColor` / `TimelineItemStatus` / `TrackerStatus` | `Tone` |

## 状態と変更通知の名前

| コンポーネント | v0.x | v1.0 |
|---|---|---|
| Dialog | `onClose={() => setOpen(false)}` | `onOpenChange={setOpen}`（閉じるときに `false` が渡る） |
| Dialog | `returnFocusRef` | 削除（閉じたときのフォーカスは自動で開いた要素に戻る） |
| Pagination | `currentPage={3}` | `page={3}`（非制御なら `defaultPage`） |
| Stepper | `currentStep={2}` | `step={2}` |
| Search | `onChange={(value) => …}` | `onValueChange={(value) => …}` |
| NumberField | `onChange={(value) => …}` | `onValueChange={(value) => …}` |

## Tabs は TabGroup で選択を管理する

`Tab` の `active` と `TabPanel` の `selected` を削除しました。選択中のタブは `TabGroup` の `value`（制御）か `defaultValue`（非制御）で決めます。

```tsx
// v0.x
<Tabs>
  <Tab active={tab === "a"} onClick={() => setTab("a")}>A</Tab>
  <Tab active={tab === "b"} onClick={() => setTab("b")}>B</Tab>
</Tabs>
<TabPanel value="a" selected={tab}>…</TabPanel>

// v1.0
<TabGroup value={tab} onValueChange={setTab}>
  <Tabs>
    <Tab value="a">A</Tab>
    <Tab value="b">B</Tab>
  </Tabs>
  <TabPanel value="a">…</TabPanel>
</TabGroup>
```

`TabGroup` で包まずに置いた `Tab` は、常に選択されていない状態で表示されます。

## まとめて置き換えるとき

警告を手がかりに直すのがいちばん確実です。機械的に探すなら、次の正規表現が目安になります（他のコンポーネントの `variant` や `color` も引っかかるので、置き換えは目で確かめてください）。

```text
<(Badge|Alert)\b[^>]*\bvariant=
<(Progress|Meter)\b[^>]*\bcolor=
<TimelineItem\b[^>]*\bstatus=
\b(currentPage|currentStep|returnFocusRef)=
<Dialog\b[^>]*\bonClose=
<(Search|NumberField)\b[^>]*\bonChange=
<Tab\b[^>]*\bactive\b
<TabPanel\b[^>]*\bselected=
```

## v2 で削除予定（現在は非推奨）

v1 の間は動き続け、開発中のコンソールに警告が一度だけ出ます。次のメジャーで削除するので、今のうちに書き換えてください。

| コンポーネント | 今 | 置き換え先 |
|---|---|---|
| Hero | `<Hero badge="v1.1 を公開" …>` | ページ最上部に `AnnouncementBar` を置く（下の例） |

見出しの上のバッジは、キャッチコピーなら外し、お知らせなら Hero から切り離してページの最上部に置きます。

```tsx
// 今
<Navbar … />
<Hero badge="v1.1 を公開しました" title="…" />

// 置き換え後
<AnnouncementBar action={<Link href="/changelog">変更点を見る</Link>}>
  v1.1 を公開しました。
</AnnouncementBar>
<Navbar … />
<Hero title="…" />
```
