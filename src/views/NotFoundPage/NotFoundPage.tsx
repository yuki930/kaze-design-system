import { Button, Logo } from "@/components";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import styles from "./NotFoundPage.module.css";

/* ── NotFoundPage (404) ──────────────────────────────────────── */

export function NotFoundPage() {
  return (
    <div className={styles.page}>
      {/* ── Subtle background decoration ───────────────────────── */}
      <div aria-hidden="true" className={styles.bgGradient} />
      {/* Secondary accent orb */}
      <div aria-hidden="true" className={styles.bgOrb} />

      {/* ── Main content ───────────────────────────────────────── */}
      <div className={styles.content}>
        {/* Large 404 number */}
        <span className={styles.errorCode}>404</span>

        {/* EmptyState message */}
        <EmptyState
          title="お探しのページが見つかりません"
          description="申し訳ございません。お探しのページは移動、削除されたか、URLが正しくない可能性があります。以下のリンクからお探しの情報にアクセスしてください。"
          actions={
            <div className={styles.actions}>
              <Button size="lg" onClick={() => (window.location.href = "/")}>
                ホームに戻る
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => (window.location.href = "/contact")}
              >
                サポートに連絡
              </Button>
            </div>
          }
        />

        {/* ── Logo at the bottom ───────────────────────────────── */}
        <div className={styles.logoWrap}>
          <Logo size="sm" />
        </div>
      </div>
    </div>
  );
}
