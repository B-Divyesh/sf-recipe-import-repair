# Polish 2 — cumulative finding closure

- Work order: `recipe-import-repair-polish-2`
- Reviewed candidate: `2a8eb27b75f9b2a9ca95cddfbef4b8ab06d057ea`
- Review report: `80ba1eb90c879fa95d45729e654a57b9e80d472e`
- Product repair commit: `b4b61c4`
- Final verified repository head: `ba1aae9`
- Deployment ID: `bd1889fb-8ce1-43eb-9f20-06b13460f836`
- Live demo: <https://recipe-import-repair.sociobot.in/?demo=1>

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Preserved the earlier plain task labels and removed the remaining “bench” control metaphor. | `reviewed wording and destructive controls name their exact result`; `.factory/copy-audit.md`; `local/home-390.png`; live Home check. |
| F-1-2 | Preserved “Leave demo and clear sample” with its adjacent discard explanation. | `@claim:demo-isolation`; `@claim:demo-sample-issues`; live `/?demo=1` suite. |
| F-1-3 | Preserved the listed three-issue sample claim and reset proof. | `@claim:demo-sample-issues`; `live/verify-demo-query/`; live reset test. |
| F-1-4 | Preserved parsed quantity, unit, item, and repaired raw text in repair-details JSON. | `@claim:neutral-export`; downloaded live `repair-details.json` assertion. |
| F-2-1 | Replaced the dead-end neutral-only export with a format selector for Schema.org Recipe JSON-LD, repaired original JSON/JSON-LD/Markdown, and detailed repair JSON. Extended the parser to re-import every output. Removed “Ready for another recipe keeper.” | `@claim:portable-export` round-trips JSON-LD and all three original formats; `@claim:neutral-export`; `local/demo-desktop-full.png`; full live suite at `/demo`. |
| F-2-2 | Stores scroll and focus in each history entry, restores both on popstate, and routes `/#how-it-works` through the SPA with heading focus and announcement. | `history restores scroll and focus, and cross-route section links focus their heading`; passed locally and live. |
| F-2-3 | Added `id="main"` and `tabindex="-1"` to the static 404 main landmark. Axe now checks every impact level. | `the static 404 skip link reaches its main content`; `pages meet the automated accessibility baseline`; live unknown URL returned HTTP 404; `live/404/screenshot-mobile.png`. |
| F-2-4 | Updates title, description, canonical, Open Graph title/description/URL, and Twitter title/description on each route. Added complete canonical, OG, Twitter, theme, favicon, and apple-touch metadata to 404. | `every route updates title, description, canonical, and social metadata`; static config test; route-specific `live/verify-*` reports. |
| F-2-5 | Replaced “Clear bench” with “Clear recipe and results”; it is disabled when nothing can be cleared. | `reviewed wording and destructive controls name their exact result`; live wording test. |
| F-2-6 | Replaced self-hosting jargon with “For people who run their own recipe app and need to fix a file before importing it.” in the first screen and README. | `the mobile first screen states the job, audience, action, and three facts`; copy config test; `local/home-390.png`. |
| F-2-7 | Replaced “Repair in three checked steps” with “Repair a recipe in three steps.” | `reviewed wording and destructive controls name their exact result`; `.factory/copy-audit.md`; live Home check. |
| F-2-8 | Replaced every “safe repairs” action with “suggested repairs.” | `reviewed wording and destructive controls name their exact result`; `Apply N suggested repairs...`; live Demo check. |
| F-2-9 | Rewrote malformed JSON guidance to name commas, quotes, and brackets without claiming nonexistent marks. | parser unit `reports malformed JSON with a next step`; browser wording test; live malformed-input check. |
| F-2-10 | Kept `exportedAt` only in repair-details JSON and now asserts it parses and round-trips as an ISO timestamp. | `@claim:neutral-export`; claims manifest entry names the ISO assertion. |
| F-2-11 | Split the dense README sentence into one parsing sentence and one diagnostics sentence. | `keeps reviewed copy direct and every retained export promise in the claims manifest`; `.factory/copy-audit.md`. |
| F-2-12 | Standardized the user-facing term to “source URL” everywhere. | `@claim:source-url-no-fetch`; copy config test; live same-origin request test. |

## Verification evidence

- Final clean clone: `/tmp/recipe-import-repair-final.kfek1C/repo` at `ba1aae9`; `npm ci`, typecheck, lint, full test, and build passed.
- Every one of the 14 commands in `.factory/claims.json` passed independently in that clone.
- Local suite: 10 unit/config tests and 28 Chromium tests passed.
- Live suite: all 27 product/browser tests passed against the custom domain; the added reviewed-wording test also passed live.
- Axe: zero violations at any impact level on Home, Demo, Privacy, Terms, and the real HTTP 404, in light and dark checks.
- `verify-url.sh`: zero console/page errors, one h1, `lang=en`, main landmark, image alt text, and labeled buttons on all application routes.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.7 s, TBT 0 ms, CLS 0.
- Production payload: JS 33,960 bytes raw / 11.76 kB gzip; CSS 17,169 bytes raw / 4.62 kB gzip; hero 60,112 bytes.
- Local/live JavaScript SHA-256: `ca1f8961590497c1efb57a99403d275c52965aea7e7e5d2eeae473cd4d2f7d93` (exact match).
- Evidence root: `.factory/evidence/polish-2/`.

All findings from review 1 and review 2 are closed. No severity is deferred.
