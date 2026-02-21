import { useState, useCallback, useRef } from "react";
import {
  Button,
  Card,
  Badge,
  Input,
  Tabs,
  Tab,
  Divider,
  Avatar,
  Checkbox,
  Text,
} from "@/components";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@/components/Dropdown/Dropdown";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/Dialog/Dialog";
import { ToastProvider, useToast } from "@/components/Toast/Toast";
import { useTheme } from "@/hooks";
import styles from "./JobSearchPage.module.css";
import bottomBarStyles from "../bottomBar.module.css";
import {
  Search,
  Moon,
  Sun,
  Briefcase,
  MapPin,
  Clock,
  Compass,
  User,
  Bookmark,
  BookmarkCheck,
  Banknote,
  SlidersHorizontal,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────────── */

type JobType = "fulltime" | "contract" | "parttime" | "freelance";
type Category = "engineer" | "design" | "marketing" | "sales" | "pm" | "other";
type BottomTab = "search" | "saved" | "applied" | "profile";
type SortKey = "newest" | "salary-desc" | "salary-asc";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  salaryMin: number;
  jobType: JobType;
  category: Category;
  tags: string[];
  postedDaysAgo: number;
  saved: boolean;
  applied: boolean;
  isNew: boolean;
}

/* ── Seed data ─────────────────────────────────────────────── */

const initialJobs: Job[] = [
  {
    id: "1",
    title: "シニアフロントエンドエンジニア",
    company: "テックスタート株式会社",
    location: "東京・渋谷",
    salary: "800〜1,200万円",
    salaryMin: 800,
    jobType: "fulltime",
    category: "engineer",
    tags: ["React", "TypeScript", "リモート可"],
    postedDaysAgo: 1,
    saved: true,
    applied: false,
    isNew: true,
  },
  {
    id: "2",
    title: "UIデザイナー",
    company: "クリエイティブラボ合同会社",
    location: "東京・目黒",
    salary: "500〜700万円",
    salaryMin: 500,
    jobType: "fulltime",
    category: "design",
    tags: ["UIデザイン", "デザインシステム", "週3リモート"],
    postedDaysAgo: 2,
    saved: false,
    applied: false,
    isNew: true,
  },
  {
    id: "3",
    title: "バックエンドエンジニア（Go）",
    company: "ファイナンスプラス株式会社",
    location: "東京・大手町",
    salary: "700〜1,000万円",
    salaryMin: 700,
    jobType: "fulltime",
    category: "engineer",
    tags: ["Go", "クラウド", "マイクロサービス"],
    postedDaysAgo: 3,
    saved: false,
    applied: true,
    isNew: false,
  },
  {
    id: "4",
    title: "プロダクトマネージャー",
    company: "SaaSフォース株式会社",
    location: "大阪・梅田",
    salary: "600〜900万円",
    salaryMin: 600,
    jobType: "fulltime",
    category: "pm",
    tags: ["BtoB SaaS", "アジャイル", "フルリモート"],
    postedDaysAgo: 3,
    saved: true,
    applied: false,
    isNew: false,
  },
  {
    id: "5",
    title: "マーケティングディレクター",
    company: "グロースハック株式会社",
    location: "東京・六本木",
    salary: "700〜950万円",
    salaryMin: 700,
    jobType: "fulltime",
    category: "marketing",
    tags: ["デジタル広告", "CRM", "チームマネジメント"],
    postedDaysAgo: 5,
    saved: false,
    applied: false,
    isNew: false,
  },
  {
    id: "6",
    title: "フロントエンド開発（業務委託）",
    company: "モバイルワークス株式会社",
    location: "フルリモート",
    salary: "月80〜100万円",
    salaryMin: 960,
    jobType: "freelance",
    category: "engineer",
    tags: ["React Native", "TypeScript", "週4日"],
    postedDaysAgo: 1,
    saved: false,
    applied: false,
    isNew: true,
  },
  {
    id: "7",
    title: "インサイドセールス",
    company: "クラウドセキュリティ株式会社",
    location: "東京・品川",
    salary: "450〜650万円",
    salaryMin: 450,
    jobType: "fulltime",
    category: "sales",
    tags: ["SaaS", "法人営業", "インセンティブ有"],
    postedDaysAgo: 7,
    saved: false,
    applied: false,
    isNew: false,
  },
  {
    id: "8",
    title: "データエンジニア",
    company: "アナリティクスジャパン株式会社",
    location: "東京・丸の内",
    salary: "650〜900万円",
    salaryMin: 650,
    jobType: "fulltime",
    category: "engineer",
    tags: ["Python", "BigQuery", "dbt"],
    postedDaysAgo: 4,
    saved: true,
    applied: false,
    isNew: false,
  },
  {
    id: "9",
    title: "UXリサーチャー（契約社員）",
    company: "ユーザーファースト株式会社",
    location: "福岡・天神",
    salary: "400〜550万円",
    salaryMin: 400,
    jobType: "contract",
    category: "design",
    tags: ["ユーザーテスト", "定量分析", "リモート可"],
    postedDaysAgo: 6,
    saved: false,
    applied: false,
    isNew: false,
  },
  {
    id: "10",
    title: "テックリード",
    company: "ネクストイノベーション株式会社",
    location: "東京・恵比寿",
    salary: "1,000〜1,500万円",
    salaryMin: 1000,
    jobType: "fulltime",
    category: "engineer",
    tags: ["アーキテクチャ設計", "チームビルド", "フルリモート"],
    postedDaysAgo: 2,
    saved: false,
    applied: false,
    isNew: true,
  },
];

