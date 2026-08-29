# Adversarial first-read review 5 — PASS

- Product: Recipe Import Repair
- URL reviewed: <https://recipe-import-repair.sociobot.in>
- Date: 2026-08-29 UTC
- Repository head reviewed: `6d3dbaebb99b998c946e09ff6abdc5d5375ed59d`
- Viewports: fresh Chromium contexts at 390 × 844 and 1440 × 900
- Result: **PASS — zero blocking findings, zero minor findings, and zero untested claims.**

## Cold first read

Before scrolling or reading the repository copy, I understood the first screen as follows:

- What it does: fixes broken recipe-import files before they are saved or imported.
- Who it is for: people who run their own recipe app and need to repair a file before importing it.
- What to click first: **Try it with sample data**.

The exact copy that supplied those answers was **“Fix broken recipe imports before saving,”** **“For people who run their own recipe app and need to fix a file before importing it,”** and **“Try it with sample data.”** The sample action, its outcome note, and all three privacy/offline/price facts fit without scrolling at 390 × 844 and 1440 × 900. This check passes at both widths.

## Findings

None.

## Copy audit

Counts treat whitespace-separated tokens as words. Standalone punctuation is not a word; hyphenated terms, URLs, code tokens, and `$0` count as one word. Every landing-page and README sentence is 22 words or fewer. No banned marketing adjective, unexplained jargon, inconsistent term, metaphor heading, mood heading, empty slogan, or non-result-naming button remains.

### Landing-page sentences and sentence-like copy

| Sentence | Words | Result |
| --- | ---: | --- |
| For people who run their own recipe app and need to fix a file before importing it. | 17 | Pass |
| The sample opens with three repairable issues. | 7 | Pass — `demo-sample-issues` |
| Files stay in this browser. | 5 | Pass — `local-only` |
| Works offline after first visit. | 5 | Pass — `offline-reload` |
| Free — no account needed. | 4 | Pass — `free-flow` |
| An illustrated graph-paper notebook with recipe lines and red correction marks. | 11 | Pass — useful image alt text |
| Inspect recipe fields. | 3 | Pass |
| Review each repair. | 3 | Pass |
| Preserve source attribution. | 3 | Pass — `neutral-export` |
| Paste JSON, JSON-LD, or Markdown. | 5 | Pass — `format-import` |
| You see the parsed fields before you export anything. | 9 | Pass — `format-import` |
| Maximum file size: 2 MB. | 5 | Pass — `file-limit` |
| Source URLs are preserved and never opened. | 7 | Pass — `source-url-no-fetch` |
| Your parsed fields will appear here. | 6 | Pass — useful empty state |
| Paste recipe text or choose a file. | 7 | Pass — useful empty state |
| Then inspect it. | 3 | Pass — useful next step |
| The tool separates title, source, ingredients, and steps. | 8 | Pass — `format-import` |
| Every suggested repair shows its exact before and after value. | 10 | Pass — `exact-change-preview` |
| Download Recipe JSON-LD or keep the source file format. | 9 | Pass — `portable-export` |
| The tool does not fetch recipe pages. | 7 | Pass — `source-url-no-fetch` |
| Repairs do not change cooking instructions. | 6 | Pass — `instructions-unchanged` |
| No recipe text leaves your device. | 6 | Pass — `local-only` |
| No account is required. | 4 | Pass — `free-flow` |
| Fix recipe files before importing them into your recipe app. | 10 | Pass — footer description |
| Inspect and repair JSON, JSON-LD, or Markdown recipe files before importing them into your recipe app. | 16 | Pass — home meta description; `format-import` |

### Landing headings, labels, and actions

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass — destination-naming link |
| Recipe Import Repair | 3 | Pass — wordmark |
| Demo | 1 | Pass — navigation destination |
| How it works | 3 | Pass — navigation destination |
| Privacy | 1 | Pass — navigation destination |
| Check before import | 3 | Pass — relevant margin instruction |
| Repair recipe files in your browser | 6 | Pass — task label |
| Fix broken recipe imports before saving | 6 | Pass — job-first h1 |
| Try it with sample data | 5 | Pass — result-naming action |
| Choose your file | 3 | Pass — result-naming action |
| Recipe file preview | 3 | Pass — section label |
| Inspect a recipe file | 4 | Pass — section heading |
| No file read | 3 | Pass — empty status |
| Clear recipe and results | 4 | Pass — names what is removed |
| Input | 1 | Pass — panel label |
| Recipe source | 2 | Pass — panel heading |
| Choose file | 2 | Pass — result-naming action |
| Paste JSON, JSON-LD, or Markdown | 5 | Pass — field label |
| Inspect recipe | 2 | Pass — result-naming action |
| Inspection | 1 | Pass — panel label |
| Parsed recipe | 2 | Pass — result heading |
| How recipe repair works | 4 | Pass — section label |
| Repair a recipe in three steps | 6 | Pass — section heading |
| Read the file | 3 | Pass — step heading |
| Review each repair | 3 | Pass — step heading |
| Choose an export format | 4 | Pass — step heading |
| Privacy and limits | 3 | Pass — section label |
| What stays in your browser | 5 | Pass — section heading |
| Terms | 1 | Pass — navigation destination |
| Built by Param Factory | 4 | Pass — named external destination |
| Original generated illustration | 3 | Pass — provenance label documented in `.factory/design.md` |

