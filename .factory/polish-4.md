# Polish 4 — cumulative adversarial finding closure

- Work order: `recipe-import-repair-polish-4`
- Reviewed candidate: `c3fb608cc69239e00d33b593fc397da740234faf`
- Review report: `b799d2749665ddfe55ebc2ff46e3e6edd9b897b6`
- Product repair commit: `451202e`
- Deployment ID: `8f771e6b-7543-4d14-999a-44cbc1dcd10b`
- Live demo: <https://recipe-import-repair.sociobot.in/?demo=1>
- Evidence root: `.factory/evidence/polish-4/`

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| `F-1-1` | Preserved the direct recipe-task headings and controls; no reviewed notebook metaphor remains in product copy. | `reviewed wording and destructive controls name their exact result`; `.factory/copy-audit.md`; `live/verify-home/screenshot-desktop.png`; live `/`. |
| `F-1-2` | Preserved **Leave demo and clear sample** with adjacent discard wording and blank-workspace behavior. | `@claim:demo-isolation`; `live/demo-cold-mobile.png`; live `/?demo=1`. |
| `F-1-3` | Preserved the listed three-issue sample claim and exact reset behavior. | `@claim:demo-sample-issues`; `live/demo-cold-mobile.png`; live `/?demo=1`. |
| `F-1-4` | Preserved repair-details fields for repaired text, quantity, unit, and item. | `@claim:neutral-export`; clean-clone claim run. |
| `F-2-1` | Preserved Recipe JSON-LD, repaired-original, and repair-details exports with supported-format round trips. | `@claim:portable-export`; `@claim:neutral-export`; live browser suite. |
| `F-2-2` | Preserved per-history-entry scroll and focus restoration plus routed **How it works** focus. | `history restores scroll and focus, and cross-route section links focus their heading`; local and live browser suites. |
| `F-2-3` | Preserved `main#main[tabindex="-1"]` on the designed HTTP 404 and its working skip link. | `the static 404 skip link reaches its main content`; live `/polish-4-not-found` returned 404. |
| `F-2-4` | Preserved route-specific title, description, canonical, Open Graph, and Twitter metadata, including complete static 404 metadata. | `every route updates title, description, canonical, and social metadata`; `live/verify-*/verify.json`; live route checks. |
| `F-2-5` | Preserved **Clear recipe and results**, disabled for an empty workspace. | `reviewed wording and destructive controls name their exact result`; live suite. |
| `F-2-6` | Preserved the plain recipe-app audience sentence on the first screen and in README. | `the mobile first screen states the job, audience, action, and three facts`; `.factory/copy-audit.md`. |
| `F-2-7` | Preserved **Repair a recipe in three steps**. | `reviewed wording and destructive controls name their exact result`; live `/`. |
| `F-2-8` | Preserved **suggested repairs** and kept the undefined “safe” claim absent. | `reviewed wording and destructive controls name their exact result`; `@claim:demo-sample-issues`. |
| `F-2-9` | Preserved the JSON punctuation error that names commas, quotes, and brackets and gives a next action. | parser unit `reports malformed JSON with a next step`; browser wording test. |
| `F-2-10` | Preserved ISO `exportedAt` validation in repair-details export. | `@claim:neutral-export`; clean-clone claim run. |
| `F-2-11` | Preserved separate README sentences for parsing and diagnostics. | static copy/config test; `.factory/copy-audit.md`. |
| `F-2-12` | Preserved **source URL** as the single user-facing term. | `@claim:source-url-no-fetch`; static copy/config test. |
| `F-3-1` | Preserved the compact mobile demo with the named sample, editable title, issue summary, first issue, and apply action in the first 390 × 844 viewport. | `@claim:demo-sample-issues`; `live/demo-cold-mobile.png`; live `/?demo=1`. |
| `F-3-2` | Preserved full JSON, JSON-LD, and Markdown assertions for title, source URL, ingredient, step, and retained title edits. | `@claim:format-import`; clean-clone claim run. |
| `F-4-1` | Removed the dead `home-file` branch. Every file selection now renders a visible status or alert, focuses it, and scrolls it into view. Successful status names the file, format, parsed recipe, and issue count. The first-screen oversized-file path now proves the same focus and viewport behavior. | `the hero file picker reveals and focuses a successful import on mobile`; `@claim:file-limit`; live 30-test suite; `live/hero-file-mobile.png`; `live/hero-file-desktop.png`; `live/hero-file-error-mobile.png`; live `/`. |
| `F-4-2` | Linked the Privacy correction instruction to the product's GitHub issue tracker and identified the new-tab behavior for assistive technology. | `the privacy correction instruction links to the product issue tracker`; `live/verify-privacy/screenshot-desktop.png`; live `/privacy`; issue-tracker request returned 200. |

## Verification

- Clean clone: `/tmp/recipe-import-repair-polish4.pR6oYr/repo` at product commit `451202e`; `npm ci` found zero vulnerabilities.
- Clean full gate: typecheck and lint passed; 10 unit/config tests and 30 Chromium tests passed; `npm run build` produced `dist/index.html`.
- Every one of the 14 commands in `.factory/claims.json` passed independently in that clean clone.
- Live browser gate: all 30 tests passed against the custom domain, including every claim, light/dark Axe scans, offline reload, same-origin request capture, routing/focus, 200% text, and mobile target/overflow checks.
- `/opt/fleet/lib/verify-url.sh` passed Home, Demo, Privacy, and Terms locally and live with one h1, `lang=en`, a main landmark, complete image alt text, labeled buttons, and no console/page errors.
- Live route crawl: `/`, `/demo`, `/privacy`, `/terms`, robots, sitemap, icons, and social image returned 200; the unknown route returned 404; the GitHub issue tracker and Param Factory links returned 200.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.0 s, TBT 60 ms, CLS 0. Evidence: `live/lighthouse-demo-mobile.json`.
- Production payload: JavaScript 35.29 kB raw / 12.09 kB gzip; CSS 18.14 kB raw / 4.79 kB gzip; hero image 60,112 bytes.
- Local and live JavaScript SHA-256: `f40fefe3b96c3ffdc9926cfb1ea090b075acb92c601e3ed5cd286868a275cade`.

All findings from reviews 1–4 are closed. No severity is deferred.
