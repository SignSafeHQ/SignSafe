# Landing CI and Cache Policy

This documents the CI scaffolding added for `landing/` without changing the app package manifest.

## What CI checks

The `Landing CI` workflow runs on pull requests and pushes that touch the landing app or its workflow/docs files.

- `npm ci`
- `lint`
- `typecheck`
- `build`
- a lightweight bundle-size check against `dist/assets/*.js`

## Lint approach

The repo does not yet ship a committed ESLint config or lint script. To avoid changing `landing/package.json`, the workflow generates a temporary flat ESLint config at runtime and runs it against `src/`, `components/`, and `vite.config.ts`.

This is a pragmatic stopgap. Once the repo adopts a permanent ESLint setup, the workflow should switch to that committed config and stop generating one inline.

## Cache policy

For static hosting, use two cache classes:

- Hashed build assets such as `dist/assets/*.js` and `dist/assets/*.css`: `Cache-Control: public, max-age=31536000, immutable`
- `index.html`: `Cache-Control: no-cache, max-age=0, must-revalidate`

The goal is to keep the shell HTML fresh while allowing hashed bundles to cache aggressively.

## Performance verification

The current bundle budget is intentionally lightweight:

- fail if any emitted JavaScript bundle exceeds `200 KB` raw or `60 KB` gzip
- inspect the output in `dist/assets/` when the budget trips

This is enough to catch obvious regressions without adding a full Lighthouse pipeline before a stable preview URL exists.

## Assumptions and blockers

- There is no repo-level ESLint config yet.
- There is no stable deployment URL in this repository, so Lighthouse CI is deferred.
- `next.config.js` in `landing/` appears to be a stale carryover, but this CI-only change does not remove it.