Demo controls were also checked: **Reset demo**, **Leave demo and clear sample**, **Show source**, **Clear recipe and results**, **Inspect recipe**, **Apply 3 suggested repairs**, **Undo last change**, **See exact change**, **Convert fraction**, **Fix decimal point**, **Use tsp**, **Add ingredient**, **Add step**, **Remove ingredient 1**, and **Download selected file** all use verbs and name their result.

### README sentences and sentence-like list items

| Sentence | Words | Result |
| --- | ---: | --- |
| Recipe Import Repair fixes broken recipe imports before saving them to a recipe app. | 14 | Pass |
| It is for people who run their own recipe app and need to fix a file before importing it. | 19 | Pass |
| Paste Recipe JSON, JSON-LD, or Markdown. | 6 | Pass — `format-import` |
| The tool separates the recipe into editable fields. | 8 | Pass — `format-import` |
| It flags malformed quantities, long units, missing data, invalid source URLs, and oversized fields. | 14 | Pass — `repair-diagnostics` |
| Each suggested repair shows the exact change and can be undone. | 11 | Pass — `exact-change-preview`, `reversible-repairs` |
| Download Schema.org Recipe JSON-LD or a repaired file in the original format. | 12 | Pass — `portable-export` |
| Both downloads can be imported into this tool again. | 9 | Pass — `portable-export` |
| A repair-details JSON download preserves the source URL, author, ISO export time, and parsed ingredient fields. | 16 | Pass — `neutral-export` |
| Recipe text stays in the browser. | 6 | Pass — `local-only` |
| The app works offline after the first visit. | 8 | Pass — `offline-reload` |
| The full repair and export flow is free and needs no account. | 12 | Pass — `free-flow` |
| Open `?demo=1`, `/demo`, or the deployed demo. | 7 | Pass |
| It loads “Rosemary tomato beans” with three repairable issues. | 9 | Pass — `demo-sample-issues` |
| Demo source uses a separate `demo:` session storage key and never enters real storage. | 14 | Pass — `demo-isolation` |
| Use Reset demo for a clean sample. | 7 | Pass — `demo-sample-issues` |
| Leave demo and clear sample discards it and opens a blank workspace. | 12 | Pass — `demo-isolation` |
| Requires Node.js 22 or newer. | 5 | Pass — package engine verified |
| Open `http://127.0.0.1:5173`. | 2 | Pass |
| `npm test` runs parser tests and browser claim tests. | 9 | Pass — verified |
| Playwright 1.58.2 is pinned. | 4 | Pass — package and lockfile verified |
| The production build lands in `dist/`, with `dist/index.html` at its root. | 11 | Pass — verified |
| Individual public claims can be checked with the commands in `.factory/claims.json`. | 11 | Pass — all commands run independently |
| For example: | 2 | Pass |
| JSON objects with common recipe fields | 6 | Pass — supported-input list item |
| JSON-LD `Recipe` objects, including recipes inside `@graph` | 7 | Pass — supported-input list item |
| Markdown with a title, Ingredients section, and Steps, Instructions, Directions, or Method section | 13 | Pass — supported-input list item |
| The tool never opens a source URL or changes cooking instructions. | 11 | Pass — `source-url-no-fetch`, `instructions-unchanged` |
| Recipe JSON-LD uses Schema.org `Recipe` fields for recipe apps that accept JSON-LD. | 12 | Pass — `portable-export` |
| Repaired original format keeps the input as JSON, JSON-LD, or Markdown. | 11 | Pass — `portable-export` |
| Repair details includes `schemaVersion`, an ISO `exportedAt` value, the recipe, and attribution. | 12 | Pass — `neutral-export` |
| Ingredients include repaired text, quantity, unit, and item fields. | 9 | Pass — `neutral-export` |
| Run the exact build command: | 5 | Pass |
| Deploy `./dist` to Azure Static Web Apps. | 7 | Pass — build output verified |
| `staticwebapp.config.json` provides the route fallback, security headers, and 404 rewrite. | 10 | Pass — config and live response verified |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

