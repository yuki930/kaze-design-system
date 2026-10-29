import type { NextConfig } from "next";
import pkg from "./package.json" with { type: "json" };

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_KAZE_VERSION: pkg.version,
  },
  // The static Storybook is built into public/storybook by `npm run storybook:site` (prebuild)
  async redirects() {
    return [{ source: "/storybook", destination: "/storybook/index.html", permanent: false }];
  },
};

export default nextConfig;
