# Polish 4 handoff — PASS

- Work order: `recipe-import-repair-polish-4`
- Reviewed candidate: `c3fb608cc69239e00d33b593fc397da740234faf`
- Adversarial review: `b799d2749665ddfe55ebc2ff46e3e6edd9b897b6`
- Product repair commit: `451202e`
- Deployment ID: `8f771e6b-7543-4d14-999a-44cbc1dcd10b`
- Live URL: <https://recipe-import-repair.sociobot.in>
- Date: 2026-08-29 UTC

## What changed

- Fixed the first-screen **Choose your file** path. Successful imports now reveal and focus a visible status containing the filename, parsed format, recipe title, and issue count.
- Invalid and oversized first-screen files now reveal and focus the visible source alert. Both status types are scrolled into the current viewport on phone and desktop.
- Removed the obsolete `home-file` condition that caused the reviewed silent result.
- Added regressions for valid and oversized hero-file selection at 390 × 844, including focus and viewport bounds.
- Linked the Privacy correction instruction directly to the product issue tracker with accessible external-link wording.
- Kept all earlier copy, demo isolation, export, routing, metadata, 404, mobile, accessibility, privacy, and offline repairs covered.
- Updated `.factory/claims.json`, `.factory/copy-audit.md`, `.factory/catalog-description.txt`, and `.factory/polish-4.md`.

## Verification evidence

- Clean clone: `/tmp/recipe-import-repair-polish4.pR6oYr/repo` at `451202e`.
- Install: `npm ci` passed with zero vulnerabilities.
- Static gates: `npm run typecheck`, `npm run lint`, and `npm run build` passed.
- Full clean suite: 10 unit/config tests and 30 Chromium tests passed.
- Claims: all 14 exact `.factory/claims.json` commands passed independently.
- Accessibility: Playwright Axe found zero violations on Home, Demo, Privacy, Terms, and 404 in light mode, and all application routes in dark mode.
- URL verifier: all four primary routes passed locally and live with no console or page errors; reports and screenshots are under `.factory/evidence/polish-4/{local,live}/verify-*`.
- Cold live file flow: success status was focused and inside both 390 × 844 and 1440 × 900 viewports; the 2 MB error was focused inside 390 × 844. Screenshots are `live/hero-file-mobile.png`, `live/hero-file-desktop.png`, and `live/hero-file-error-mobile.png`.
- Cold live demo: the sample name, isolated banner, and repair action fit in the initial 390 × 844 viewport; only `demo:recipe-import-repair:source` existed in session storage and local storage was empty. Screenshot: `live/demo-cold-mobile.png`.
- Live browser suite: all 30 tests passed against <https://recipe-import-repair.sociobot.in>.
- Live routing: `/`, `/demo`, `/privacy`, and `/terms` returned 200; `/polish-4-not-found` returned the designed 404; public assets and both external links returned 200.
- Headers: same-origin CSP with `frame-ancestors` in the response, HSTS, `nosniff`, referrer policy, and permissions policy are present.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.0 s, TBT 60 ms, CLS 0. Report: `.factory/evidence/polish-4/live/lighthouse-demo-mobile.json`.
- Build size: JavaScript 35.29 kB raw / 12.09 kB gzip; CSS 18.14 kB raw / 4.79 kB gzip.
- Deployment identity: local and live JavaScript SHA-256 are both `f40fefe3b96c3ffdc9926cfb1ea090b075acb92c601e3ed5cd286868a275cade`.

## Run and verify

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://recipe-import-repair.sociobot.in npm run test:e2e
```

Run each command in `.factory/claims.json` independently for claim verification. Deploy `./dist` as the static artifact.

## Known gaps and next steps

None. Every finding from adversarial reviews 1–4 is closed, and no severity is deferred.