/* ── Helpers ───────────────────────────────────────────────── */

const jobTypeConfig: Record<JobType, { label: string; variant: "info" | "positive" | "warning" | "default" }> = {
  fulltime: { label: "正社員", variant: "info" },
  contract: { label: "契約社員", variant: "warning" },
  parttime: { label: "パート", variant: "default" },
  freelance: { label: "業務委託", variant: "positive" },
};

const tabConfig: Record<BottomTab, { label: string; icon: typeof Search }> = {
  search: { label: "検索", icon: Compass },
  saved: { label: "保存済み", icon: Bookmark },
  applied: { label: "応募済み", icon: Briefcase },
  profile: { label: "プロフィール", icon: User },
};

const sortLabels: Record<SortKey, string> = {
  newest: "新着順",
  "salary-desc": "給与が高い順",
  "salary-asc": "給与が低い順",
};

type CategoryFilter = "all" | Category;

function getCompanyInitial(name: string): string {
  return name.slice(0, 1);
}

/* ── Skeleton card ─────────────────────────────────────────── */

function JobCardSkeleton() {
  return (
    <Card variant="fill" className={styles.jobCard}>
      <div className={styles.jobInner}>
        <div className={styles.jobTopRow}>
          <div className={styles.companyRow}>
            <Skeleton circle width={28} height={28} />
            <Skeleton width={120} height={14} />
          </div>
        </div>
        <Skeleton width="80%" height={18} />
        <Skeleton width="40%" height={16} />
        <div className={styles.jobMeta}>
          <Skeleton width={80} height={12} />
          <Skeleton width={60} height={12} />
        </div>
        <div className={styles.tagRow}>
          <Skeleton width={50} height={22} />
          <Skeleton width={70} height={22} />
          <Skeleton width={60} height={22} />
        </div>
      </div>
    </Card>
  );
}

/* ── Inner component (needs ToastProvider) ──────────────────── */