README headings **Recipe Import Repair**, **Try the isolated demo**, **Run locally**, **Test and build**, **Supported input**, **Export formats**, **Deploy**, and **License** all name their sections without metaphor or mood copy.

Terminology is consistent: **recipe source** is the pasted or selected input; **recipe** is the parsed content; **source URL** is attribution; **issue** is a detected problem; **repair** is a proposed change; **Recipe JSON-LD**, **repaired original**, and **repair details** are the three export choices; **demo** is the isolated sample mode.

## Demo and sandbox

- One click from the landing page opened `/?demo=1` with the realistic “Rosemary tomato beans” sample, six ingredients, three steps, and three suggested repairs.
- At 390 × 844, the h1 ended at 395.5 px, the populated sample title at 558.7 px, the first issue at 670.1 px, and **Apply 3 suggested repairs** at 730.9 px. The first screen already shows the product in use.
- The persistent banner says **“Demo — sample data, nothing is saved”** and provides **Reset demo** plus **Leave demo and clear sample**.
- Applying all repairs produced **Ready to export**. Reset restored the original title and all three issues.
- Seeded `localStorage["real:sentinel"]` and `sessionStorage["real:sentinel"]` values remained unchanged. Demo added only `sessionStorage["demo:recipe-import-repair:source"]`.
- Leaving removed only the `demo:` key, retained both real-data sentinels, opened `/`, and left the real recipe source empty.
- The complete landing → demo → apply → reset → leave request log contained only `https://recipe-import-repair.sociobot.in`. No recipe source URL or third-party origin was requested.
- The live offline-reload claim test passed after service-worker control.

The demo requirement and sandbox-isolation requirement pass.

## Claims

I cloned repository head `6d3dbae` into `/tmp/recipe-import-repair-review5.ZW8WeH/repo`, installed from the lockfile, and ran every exact manifest command independently.

| Claim id | Exact command | Result |
| --- | --- | --- |
| `format-import` | `npm test -- --grep @claim:format-import` | PASS |
| `reversible-repairs` | `npm test -- --grep @claim:reversible-repairs` | PASS |
| `neutral-export` | `npm test -- --grep @claim:neutral-export` | PASS |
| `portable-export` | `npm test -- --grep @claim:portable-export` | PASS |
| `demo-sample-issues` | `npm test -- --grep @claim:demo-sample-issues` | PASS |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `file-limit` | `npm test -- --grep @claim:file-limit` | PASS |
| `free-flow` | `npm test -- --grep @claim:free-flow` | PASS |
| `source-url-no-fetch` | `npm test -- --grep @claim:source-url-no-fetch` | PASS |
| `instructions-unchanged` | `npm test -- --grep @claim:instructions-unchanged` | PASS |
| `repair-diagnostics` | `npm test -- --grep @claim:repair-diagnostics` | PASS |
| `exact-change-preview` | `npm test -- --grep @claim:exact-change-preview` | PASS |

The full clean-clone gate also passed: typecheck, lint, 10 unit/config tests, 30 Chromium tests, and the production build. `dist/index.html` exists. Built JavaScript is 35.29 kB raw / 12.09 kB gzip. The clean-build and deployed JavaScript SHA-256 values both equal `f40fefe3b96c3ffdc9926cfb1ea090b075acb92c601e3ed5cd286868a275cade`.

Every claim-like sentence on the live landing, demo, Privacy, Terms, and README maps to an entry in `.factory/claims.json`. No unlisted, failed, or partly tested claim remains.

## Earlier finding verification

I read reviews 1–4, polish reports 1–4, and the prior handoff, then checked every finding against both the current source and matching live deployment.

