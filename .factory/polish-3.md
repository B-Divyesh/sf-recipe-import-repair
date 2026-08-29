# Polish 3 — complete adversarial finding closure

- Work order: `recipe-import-repair-polish-3-retry1`
- Reviewed candidate: `ffa933e8975dfd6588559b37f35d60b6ae5b2433`
- Review report: `ca196e18c58922a739fb9e3e81bcdba2e61a1ef2`
- Product repair commit: `6ffbea418e6184e5301bcc2779ee5919d9b71b3c`
- Deployment ID: `e6b6a08c-a55a-4785-806d-eb4a769b9bd4`
- Live demo: <https://recipe-import-repair.sociobot.in/?demo=1>

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the direct task labels, captions, README wording, and 404 language that removed notebook metaphors from product copy. | `reviewed wording and destructive controls name their exact result`; live Home verifier; `qa-artifacts/polish-3/live/verify-home/verify.json`. |
| F-1-2 | Kept **Leave demo and clear sample** beside its discard explanation; it clears the `demo:` key and opens an empty normal workspace. | `@claim:demo-isolation`; live suite; `qa-artifacts/polish-3/live/demo-390-cold.png`. |
| F-1-3 | Kept the listed three-issue sample claim and reset behavior. The first demo screen now also exposes the count. | `@claim:demo-sample-issues`; cold live screenshot; <https://recipe-import-repair.sociobot.in/?demo=1>. |
| F-1-4 | Kept repair-details ingredient `raw`, `quantity`, `unit`, and `item` assertions. | `@claim:neutral-export`; clean-clone claim run. |
| F-2-1 | Kept Recipe JSON-LD, repaired-original, and repair-details exports with parser round trips. | `@claim:portable-export`; live suite. |
| F-2-2 | Kept per-history-entry scroll/focus restoration and handled cross-route **How it works** navigation. | `history restores scroll and focus, and cross-route section links focus their heading`; live suite. |
| F-2-3 | Kept the static 404 `main#main[tabindex="-1"]` target and real 404 response. | `the static 404 skip link reaches its main content`; live `/polish-3-not-found` returned 404; `qa-artifacts/polish-3/live/404.headers`. |
| F-2-4 | Kept route-specific title, description, canonical, Open Graph, and Twitter metadata, plus complete 404 metadata. | `every route updates title, description, canonical, and social metadata`; live verifier reports for Home, Demo, Privacy, and Terms. |
| F-2-5 | Kept **Clear recipe and results**, disabled when empty. | `reviewed wording and destructive controls name their exact result`; live Home suite. |
| F-2-6 | Kept the plain recipe-app audience wording in the first screen and README. | `the mobile first screen states the job, audience, action, and three facts`; live Home verifier. |
| F-2-7 | Kept **Repair a recipe in three steps**. | `reviewed wording and destructive controls name their exact result`; live Home suite. |
| F-2-8 | Kept **Apply N suggested repairs**, with no undefined “safe” claim. | `reviewed wording and destructive controls name their exact result`; `@claim:demo-sample-issues`; live demo. |
| F-2-9 | Kept the malformed-JSON message that names commas, quotes, and brackets without claiming a nonexistent marker. | parser test `reports malformed JSON with a next step`; live browser suite. |
| F-2-10 | Kept the valid ISO `exportedAt` assertion in repair-details JSON. | `@claim:neutral-export`; clean-clone claim run. |
| F-2-11 | Kept the split README parsing and diagnostics sentences. | `.factory/copy-audit.md`; static copy test. |
| F-2-12 | Kept **source URL** as the single user-facing term. | `@claim:source-url-no-fetch`; live same-origin request test. |
| F-3-1 | Rewrote the demo H1 to **Repair Rosemary tomato beans**. On a 390 px screen, the parsed-result panel now precedes the source editor and contains a populated editable **Sample title**, a concrete first issue, and **Apply 3 suggested repairs**. The compact mobile toolbar retains the clear action; the source remains available below. | Enhanced `@claim:demo-sample-issues` measures every required element at `bottom <= 844`, edits then resets the sample title, and applies/reset repairs. `qa-artifacts/polish-3/local/demo-390.png`; `qa-artifacts/polish-3/live/demo-390-cold.png`; <https://recipe-import-repair.sociobot.in/?demo=1>. |
| F-3-2 | Expanded `@claim:format-import` for JSON, JSON-LD, and Markdown. Every fixture now asserts title, source URL, first ingredient, and first step, then edits a title and asserts the rerendered value. | `npm test -- --grep @claim:format-import` in the clean clone; full live browser suite. |

## Verification

- Fresh clone: `/tmp/recipe-import-repair-polish3.3lKSMR/repo` at `6ffbea4`; `npm ci` completed with zero vulnerabilities.
- Every one of the 14 exact commands in `.factory/claims.json` passed independently.
- The clean full gate passed: 10 Vitest/config tests, 28 Chromium browser tests, `npm run lint`, and `npm run build`. `dist/index.html` exists.
- Live browser gate: `PLAYWRIGHT_BASE_URL=https://recipe-import-repair.sociobot.in npm run test:e2e` passed all 28 tests, including Axe checks in light and dark modes, controlled offline reload, same-origin request capture, route history/focus, and mobile target/overflow checks.
- `/opt/fleet/lib/verify-url.sh` passed Home, `?demo=1`, Privacy, and Terms without console or page errors. Its reports are in `qa-artifacts/polish-3/live/verify-*/verify.json`.
- Live routes `/`, `/demo`, `/privacy`, and `/terms` return 200; `/polish-3-not-found` returns a designed HTTP 404.
- Live and local JavaScript SHA-256 both equal `ab314aaf8b8405614ac1a64f2735386a19fcc9590641e1fbfa51c5c0ea8524a4`.
- Lighthouse mobile on the live demo: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 904 ms, LCP 958 ms, TBT 59 ms, CLS 0. Evidence: `qa-artifacts/polish-3/live/lighthouse-demo-mobile.json`.

No finding of any severity remains open.