function JobSearchInner() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [activeTab, setActiveTab] = useState<BottomTab>("search");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [loading, setLoading] = useState(false);

  /* ── Filter Dialog state ────────────────────────────────── */
  const [filterOpen, setFilterOpen] = useState(false);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const [jobTypeFilter, setJobTypeFilter] = useState<JobType[]>([]);

  /* ── Derived ──────────────────────────────────────────────── */

  const filteredJobs = jobs
    .filter((job) => {
      if (activeTab === "saved" && !job.saved) return false;
      if (activeTab === "applied" && !job.applied) return false;
      if (categoryFilter !== "all" && job.category !== categoryFilter) return false;
      if (jobTypeFilter.length > 0 && !jobTypeFilter.includes(job.jobType)) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const searchable = `${job.title} ${job.company} ${job.location} ${job.tags.join(" ")}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortKey === "newest") return a.postedDaysAgo - b.postedDaysAgo;
      if (sortKey === "salary-desc") return b.salaryMin - a.salaryMin;
      return a.salaryMin - b.salaryMin;
    });

  const savedCount = jobs.filter((j) => j.saved).length;
  const appliedCount = jobs.filter((j) => j.applied).length;
  const activeFilterCount = jobTypeFilter.length;

  /* ── Actions ──────────────────────────────────────────────── */

  const toggleSave = useCallback(
    (id: string) => {
      setJobs((prev) => {
        const target = prev.find((j) => j.id === id);
        const willSave = target ? !target.saved : false;
        toast({
          title: willSave ? "求人を保存しました" : "保存を解除しました",
          variant: "default",
          duration: 2000,
        });
        return prev.map((j) => (j.id === id ? { ...j, saved: !j.saved } : j));
      });
    },
    [toast],
  );

  const toggleApply = useCallback(
    (id: string) => {
      setJobs((prev) => {
        const target = prev.find((j) => j.id === id);
        if (target?.applied) return prev;
        toast({
          title: "応募しました",
          description: target?.title,
          variant: "positive",
        });
        return prev.map((j) => (j.id === id ? { ...j, applied: true } : j));
      });
    },
    [toast],
  );

  const toggleJobTypeFilter = useCallback((jt: JobType) => {
    setJobTypeFilter((prev) =>
      prev.includes(jt) ? prev.filter((k) => k !== jt) : [...prev, jt],
    );
  }, []);

  const applyFilter = useCallback(() => {
    setFilterOpen(false);
    // simulate loading
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  }, []);

  const resetFilter = useCallback(() => {
    setJobTypeFilter([]);
  }, []);

  /* ── Render ──────────────────────────────────────────────── */

  return (
    <div className={styles.app}>
      {/* ── Header ──────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Briefcase size={22} />
          <Text as="span" size="xl" weight="bold">求人検索</Text>
        </div>
        <div className={styles.headerRight}>
          <Badge variant="info">{filteredJobs.length} 件</Badge>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            onClick={toggleTheme}
            aria-label="テーマ切替"
          >
            {resolvedTheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </Button>
        </div>
      </header>

      {/* ── Search bar ────────────────────────────────────── */}
      <div className={styles.searchBar}>
        <div className={styles.searchInputWrap}>
          <Search size={16} className={styles.searchIcon} />
          <Input
            placeholder="職種、キーワード、会社名..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Sort dropdown */}
        <Dropdown>
          <DropdownTrigger>
            <Button variant="outline" size="sm" iconOnly aria-label="並び替え">
              <ArrowUpDown size={16} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            {(Object.keys(sortLabels) as SortKey[]).map((key) => (
              <DropdownItem
                key={key}
                onSelect={() => setSortKey(key)}
              >
                {sortLabels[key]}{sortKey === key ? " ✓" : ""}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        {/* Filter button */}
        <Button
          ref={filterBtnRef}
          variant="outline"
          size="sm"
          iconOnly
          aria-label="フィルター"
          onClick={() => setFilterOpen(true)}
          className={activeFilterCount > 0 ? styles.filterBtnActive : undefined}
        >
          <SlidersHorizontal size={16} />
        </Button>
      </div>

      {/* ── Category tabs ──────────────────────────────────── */}
      <div className={styles.categoryRow}>
        <Tabs>
          <Tab active={categoryFilter === "all"} onClick={() => setCategoryFilter("all")}>
            すべて
          </Tab>
          <Tab active={categoryFilter === "engineer"} onClick={() => setCategoryFilter("engineer")}>
            エンジニア
          </Tab>
          <Tab active={categoryFilter === "design"} onClick={() => setCategoryFilter("design")}>
            デザイン
          </Tab>
          <Tab active={categoryFilter === "pm"} onClick={() => setCategoryFilter("pm")}>
            PM
          </Tab>
          <Tab active={categoryFilter === "marketing"} onClick={() => setCategoryFilter("marketing")}>
            営業・マーケ
          </Tab>
        </Tabs>
      </div>

      {/* ── Main scrollable area ────────────────────────────── */}
      <main className={styles.main}>
        {loading ? (
          <ul className={styles.jobList}>
            {[1, 2, 3, 4].map((i) => (
              <li key={i}><JobCardSkeleton /></li>
            ))}
          </ul>
        ) : filteredJobs.length === 0 ? (
          <EmptyState
            icon={<Search size={40} />}
            title="条件に合う求人が見つかりません"
            description="検索条件を変更してお試しください。"
          />
        ) : (
          <ul className={styles.jobList}>
            {filteredJobs.map((job) => (
              <li key={job.id}>
                <Card variant="fill" className={styles.jobCard}>
                  <div className={styles.jobInner}>
                    {/* top row: company + save */}
                    <div className={styles.jobTopRow}>
                      <div className={styles.companyRow}>
                        <Avatar
                          size="xs"
                          fallback={getCompanyInitial(job.company)}
                        />
                        <Text as="span" size="xs" color="muted" className={styles.companyName}>{job.company}</Text>
                      </div>
                      <button
                        type="button"
                        className={`${styles.saveBtn} ${job.saved ? styles.saveBtnActive : ""}`}
                        onClick={() => toggleSave(job.id)}
                        aria-label={job.saved ? "保存済み" : "保存する"}
                      >
                        {job.saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                      </button>
                    </div>

                    {/* title */}
                    <div className={styles.jobTitle}>
                      <Text as="span" weight="semibold">{job.title}</Text>
                      {job.isNew && (
                        <Badge variant="negative" className={styles.newBadge}>
                          NEW
                        </Badge>
                      )}
                    </div>

                    {/* salary (独立行で強調) */}
                    <div className={styles.salaryRow}>
                      <Banknote size={15} />
                      <Text as="span" size="sm" weight="semibold" color="primary">{job.salary}</Text>
                    </div>

                    {/* meta row */}
                    <div className={styles.jobMeta}>
                      <Text as="span" size="xs" color="subtle" className={styles.metaItem}>
                        <MapPin size={13} />
                        {job.location}
                      </Text>
                      <Text as="span" size="xs" color="subtle" className={styles.metaItem}>
                        <Clock size={13} />
                        {job.postedDaysAgo === 1
                          ? "昨日"
                          : `${job.postedDaysAgo}日前`}
                      </Text>
                    </div>

                    {/* tags */}
                    <div className={styles.tagRow}>
                      <Badge variant={jobTypeConfig[job.jobType].variant}>
                        {jobTypeConfig[job.jobType].label}
                      </Badge>
                      {job.tags.map((tag) => (
                        <Badge key={tag} variant="default">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* CTA row */}
                    <Divider subtle />
                    <div className={styles.actionRow}>
                      <Button variant="ghost" size="sm">
                        <ExternalLink size={14} />
                        詳細
                      </Button>
                      {job.applied ? (
                        <Badge variant="positive">応募済み</Badge>
                      ) : (
                        <Button size="sm" onClick={() => toggleApply(job.id)}>
                          応募する
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* ── Bottom tab bar ──────────────────────────────────── */}
      <nav className={bottomBarStyles.bottomBar}>
        {(Object.keys(tabConfig) as BottomTab[]).map((key) => {
          const cfg = tabConfig[key];
          const IconComp = cfg.icon;
          const isActive = activeTab === key;
          const badge =
            key === "saved" ? savedCount : key === "applied" ? appliedCount : 0;
          return (
            <button
              key={key}
              type="button"
              className={`${bottomBarStyles.bottomTab} ${isActive ? bottomBarStyles.bottomTabActive : ""}`}
              onClick={() => setActiveTab(key)}
            >
              <IconComp size={20} />
              <span className={bottomBarStyles.bottomTabLabel}>{cfg.label}</span>
              {badge > 0 && (
                <span className={bottomBarStyles.bottomTabBadge}>{badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Filter Dialog ──────────────────────────────────── */}
      <Dialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        returnFocusRef={filterBtnRef}
      >
        <DialogHeader>
          <DialogTitle>絞り込み</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className={styles.filterSection}>
            <Text as="span" size="sm" weight="semibold">勤務形態</Text>
            <div className={styles.filterOptions}>
              {(Object.entries(jobTypeConfig) as [JobType, typeof jobTypeConfig[JobType]][]).map(
                ([key, config]) => (
                  <Checkbox
                    key={key}
                    label={config.label}
                    checked={jobTypeFilter.includes(key)}
                    onChange={() => toggleJobTypeFilter(key)}
                  />
                ),
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={resetFilter}>
            リセット
          </Button>
          <Button onClick={applyFilter}>
            適用する
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

/* ── Exported wrapper (with ToastProvider) ──────────────────── */

export function JobSearchPage() {
  return (
    <ToastProvider>
      <JobSearchInner />
    </ToastProvider>
  );
}