| Earlier finding | Independent result |
| --- | --- |
| `F-1-1` metaphor and slogan copy | Fixed. All cited phrases are absent from live and source; direct task labels remain. |
| `F-1-2` vague **Start for real** exit | Fixed. **Leave demo and clear sample** names the result, removes only the demo key, and opens an empty workspace. |
| `F-1-3` unlisted three-issue sample claim | Fixed. `demo-sample-issues` is listed, passes, and Reset restores exactly three issues live. |
| `F-1-4` under-tested parsed export fields | Fixed. `neutral-export` asserts repaired text, quantity, unit, and item. |
| `F-2-1` unusable neutral-only export | Fixed. Recipe JSON-LD and repaired-original downloads round-trip for every supported source format. |
| `F-2-2` history scroll and focus | Fixed. The live regression restores scroll/focus and focuses the cross-route **How it works** heading. |
| `F-2-3` dead 404 skip link | Fixed. The live HTTP 404 has `main#main[tabindex="-1"]`; its skip-link and Axe checks pass. |
| `F-2-4` stale route social metadata | Fixed. Every route updates title, description, canonical, Open Graph, and Twitter fields; 404 metadata is complete. |
| `F-2-5` metaphorical **Clear bench** | Fixed. The disabled empty-state action is **Clear recipe and results**. |
| `F-2-6` self-hosting jargon | Fixed. The direct recipe-app audience sentence is live and in README. |
| `F-2-7` unexplained **checked steps** | Fixed. The live heading is **Repair a recipe in three steps**. |
| `F-2-8` unsupported **safe repairs** | Fixed. Actions consistently say **suggested repairs**. |
| `F-2-9` nonexistent marked punctuation | Fixed. The JSON error names commas, quotes, and brackets and gives a next action. |
| `F-2-10` untested `exportedAt` | Fixed. `neutral-export` validates a round-tripping ISO timestamp. |
| `F-2-11` dense README diagnostic sentence | Fixed. Parsing and diagnostics are separate sentences. |
| `F-2-12` inconsistent source-link terms | Fixed. User-facing copy consistently uses **source URL**. |
| `F-3-1` sample hidden below the mobile fold | Fixed. The named sample, editable title, first issue, and repair action all fit in the initial live mobile viewport. |
| `F-3-2` under-tested editable import fields | Fixed. `format-import` asserts title, source URL, ingredient, step, and a retained title edit for all three formats. |
| `F-4-1` real file selection had no visible result | Fixed. Valid and oversized files focus a visible result at both widths; the live success status names file, format, title, and issue count. |
| `F-4-2` privacy correction destination was missing | Fixed. The live instruction links to the repository issue tracker, identifies the new tab, and the destination returns 200. |

No earlier finding is reopened.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200. Their titles are **Recipe Import Repair — fix recipe import files**, **Demo — Recipe Import Repair**, **Privacy — Recipe Import Repair**, and **Terms — Recipe Import Repair**.
- Each application route has `lang="en"`, exactly one h1, a main landmark, a route-specific description, canonical URL, Open Graph/Twitter metadata, favicon, 180 × 180 apple-touch icon, and the consistent header/footer.
- The social image is a real 1200 × 630 product-specific asset. `robots.txt`, `sitemap.xml`, icons, and both images return 200; the sitemap lists every application route.
- An unknown route returns the designed notebook-style page with HTTP 404, complete metadata, `main#main[tabindex="-1"]`, and a working route home.
- The complete live link crawl found no dead link. Internal routes, in-page anchors, the repository issue tracker, and Param Factory all resolve.
- SPA navigation uses real URLs and `pushState`; the live suite passes deep links, back/forward scroll and focus restoration, route h1 focus/announcement, and cross-route section focus.
- The deployed 30-test suite passes keyboard behavior, 44 px touch targets, 200% text, mobile overflow, reduced motion, light/dark Axe scans, and console checks. `verify-url.sh` also reports one h1, `lang=en`, a main landmark, complete alt text, labeled buttons, and zero console/page errors on all four routes.
- Response headers include the same-origin CSP with `frame-ancestors` delivered as a header, HSTS, `nosniff`, referrer policy, and permissions policy.
- The warm graph paper, proof marks, tactile bordered controls, system handwriting/monospace pairing, editorial repair illustration, and matching 404 form a distinct recipe-repair identity rather than a generic SaaS template. `.factory/design.md` records palette, type, spacing, motion, and asset provenance.

## Missed leverage

No obvious implied capability is missing. The product already imports JSON, JSON-LD, and Markdown; exposes editable fields and reversible deterministic repairs; and exports Recipe JSON-LD, repaired originals, and repair details. Sync is outside the brief's pre-import scope. A model-assisted repair would weaken the deterministic job, so no Sociobot-gateway AI step is warranted. No decorative AI, analytics, provider call, or embedded provider key is present.

## What would make this perfect

Nothing remains to change for the reviewed scope. The first read, real file path, isolated demo, claims, copy, routing, accessibility, privacy behavior, portable exports, and documented visual identity all pass without a finding.
