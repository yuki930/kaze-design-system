"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { Button } from "../Button/Button";
import { Drawer, DrawerBody } from "../Drawer/Drawer";
import { useControllableState } from "../_internal/useControllableState";

export interface AppLayoutProps extends HTMLAttributes<HTMLDivElement> {
  sidebar?: ReactNode;
  topbar?: ReactNode;
  children: ReactNode;
  /** 768px 未満でサイドバーを開くドロワーの開閉（制御） */
  navOpen?: boolean;
  /** ドロワーの初期状態（非制御）。既定は閉じている */
  defaultNavOpen?: boolean;
  /** ドロワーの開閉要求。Escape、背景クリック、ドロワー内のリンク、メニューボタンで呼ばれる */
  onNavOpenChange?: (open: boolean) => void;
  /** メニューボタンとドロワーの名前 */
  navLabel?: string;
}

interface AppLayoutNav {
  open: boolean;
  setOpen: (open: boolean) => void;
  label: string;
  panelId: string;
}

/** TopBar が AppLayout の中にいるときだけ値を持つ。メニューボタンを描くかの判断に使う。Internal: barrel には出さない */
export const AppLayoutNavContext = createContext<AppLayoutNav | null>(null);

function MenuIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

/** 768px 未満だけ見えるメニューボタン。TopBar と AppLayout 自身の最小バーが共有する。Internal */
export function AppLayoutMenuButton() {
  const nav = useContext(AppLayoutNavContext);
  if (!nav) return null;
  return (
    <Button
      variant="ghost"
      size="sm"
      iconOnly
      className="app-layout__menu-button"
      aria-label={nav.label}
      aria-haspopup="dialog"
      aria-expanded={nav.open}
      aria-controls={nav.open ? nav.panelId : undefined}
      data-state={nav.open ? "open" : "closed"}
      onClick={() => nav.setOpen(!nav.open)}
    >
      <MenuIcon />
    </Button>
  );
}

export const AppLayout = forwardRef<HTMLDivElement, AppLayoutProps>(
  (
    {
      sidebar,
      topbar,
      children,
      className,
      navOpen,
      defaultNavOpen = false,
      onNavOpenChange,
      navLabel = "メニュー",
      ...rest
    },
    ref,
  ) => {
    const panelId = useId();
    const [open, setOpen] = useControllableState<boolean>({
      value: navOpen,
      defaultValue: defaultNavOpen,
      onChange: onNavOpenChange,
    });
    const hasNav = sidebar != null && sidebar !== false;
    const nav = useMemo<AppLayoutNav | null>(
      () => (hasNav ? { open, setOpen, label: navLabel, panelId } : null),
      [hasNav, open, setOpen, navLabel, panelId],
    );

    // ドロワー内のリンクを押したら、遷移の邪魔にならないよう閉じる
    const closeOnLink = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest("a")) setOpen(false);
      },
      [setOpen],
    );

    return (
      <AppLayoutNavContext.Provider value={nav}>
        <div ref={ref} className={cn("app-layout", className)} {...rest}>
          {sidebar}
          <div className="app-layout__main">
            {topbar ??
              (hasNav && (
                <div className="app-layout__bar">
                  <AppLayoutMenuButton />
                </div>
              ))}
            <main className="app-layout__content">{children}</main>
          </div>
          {hasNav && (
            <Drawer
              id={panelId}
              side="left"
              size="sm"
              open={open}
              onOpenChange={setOpen}
              aria-label={navLabel}
              className="app-layout__drawer"
            >
              <DrawerBody className="app-layout__drawer-body" onClick={closeOnLink}>
                {sidebar}
              </DrawerBody>
            </Drawer>
          )}
        </div>
      </AppLayoutNavContext.Provider>
    );
  },
);

AppLayout.displayName = "AppLayout";
