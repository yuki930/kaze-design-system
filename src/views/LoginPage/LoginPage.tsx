import { useState } from "react";
import {
  Button,
  Input,
  Checkbox,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Logo,
  Divider,
  FormField,
} from "@/components";
import { Eye, EyeOff } from "lucide-react";
import styles from "./LoginPage.module.css";

/* ── SVG Icon Placeholders for Social Providers ──────────── */

function SocialIconA() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SocialIconB() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 14.93A7.003 7.003 0 0 1 5.07 13H9v-2H5.07A7.003 7.003 0 0 1 13 5.07V9h2V5.07A7.003 7.003 0 0 1 18.93 11H15v2h3.93A7.003 7.003 0 0 1 13 18.93V15h-2v1.93Z" />
    </svg>
  );
}

/* ── Login Page ───────────────────────────────────────────── */

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className={styles.page}>
      {/* ── Subtle background decoration ─────────────────── */}
      <div aria-hidden="true" className={styles.bgOrbTop} />
      <div aria-hidden="true" className={styles.bgOrbBottom} />

      {/* ── Logo ─────────────────────────────────────────── */}
      <div className={styles.logoWrap}>
        <Logo size="lg" />
      </div>

      {/* ── Login Card ───────────────────────────────────── */}
      <Card className={styles.card}>
        <CardHeader className={styles.cardHeaderCenter}>
          <CardTitle>ログイン</CardTitle>
          <p className={styles.subtitle}>
            アカウントにサインインしてください
          </p>
        </CardHeader>

        <CardBody>
          {/* ── Social Login Buttons ───────────────────── */}
          <div className={styles.socialRow}>
            <Button variant="outline" fullWidth>
              <SocialIconA />
              ソーシャルアカウント A
            </Button>
            <Button variant="outline" fullWidth>
              <SocialIconB />
              ソーシャルアカウント B
            </Button>
          </div>

          {/* ── Divider ───────────────────────────────── */}
          <Divider text="または" className={styles.divider} />

          {/* ── Form ──────────────────────────────────── */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className={styles.form}
          >
            {/* Email */}
            <FormField label="メールアドレス" required>
              <Input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>

            {/* Password */}
            <FormField label="パスワード" required>
              <div className={styles.passwordWrap}>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.passwordInput}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                  className={styles.passwordToggle}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormField>

            {/* Remember me + Forgot password */}
            <div className={styles.rememberRow}>
              <Checkbox
                label="ログイン状態を保持"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <a href="#" className={styles.forgotLink}>
                パスワードをお忘れですか？
              </a>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              className={styles.submitBtn}
            >
              ログイン
            </Button>
          </form>
        </CardBody>

        <CardFooter className={styles.cardFooter}>
          <p className={styles.footerText}>
            アカウントをお持ちでない方{" "}
            <a href="#" className={styles.signupLink}>
              新規登録
            </a>
          </p>
        </CardFooter>
      </Card>

      {/* ── Copyright ────────────────────────────────────── */}
      <p className={styles.copyright}>
        &copy; 2026 Kaze Design System. All rights reserved.
      </p>
    </div>
  );
}
