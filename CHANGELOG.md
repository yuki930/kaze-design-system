# Changelog

All notable changes to this project are documented here.
This project follows [Conventional Commits](https://www.conventionalcommits.org/) for semver bumps and [Semantic Versioning](https://semver.org/).

## Conventions

Commit prefix determines the next version bump on release:

- `feat:` → **minor** bump (new feature, backward-compatible)
- `fix:`, `perf:`, `refactor:`, `docs:`, `chore:`, `build:`, `ci:` → **patch** bump
- `feat!:`, `fix!:`, `refactor!:` or a commit body containing `BREAKING CHANGE:` → **major** bump

CHANGELOG entries and version bumps are generated automatically by `.github/workflows/publish.yml` on every push to `main` that touches library source files.
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
