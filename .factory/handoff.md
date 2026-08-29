# Polish 2 handoff — PASS

- Work order: `recipe-import-repair-polish-2`
- Base review: `80ba1eb90c879fa95d45729e654a57b9e80d472e`
- Product repair: `b4b61c4`
- Evidence commit: `da02a6c`
- Deployment: Azure Static Web Apps, ID `bd1889fb-8ce1-43eb-9f20-06b13460f836`
- Live URL: <https://recipe-import-repair.sociobot.in/?demo=1>
- Date: 2026-08-29 UTC

## What changed

- Closed every finding in `.factory/review-1.md` and `.factory/review-2.md`; the exact finding map is in `.factory/polish-2.md`.
- Added real Schema.org Recipe JSON-LD and repaired-original exports for JSON, JSON-LD, and Markdown. Each downloaded format imports back into the tool. The detailed repair JSON retains attribution, parsed ingredient fields, and a tested ISO export time.
- Repaired history scroll/focus restoration and cross-route section focus.
- Completed route-specific title, description, canonical, Open Graph, and Twitter metadata. Completed 404 metadata and its skip-link target.
- Rewrote the reviewed first-screen, control, error, and README wording in direct task language. Standardized “source URL.”
- Preserved the repair-notebook visual identity, isolated `?demo=1` sandbox, reset/leave behavior, privacy model, offline behavior, and static-web deployment class.
- Updated the verb-first 91-character catalog description, claims manifest, demo documentation, copy audit, and service-worker cache version.

## Verification

- Clean clone `/tmp/recipe-import-repair-polish2.CktSnF/repo`: `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` passed.
- All 14 claim commands in `.factory/claims.json` passed independently in that clone.
- Final local suite: 10 unit/config tests and 28 Chromium tests passed.
- Deployed suite: all 27 end-to-end product tests passed against `https://recipe-import-repair.sociobot.in`; the added reviewed-wording regression also passed live.
- Axe reported zero violations at any impact level across Home, Demo, Privacy, Terms, and the real HTTP 404. The 404 skip link moves focus to main.
- Live unknown route returned HTTP 404. Home, `/demo`, `/?demo=1`, `/privacy`, and `/terms` returned 200 with route-specific metadata and no console errors.
- The cold live demo showed three issues, isolated `demo:` session storage, reset, leave-and-clear, suggested repairs, all three export choices, same-origin-only requests, and a working offline reload.
- Mobile 390 px, 200% text, 44 px targets, dark mode, reduced motion, keyboard focus, link crawl, privacy, and CSP/security-header checks passed.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.7 s, TBT 0 ms, CLS 0.
- Production payload: JS 33,960 bytes raw / 11.76 kB gzip; CSS 17,169 bytes raw / 4.62 kB gzip; hero 60,112 bytes.
- Deployed/local JS SHA-256 matches: `ca1f8961590497c1efb57a99403d275c52965aea7e7e5d2eeae473cd4d2f7d93`.
- Screenshots, verifier JSON, Lighthouse JSON, and live 404 capture are under `.factory/evidence/polish-2/`.

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh recipe-import-repair ./dist
```

To rerun the browser suite against production:

```sh
PLAYWRIGHT_BASE_URL=https://recipe-import-repair.sociobot.in npm run test:e2e
```

## Known gaps and next steps

None. No review finding, claim, or required quality gate remains open.
