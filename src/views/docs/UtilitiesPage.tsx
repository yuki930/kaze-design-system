import styles from "./docs.module.css";

export function UtilitiesPage() {
  return (
    <div>
      <h1 className={styles.pageTitle}>CSS ユーティリティ</h1>
      <p className={styles.pageDescription}>
        Kaze は、素早い UI 開発のための包括的な CSS ユーティリティクラスを提供します。
        これらの低レベルなユーティリティクラスを使えば、カスタム CSS を書かずに自由なデザインを構築できます。
        ユーティリティは自由に組み合わせることができ、Kaze コンポーネントと併用できるように設計されています。
      </p>

      {/* ============================================================
          1. ディスプレイ
          ============================================================ */}
      <h2 className={styles.sectionTitle}>ディスプレイ</h2>
      <p>
        要素の表示方法を制御します。これらのクラスは CSS の{" "}
        <span className={styles.inlineCode}>display</span> プロパティに直接対応しています。
      </p>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>.flex</span></td>
            <td><code>display: flex</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.inline-flex</span></td>
            <td><code>display: inline-flex</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.grid</span></td>
            <td><code>display: grid</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.block</span></td>
            <td><code>display: block</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.inline-block</span></td>
            <td><code>display: inline-block</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.hidden</span></td>
            <td><code>display: none</code> を設定</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.preview}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <div
            className="flex"
            style={{
              padding: "8px 16px",
              background: "var(--kaze-color-bg-subtle, #f0f0f0)",
              borderRadius: "4px",
            }}
          >
            .flex
          </div>
          <div
            className="inline-flex"
            style={{
              padding: "8px 16px",
              background: "var(--kaze-color-bg-subtle, #f0f0f0)",
              borderRadius: "4px",
            }}
          >
            .inline-flex
          </div>
          <div
            className="grid"
            style={{
              padding: "8px 16px",
              background: "var(--kaze-color-bg-subtle, #f0f0f0)",
              borderRadius: "4px",
            }}
          >
            .grid
          </div>
          <div
            className="block"
            style={{
              padding: "8px 16px",
              background: "var(--kaze-color-bg-subtle, #f0f0f0)",
              borderRadius: "4px",
            }}
          >
            .block
          </div>
          <div
            className="inline-block"
            style={{
              padding: "8px 16px",
              background: "var(--kaze-color-bg-subtle, #f0f0f0)",
              borderRadius: "4px",
            }}
          >
            .inline-block
          </div>
        </div>
      </div>

      {/* ============================================================
          2. フレックスボックス
          ============================================================ */}
      <h2 className={styles.sectionTitle}>フレックスボックス</h2>
      <p>
        フレックスコンテナ内の方向、折り返し、配置、主軸の配置、ギャップを制御するための
        フレックスボックスユーティリティです。
      </p>

      {/* 方向 */}
      <h3 className={styles.subsectionTitle}>方向</h3>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>.flex-row</span></td>
            <td><code>flex-direction: row</code> を設定（デフォルト）</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.flex-col</span></td>
            <td><code>flex-direction: column</code> を設定</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.preview}>
        <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>
          .flex .flex-row
        </p>
        <div style={{ display: "flex", flexDirection: "row", gap: "8px", marginBottom: "16px" }}>
          <div style={{ padding: "8px 16px", background: "var(--kaze-color-primary-subtle, #e0e7ff)", borderRadius: "4px" }}>1</div>
          <div style={{ padding: "8px 16px", background: "var(--kaze-color-primary-subtle, #e0e7ff)", borderRadius: "4px" }}>2</div>
          <div style={{ padding: "8px 16px", background: "var(--kaze-color-primary-subtle, #e0e7ff)", borderRadius: "4px" }}>3</div>
        </div>
        <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>
          .flex .flex-col
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ padding: "8px 16px", background: "var(--kaze-color-primary-subtle, #e0e7ff)", borderRadius: "4px" }}>1</div>
          <div style={{ padding: "8px 16px", background: "var(--kaze-color-primary-subtle, #e0e7ff)", borderRadius: "4px" }}>2</div>
          <div style={{ padding: "8px 16px", background: "var(--kaze-color-primary-subtle, #e0e7ff)", borderRadius: "4px" }}>3</div>
        </div>
      </div>

      {/* 折り返し */}
      <h3 className={styles.subsectionTitle}>折り返し</h3>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>.flex-wrap</span></td>
            <td><code>flex-wrap: wrap</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.flex-nowrap</span></td>
            <td><code>flex-wrap: nowrap</code> を設定</td>
          </tr>
        </tbody>
      </table>

      {/* 配置 */}
      <h3 className={styles.subsectionTitle}>配置</h3>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>.items-start</span></td>
            <td><code>align-items: flex-start</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.items-center</span></td>
            <td><code>align-items: center</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.items-end</span></td>
            <td><code>align-items: flex-end</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.items-stretch</span></td>
            <td><code>align-items: stretch</code> を設定</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.preview}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minHeight: "80px",
            background: "var(--kaze-color-bg-subtle, #f0f0f0)",
            padding: "8px",
            borderRadius: "4px",
          }}
        >
          <div style={{ padding: "4px 12px", background: "var(--kaze-color-primary-subtle, #e0e7ff)", borderRadius: "4px", height: "30px" }}>小</div>
          <div style={{ padding: "4px 12px", background: "var(--kaze-color-primary-subtle, #e0e7ff)", borderRadius: "4px", height: "60px" }}>大</div>
          <div style={{ padding: "4px 12px", background: "var(--kaze-color-primary-subtle, #e0e7ff)", borderRadius: "4px", height: "40px" }}>中</div>
        </div>
        <p style={{ marginTop: "4px", fontSize: "12px", color: "var(--kaze-color-text-muted, #888)" }}>
          コンテナに .flex .items-center を適用
        </p>
      </div>

      {/* 主軸の配置 */}
      <h3 className={styles.subsectionTitle}>主軸の配置</h3>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>.justify-start</span></td>
            <td><code>justify-content: flex-start</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.justify-center</span></td>
            <td><code>justify-content: center</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.justify-end</span></td>
            <td><code>justify-content: flex-end</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.justify-between</span></td>
            <td><code>justify-content: space-between</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.justify-around</span></td>
            <td><code>justify-content: space-around</code> を設定</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.preview}>
        <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>
          .flex .justify-between
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px",
            background: "var(--kaze-color-bg-subtle, #f0f0f0)",
            borderRadius: "4px",
          }}
        >
          <div style={{ padding: "8px 16px", background: "var(--kaze-color-primary-subtle, #e0e7ff)", borderRadius: "4px" }}>A</div>
          <div style={{ padding: "8px 16px", background: "var(--kaze-color-primary-subtle, #e0e7ff)", borderRadius: "4px" }}>B</div>
          <div style={{ padding: "8px 16px", background: "var(--kaze-color-primary-subtle, #e0e7ff)", borderRadius: "4px" }}>C</div>
        </div>
      </div>

      {/* ギャップ */}
      <h3 className={styles.subsectionTitle}>ギャップ</h3>
      <p>
        ギャップユーティリティは、フレックスまたはグリッドの子要素間のスペースを制御します。
        値は Kaze のスペーシングスケールに従います。
      </p>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <tr key={n}>
              <td><span className={styles.inlineCode}>.gap-{n}</span></td>
              <td><code>gap: {n * 4}px</code> を設定（{n * 0.25}rem）</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.preview}>
        <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>
          .flex .gap-4（16px のギャップ）
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ padding: "8px 16px", background: "var(--kaze-color-primary-subtle, #e0e7ff)", borderRadius: "4px" }}>Item</div>
          <div style={{ padding: "8px 16px", background: "var(--kaze-color-primary-subtle, #e0e7ff)", borderRadius: "4px" }}>Item</div>
          <div style={{ padding: "8px 16px", background: "var(--kaze-color-primary-subtle, #e0e7ff)", borderRadius: "4px" }}>Item</div>
        </div>
      </div>

      {/* ============================================================
          3. グリッド
          ============================================================ */}
      <h2 className={styles.sectionTitle}>グリッド</h2>
      <p>
        カラムユーティリティを使って素早くグリッドレイアウトを作成できます。
        ギャップユーティリティと組み合わせることで、グリッドを細かく制御できます。
      </p>

      <h3 className={styles.subsectionTitle}>カラム数</h3>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>.grid-cols-1</span></td>
            <td><code>grid-template-columns: repeat(1, 1fr)</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.grid-cols-2</span></td>
            <td><code>grid-template-columns: repeat(2, 1fr)</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.grid-cols-3</span></td>
            <td><code>grid-template-columns: repeat(3, 1fr)</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.grid-cols-4</span></td>
            <td><code>grid-template-columns: repeat(4, 1fr)</code> を設定</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.preview}>
        <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>
          .grid .grid-cols-3 .gap-4
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              style={{
                padding: "16px",
                background: "var(--kaze-color-primary-subtle, #e0e7ff)",
                borderRadius: "4px",
                textAlign: "center",
              }}
            >
              {n}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          4. スペーシング
          ============================================================ */}
      <h2 className={styles.sectionTitle}>スペーシング</h2>
      <p>
        一貫したスペーシングスケールでパディングとマージンを制御します。
        値は 0 から 8 まであり、1 ステップあたり 4px（0.25rem）です。
      </p>

      {/* パディング */}
      <h3 className={styles.subsectionTitle}>パディング</h3>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <tr key={n}>
              <td><span className={styles.inlineCode}>.p-{n}</span></td>
              <td>全方向に <code>padding: {n * 4}px</code> を設定</td>
            </tr>
          ))}
          <tr>
            <td><span className={styles.inlineCode}>.px-&#123;n&#125;</span></td>
            <td>水平方向のパディング（<code>padding-left</code> と <code>padding-right</code>）を設定。0 から 8 の値に対応。</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.py-&#123;n&#125;</span></td>
            <td>垂直方向のパディング（<code>padding-top</code> と <code>padding-bottom</code>）を設定。0 から 8 の値に対応。</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.preview}>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
          {[2, 4, 6, 8].map((n) => (
            <div key={n} style={{ background: "var(--kaze-color-bg-subtle, #f0f0f0)", borderRadius: "4px" }}>
              <div
                style={{
                  padding: `${n * 4}px`,
                  background: "var(--kaze-color-primary-subtle, #e0e7ff)",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                .p-{n}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* マージン */}
      <h3 className={styles.subsectionTitle}>マージン</h3>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <tr key={n}>
              <td><span className={styles.inlineCode}>.m-{n}</span></td>
              <td>全方向に <code>margin: {n * 4}px</code> を設定</td>
            </tr>
          ))}
          <tr>
            <td><span className={styles.inlineCode}>.mx-auto</span></td>
            <td><code>margin-left: auto; margin-right: auto</code> を設定し、水平中央揃えにする</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.preview}>
        <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>
          .mx-auto（水平中央揃え）
        </p>
        <div
          style={{
            width: "200px",
            marginLeft: "auto",
            marginRight: "auto",
            padding: "12px",
            background: "var(--kaze-color-primary-subtle, #e0e7ff)",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          .mx-auto
        </div>
      </div>

      {/* ============================================================
          5. タイポグラフィ
          ============================================================ */}
      <h2 className={styles.sectionTitle}>タイポグラフィ</h2>
      <p>
        フォントサイズ、ウェイト、テキスト揃え、カラー、テキストの省略表示を
        タイポグラフィユーティリティクラスで制御します。
      </p>

      {/* フォントサイズ */}
      <h3 className={styles.subsectionTitle}>フォントサイズ</h3>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>.text-xs</span></td>
            <td><code>font-size: 0.75rem</code>（12px）を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.text-sm</span></td>
            <td><code>font-size: 0.875rem</code>（14px）を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.text-base</span></td>
            <td><code>font-size: 1rem</code>（16px）を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.text-lg</span></td>
            <td><code>font-size: 1.125rem</code>（18px）を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.text-xl</span></td>
            <td><code>font-size: 1.25rem</code>（20px）を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.text-2xl</span></td>
            <td><code>font-size: 1.5rem</code>（24px）を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.text-3xl</span></td>
            <td><code>font-size: 1.875rem</code>（30px）を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.text-4xl</span></td>
            <td><code>font-size: 2.25rem</code>（36px）を設定</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.preview}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "0.75rem" }}>.text-xs (12px)</span>
          <span style={{ fontSize: "0.875rem" }}>.text-sm (14px)</span>
          <span style={{ fontSize: "1rem" }}>.text-base (16px)</span>
          <span style={{ fontSize: "1.125rem" }}>.text-lg (18px)</span>
          <span style={{ fontSize: "1.25rem" }}>.text-xl (20px)</span>
          <span style={{ fontSize: "1.5rem" }}>.text-2xl (24px)</span>
          <span style={{ fontSize: "1.875rem" }}>.text-3xl (30px)</span>
          <span style={{ fontSize: "2.25rem" }}>.text-4xl (36px)</span>
        </div>
      </div>

      {/* フォントウェイト */}
      <h3 className={styles.subsectionTitle}>フォントウェイト</h3>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>.font-normal</span></td>
            <td><code>font-weight: 400</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.font-medium</span></td>
            <td><code>font-weight: 500</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.font-semibold</span></td>
            <td><code>font-weight: 600</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.font-bold</span></td>
            <td><code>font-weight: 700</code> を設定</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.preview}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "1.125rem" }}>
          <span style={{ fontWeight: 400 }}>.font-normal (400)</span>
          <span style={{ fontWeight: 500 }}>.font-medium (500)</span>
          <span style={{ fontWeight: 600 }}>.font-semibold (600)</span>
          <span style={{ fontWeight: 700 }}>.font-bold (700)</span>
        </div>
      </div>

      {/* 配置 */}
      <h3 className={styles.subsectionTitle}>配置</h3>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>.text-left</span></td>
            <td><code>text-align: left</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.text-center</span></td>
            <td><code>text-align: center</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.text-right</span></td>
            <td><code>text-align: right</code> を設定</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.preview}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ textAlign: "left", padding: "8px", background: "var(--kaze-color-bg-subtle, #f0f0f0)", borderRadius: "4px" }}>
            .text-left
          </div>
          <div style={{ textAlign: "center", padding: "8px", background: "var(--kaze-color-bg-subtle, #f0f0f0)", borderRadius: "4px" }}>
            .text-center
          </div>
          <div style={{ textAlign: "right", padding: "8px", background: "var(--kaze-color-bg-subtle, #f0f0f0)", borderRadius: "4px" }}>
            .text-right
          </div>
        </div>
      </div>

      {/* テキストカラー */}
      <h3 className={styles.subsectionTitle}>テキストカラー</h3>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>.text-primary</span></td>
            <td>Kaze テーマのプライマリテキストカラーを設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.text-secondary</span></td>
            <td>セカンダリ（控えめ）のテキストカラーを設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.text-muted</span></td>
            <td>低強調のミュートテキストカラーを設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.text-positive</span></td>
            <td>ポジティブ／成功のテキストカラー（緑）を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.text-negative</span></td>
            <td>ネガティブ／エラーのテキストカラー（赤）を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.text-warning</span></td>
            <td>警告のテキストカラー（アンバー／イエロー）を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.text-info</span></td>
            <td>情報のテキストカラー（ブルー）を設定</td>
          </tr>
        </tbody>
      </table>

      {/* 省略表示 */}
      <h3 className={styles.subsectionTitle}>省略表示</h3>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>.truncate</span></td>
            <td>
              はみ出したテキストを省略記号で省略します。{" "}
              <code>overflow: hidden; text-overflow: ellipsis; white-space: nowrap</code> を設定。
            </td>
          </tr>
        </tbody>
      </table>
      <div className={styles.preview}>
        <div
          style={{
            maxWidth: "300px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            padding: "8px",
            background: "var(--kaze-color-bg-subtle, #f0f0f0)",
            borderRadius: "4px",
          }}
        >
          この文章はコンテナの幅を超えると省略記号で省略されます...
        </div>
        <p style={{ marginTop: "4px", fontSize: "12px", color: "var(--kaze-color-text-muted, #888)" }}>
          max-width を設定したコンテナに .truncate を適用
        </p>
      </div>

      {/* ============================================================
          6. ボーダー
          ============================================================ */}
      <h2 className={styles.sectionTitle}>ボーダー</h2>
      <p>
        角丸とボーダーの配置を制御して、要素の形状や視覚的な区切りを設定します。
      </p>

      {/* 角丸 */}
      <h3 className={styles.subsectionTitle}>角丸</h3>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>.rounded-sm</span></td>
            <td><code>border-radius: 2px</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.rounded-md</span></td>
            <td><code>border-radius: 6px</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.rounded-lg</span></td>
            <td><code>border-radius: 8px</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.rounded-xl</span></td>
            <td><code>border-radius: 12px</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.rounded-full</span></td>
            <td><code>border-radius: 9999px</code> を設定（ピル型）</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.preview}>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          {[
            { cls: ".rounded-sm", radius: "2px" },
            { cls: ".rounded-md", radius: "6px" },
            { cls: ".rounded-lg", radius: "8px" },
            { cls: ".rounded-xl", radius: "12px" },
            { cls: ".rounded-full", radius: "9999px" },
          ].map(({ cls, radius }) => (
            <div
              key={cls}
              style={{
                width: "80px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--kaze-color-primary-subtle, #e0e7ff)",
                borderRadius: radius,
                fontSize: "11px",
                textAlign: "center",
              }}
            >
              {cls}
            </div>
          ))}
        </div>
      </div>

      {/* ボーダー線 */}
      <h3 className={styles.subsectionTitle}>ボーダー線</h3>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>.border</span></td>
            <td>テーマのボーダーカラーで全辺に 1px のソリッドボーダーを追加</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.border-t</span></td>
            <td>上辺のみに 1px のソリッドボーダーを追加</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.border-b</span></td>
            <td>下辺のみに 1px のソリッドボーダーを追加</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.preview}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ padding: "12px", border: "1px solid var(--kaze-color-border, #d0d0d0)", borderRadius: "4px" }}>
            .border
          </div>
          <div style={{ padding: "12px", borderTop: "1px solid var(--kaze-color-border, #d0d0d0)" }}>
            .border-t
          </div>
          <div style={{ padding: "12px", borderBottom: "1px solid var(--kaze-color-border, #d0d0d0)" }}>
            .border-b
          </div>
        </div>
      </div>

      {/* ============================================================
          7. シャドウ
          ============================================================ */}
      <h2 className={styles.sectionTitle}>シャドウ</h2>
      <p>
        box-shadow ユーティリティで要素に奥行きと高さを与えます。
        シャドウは極小から特大までスケールします。
      </p>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>.shadow-xs</span></td>
            <td>極小のシャドウでさりげない浮き上がりを表現</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.shadow-sm</span></td>
            <td>小さいシャドウで軽い浮き上がりを表現</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.shadow-md</span></td>
            <td>中程度のシャドウで標準的な浮き上がりを表現</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.shadow-lg</span></td>
            <td>大きいシャドウで目立つ浮き上がりを表現</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.shadow-xl</span></td>
            <td>特大のシャドウで最大の浮き上がりを表現</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.preview}>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {[
            { cls: ".shadow-xs", shadow: "0 1px 2px rgba(0,0,0,0.05)" },
            { cls: ".shadow-sm", shadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)" },
            { cls: ".shadow-md", shadow: "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)" },
            { cls: ".shadow-lg", shadow: "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)" },
            { cls: ".shadow-xl", shadow: "0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)" },
          ].map(({ cls, shadow }) => (
            <div
              key={cls}
              style={{
                width: "100px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--kaze-color-bg-default, #fff)",
                borderRadius: "8px",
                boxShadow: shadow,
                fontSize: "12px",
              }}
            >
              {cls}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          8. 幅
          ============================================================ */}
      <h2 className={styles.sectionTitle}>幅</h2>
      <p>
        割合、キーワード、最大幅のユーティリティクラスで要素の幅を設定します。
      </p>

      <h3 className={styles.subsectionTitle}>幅</h3>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>.w-full</span></td>
            <td><code>width: 100%</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.w-auto</span></td>
            <td><code>width: auto</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.w-1/2</span></td>
            <td><code>width: 50%</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.w-1/3</span></td>
            <td><code>width: 33.333%</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.w-2/3</span></td>
            <td><code>width: 66.667%</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.w-1/4</span></td>
            <td><code>width: 25%</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.w-3/4</span></td>
            <td><code>width: 75%</code> を設定</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.preview}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { cls: ".w-full", width: "100%" },
            { cls: ".w-3/4", width: "75%" },
            { cls: ".w-2/3", width: "66.667%" },
            { cls: ".w-1/2", width: "50%" },
            { cls: ".w-1/3", width: "33.333%" },
            { cls: ".w-1/4", width: "25%" },
          ].map(({ cls, width }) => (
            <div
              key={cls}
              style={{
                width,
                padding: "8px 12px",
                background: "var(--kaze-color-primary-subtle, #e0e7ff)",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              {cls}
            </div>
          ))}
        </div>
      </div>

      <h3 className={styles.subsectionTitle}>最大幅</h3>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>.max-w-sm</span></td>
            <td><code>max-width: 384px</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.max-w-md</span></td>
            <td><code>max-width: 448px</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.max-w-lg</span></td>
            <td><code>max-width: 512px</code> を設定</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.max-w-xl</span></td>
            <td><code>max-width: 576px</code> を設定</td>
          </tr>
        </tbody>
      </table>

      {/* ============================================================
          9. アニメーション
          ============================================================ */}
      <h2 className={styles.sectionTitle}>アニメーション</h2>
      <p>
        要素にあらかじめ用意された CSS アニメーションを追加します。
        すべてのアニメーションユーティリティはユーザーの{" "}
        <span className={styles.inlineCode}>prefers-reduced-motion</span>{" "}
        設定を尊重し、モーション軽減が要求された場合は自動的に無効になります。
      </p>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>.animate-fade-in</span></td>
            <td>透明から不透明にフェードインさせる</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.animate-fade-out</span></td>
            <td>不透明から透明にフェードアウトさせる</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.animate-slide-up</span></td>
            <td>下から上にスライドして表示する</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.animate-slide-down</span></td>
            <td>上から下にスライドして表示する</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.animate-scale-in</span></td>
            <td>小さいサイズから拡大して表示する</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.animate-scale-out</span></td>
            <td>現在のサイズから縮小する</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.animate-spin</span></td>
            <td>360 度の連続回転アニメーション（ローディングインジケーターに最適）</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.animate-pulse</span></td>
            <td>不透明度が連続的に変化するパルスアニメーション</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.preview}>
        <p style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 500 }}>
          アクセシビリティ
        </p>
        <pre className={styles.codeBlock}>
{`/* Kaze のアニメーションは prefers-reduced-motion を自動で尊重します */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-fade-out,
  .animate-slide-up,
  .animate-slide-down,
  .animate-scale-in,
  .animate-scale-out,
  .animate-spin,
  .animate-pulse {
    animation: none;
    transition: none;
  }
}`}
        </pre>
      </div>
      <div className={styles.preview}>
        <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>
          使用例
        </p>
        <pre className={styles.codeBlock}>
{`<div class="animate-fade-in">
  このコンテンツはマウント時にフェードインします。
</div>

<button class="animate-pulse">
  読み込み中...
</button>

<svg class="animate-spin" ...>
  <!-- スピナーアイコン -->
</svg>`}
        </pre>
      </div>

      {/* ============================================================
          10. レスポンシブ
          ============================================================ */}
      <h2 className={styles.sectionTitle}>レスポンシブ</h2>
      <p>
        Kaze はモバイルファーストのレスポンシブプレフィックスシステムを採用しています。
        任意のユーティリティクラスにブレークポイントプレフィックスを付けると、
        そのブレークポイント以上の画面幅でのみ適用されます。
        プレフィックスなしのスタイルはすべての画面サイズに適用されます。
      </p>

      <h3 className={styles.subsectionTitle}>ブレークポイント</h3>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>プレフィックス</th>
            <th>最小幅</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>sm:</span></td>
            <td>640px</td>
            <td>小画面以上（横向きスマートフォン）</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>md:</span></td>
            <td>768px</td>
            <td>中画面以上（タブレット）</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>lg:</span></td>
            <td>1024px</td>
            <td>大画面以上（デスクトップ）</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>xl:</span></td>
            <td>1280px</td>
            <td>特大画面以上（ワイドデスクトップ）</td>
          </tr>
        </tbody>
      </table>

      <h3 className={styles.subsectionTitle}>使い方</h3>
      <p>
        任意のユーティリティクラスの前にブレークポイント名とコロンを付けます。
        そのユーティリティは、指定したブレークポイントの最小幅以上でのみ有効になります。
      </p>
      <div className={styles.preview}>
        <pre className={styles.codeBlock}>
{`<!-- モバイルでは縦積み、中画面で 3 カラム、大画面で非表示 -->
<div class="flex flex-col md:grid md:grid-cols-3 lg:hidden">
  ...
</div>

<!-- モバイルで全幅、小画面で半分、中画面で 3 分の 1 -->
<div class="w-full sm:w-1/2 md:w-1/3">
  ...
</div>

<!-- モバイルで縦方向、小画面で横方向のレイアウト -->
<nav class="flex flex-col sm:flex-row gap-2 sm:gap-4">
  ...
</nav>`}
        </pre>
      </div>

      <h3 className={styles.subsectionTitle}>よく使うパターン</h3>
      <table className={styles.propsTable}>
        <thead>
          <tr>
            <th>クラス</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className={styles.inlineCode}>.md:grid-cols-3</span></td>
            <td>中画面以上で 3 カラムのグリッドレイアウトを適用</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.lg:hidden</span></td>
            <td>大画面以上で要素を非表示にする</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.sm:flex-col</span></td>
            <td>小画面以上でフレックス方向を縦に切り替え</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.xl:gap-8</span></td>
            <td>特大画面でより大きなギャップを適用</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.md:text-lg</span></td>
            <td>中画面以上でフォントサイズを拡大</td>
          </tr>
          <tr>
            <td><span className={styles.inlineCode}>.sm:px-4</span></td>
            <td>小画面以上で水平パディングを追加</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.preview}>
        <p style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>
          レスポンシブカードグリッドの例
        </p>
        <pre className={styles.codeBlock}>
{`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <div class="p-4 rounded-lg shadow-sm">Card 1</div>
  <div class="p-4 rounded-lg shadow-sm">Card 2</div>
  <div class="p-4 rounded-lg shadow-sm">Card 3</div>
  <div class="p-4 rounded-lg shadow-sm">Card 4</div>
</div>`}
        </pre>
      </div>
    </div>
  );
}
