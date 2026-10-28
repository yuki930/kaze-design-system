/** Links back to the GitHub repository from the docs / sample site. */
export const REPO_URL = "https://github.com/yuki930/kaze-design-system";

export const NPM_URL = "https://www.npmjs.com/package/kaze-design-system";

/** Source file on GitHub (main branch) for a repo-relative path. */
export function repoFileUrl(path: string): string {
  return `${REPO_URL}/blob/main/${path}`;
}

/** Directory on GitHub (main branch) for a repo-relative path. */
export function repoTreeUrl(path: string): string {
  return `${REPO_URL}/tree/main/${path}`;
}

/** Sample page route -> the view file that implements it. */
export const SAMPLE_SOURCES: Record<string, string> = {
  "/analytics": "src/views/dashboards/AnalyticsDashboard/AnalyticsDashboard.tsx",
  "/article": "src/views/content/ArticlePage.tsx",
  "/blog": "src/views/content/BlogPage.tsx",
  "/dashboard": "src/views/dashboards/Dashboard/Dashboard.tsx",
  "/ec-dashboard": "src/views/dashboards/ECDashboard/ECDashboard.tsx",
  "/gallery": "src/views/content/GalleryPage/GalleryPage.tsx",
  "/help": "src/views/content/HelpPage/HelpPage.tsx",
  "/jobs": "src/views/apps/JobSearchPage/JobSearchPage.tsx",
  "/login": "src/views/LoginPage/LoginPage.tsx",
  "/lp": "src/views/landing/LandingPage/LandingPage.tsx",
  "/lp2": "src/views/landing/ImageLandingPage.tsx",
  "/pricing": "src/views/landing/PricingPage.tsx",
  "/projects": "src/views/dashboards/ProjectsDashboard/ProjectsDashboard.tsx",
  "/saas-stats": "src/views/dashboards/SaaSStatsPage/SaaSStatsPage.tsx",
  "/settings": "src/views/SettingsPage.tsx",
  "/shopping": "src/views/apps/ShoppingPage/ShoppingPage.tsx",
  "/todo": "src/views/apps/TodoPage/TodoPage.tsx",
};
