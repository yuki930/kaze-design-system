# Changelog

All notable changes to this project are documented here.
This project follows [Conventional Commits](https://www.conventionalcommits.org/) for semver bumps and [Semantic Versioning](https://semver.org/).

## Conventions

Commit prefix determines the next version bump on release:

- `feat:` → **minor** bump (new feature, backward-compatible)
- `fix:`, `perf:`, `refactor:`, `docs:`, `chore:`, `build:`, `ci:` → **patch** bump
- `feat!:`, `fix!:`, `refactor!:` or a commit body containing `BREAKING CHANGE:` → **major** bump

CHANGELOG entries and version bumps are generated automatically by `.github/workflows/publish.yml` on every push to `main` that touches library source files.

### 0.x policy

While the major version is 0, a **minor** release may include breaking changes (they are called out in the release notes with a migration note); a **patch** release never does. The public API will be frozen at 1.0.
## [0.11.0] - 2026-10-29

### Features

- feat: add Popover, Combobox, DatePicker (Japanese era) and Drawer (#53)


## [0.10.4] - 2026-10-29

### Other

- build: move to vite 8 and vitest 5 (#52)


## [0.10.3] - 2026-10-29

### Other

- chore(deps-dev): bump lucide-react from 0.575.0 to 1.61.0 (#49)


## [0.10.2] - 2026-10-29

### Other

- docs: rewrite the README intro and showcase copy, link npm from the top page (#51)


## [0.10.1] - 2026-10-29

### Other

- chore(deps-dev): bump @testing-library/jest-dom from 6.9.1 to 7.0.1 (#46)
- chore(deps-dev): bump the dev-dependencies group with 14 updates (#45)


## [0.10.0] - 2026-10-29

### Features

- feat: unify the component API vocabulary (tone, Size, value/onValueChange, asChild, data-state) (#50)


## [0.9.1] - 2026-10-29

### Bug Fixes

- fix: drop the lucide Github icon and split major dependency bumps (#44)

### Other

- chore(deps): bump actions/setup-node from 4 to 7 (#42)
- chore(deps): bump actions/checkout from 4 to 7 (#41)


## [0.9.0] - 2026-10-29

### Features

- feat: accessibility, Japanese input and typography overhaul (phase 1 of the "best in Japan" plan) (#40)


## [0.8.1] - 2026-10-29

### Bug Fixes

- fix: resolve all a11y lint warnings and stop charts jumping on first paint (#39)


## [0.8.0] - 2026-10-29

### Features

- feat: use the new charts in the sample dashboards; LineChart startAtZero (#38)


## [0.7.0] - 2026-10-28

### Features

- feat: add LineChart, ColumnChart, Heatmap, CategoryBar, ChartLegend and SegmentedControl (#37)

### Bug Fixes

- fix(site): link the docs and sample pages back to the GitHub repository (#36)


## [0.6.1] - 2026-10-28

### Other

- chore: introduce biome for lint / format and clean up unused files (#35)


## [0.6.0] - 2026-10-28

### Bug Fixes

- fix: セルフ点検で見つかった不具合・CI・ドキュメント・コンテンツの修正 (#32)

### Other

- ci: publish to npm via Trusted Publishing (OIDC) instead of NPM_TOKEN (#34)
- ci: fix invalid publish workflow and allow manual releases (#33)
- ci: add manual publish recovery workflow for tagged releases


## [0.5.0] - 2026-07-17

### Features

- feat: add kaze-design-system/marketing subpath export (#30)
- feat: introduce density tokens with data-density=compact support (#31)
- feat: align status variant vocab, zero runtime deps, and overhaul demo content

### Bug Fixes

- fix(landing): wire GitHub buttons to the actual repo URL

### Other

- docs: present component catalog as Application UI / Marketing two-layer taxonomy (#29)
- docs: add CONTRIBUTING.md, issue/PR templates, and bundle size tooling

## [0.4.2] - 2026-04-12

### Bug Fixes

- fix(test): unbreak vitest unit + storybook browser test suites

### Other

- docs: drop Zinc-based from generate-llms.mjs boilerplate + add docs:stories npm script
- chore(stories): add stub stories for remaining 26 compound components
- ci: exclude *.stories.tsx and *.test.tsx from publish trigger

## [0.4.1] - 2026-04-12

### Other

- chore: add Storybook stories for 16 previously-uncovered components
- docs: rewrite Zinc-based intro copy for non-designer audience
- docs: add sample page links + clearer overview to README

## [0.4.0] - 2026-04-12

### Features

- feat: add Disclosure component and relax useLegendToggle types
- feat(docs): auto-extract component Props from TypeScript sources

### Other

- ci: drive semver bumps from Conventional Commit prefixes
- ci: only publish when library source changes + refresh README

## [0.3.3] - 2026-04-12

Baseline release (initial CHANGELOG). Prior releases are documented via git tags.

### Features (v0.3.0)

- Add StatusBadge component for data-status display (live / stale / missing / manual / loading) (#25)
- Add HelpButton component — click-activated help popover with outside-click / ESC dismissal (#24)
- Add `useLegendToggle` hook for interactive Recharts legends (#23)
- Add `size` prop (`sm` / `md` / `lg`) to EmptyState with `role="status"` (#26)

### Docs

- Add `/llms.txt` and `/llms-full.txt` generated from ComponentPage.tsx + TypeScript Props interfaces for AI-assistant discoverability
- Refresh ComponentsOverview and ComponentPage with new components
- Refresh README (package name, component count, AI assistants section)

### CI

- `publish.yml` now filters by paths so docs/app/scripts changes never trigger empty npm publishes
- Semver bump now driven by Conventional Commit prefixes, not fixed patch
