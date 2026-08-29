# Adversarial first-read review 3 — FAIL

- Product: Recipe Import Repair
- URL reviewed: <https://recipe-import-repair.sociobot.in>
- Date: 2026-08-29 UTC
- Viewports: fresh Chromium contexts at 390 × 844 and 1440 × 900
- Result: **FAIL** — one blocking and one minor finding remain. All 14 listed claim commands pass, but the mobile demo does not show real sample content in its first viewport and one core claim is under-tested.

## Cold first read

Before scrolling, I understood the page as: “This fixes broken recipe-import files before I put them into my recipe app. It is for people who run their own recipe app. I should select **Try it with sample data** first.”

Both viewports show **“Fix broken recipe imports before saving,”** **“For people who run their own recipe app and need to fix a file before importing it,”** and **“Try it with sample data.”** All three facts also fit in the 390 × 844 viewport; the facts end at 789 px. The landing-page what / who / first-action check passes.

## Findings

### F-3-1 — BLOCKING — the mobile demo's first screen hides the realistic sample and every repair action

**Exact copy / location:** after selecting **“Try it with sample data”** at 390 × 844, the first screen shows **“Repair this sample recipe,”** **“The sample includes a fraction, a malformed decimal, and a long unit,”** and the toolbar label **“JSON-LD source.”** It does not show **“Rosemary tomato beans,”** a populated recipe field, a repair issue, or **“Apply 3 suggested repairs.”** This layout comes from `demoPage()` followed by the source-first `workbench(true)` in `src/main.ts` and the single-column mobile grid in `src/styles.css`.

**Evidence:** in a fresh live context, the populated source textarea starts at 833.3 px and only its border enters the 844 px viewport. The first repair starts at 1,671.7 px, the apply action at 1,517.1 px, and the populated title field at 2,458.3 px. The screenshot is `.factory/qa-artifacts/review-3/demo-mobile.png`.

**Why this fails:** the required one-click demo must immediately look like the product being used with realistic data. A phone visitor gets a generic heading and toolbar, then must scroll more than one viewport before seeing an issue or usable repair action. The sample is loaded, but its value is not demonstrated on the first screen.

**Concrete fix:** make the demo h1 name the sample, for example **“Repair Rosemary tomato beans.”** On mobile, put a compact parsed-result summary before the source editor with **“3 issues found,”** the three issue names, and **“Apply 3 suggested repairs.”** Keep the banner visible. Add a 390 × 844 test that opens the one-click URL without scrolling and asserts the sample name, issue count, and apply action all have `bottom <= window.innerHeight`.

### F-3-2 — Minor — the format-import claim test proves only the title, not the promised editable fields

**Exact claims / locations:** `.factory/claims.json` says **“Reads Recipe JSON, JSON-LD, and Markdown into editable fields.”** The landing page says **“The tool separates title, source, ingredients, and steps.”** README says **“The tool separates the recipe into editable fields.”**

**Evidence:** `@claim:format-import` supplies all three formats, but for each one it asserts only the title value and source-format badge. It never asserts the source URL, an ingredient, a step, or that a field can be edited. The command passes, and manual use confirms the current implementation works, but the listed test would still pass if every promised field except title regressed.

**Why this fails:** the editable field split is the core inspection result. A passing claim command does not currently protect the whole result a visitor is told to expect.

**Concrete fix:** extend `@claim:format-import` so every format fixture includes and asserts title, source URL, at least one ingredient, and at least one step. Edit one parsed field and assert the changed value remains after the rerender. Keep the manifest claim only after that coverage exists.

## Copy audit

Counts treat hyphenated terms, URLs, code tokens, and `$0` as one word. No sentence exceeds 22 words. No banned marketing adjective, mood heading, slogan, or inconsistent product term remains. F-3-2 is a test-coverage flag, not a request to weaken clear copy.

### Landing-page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| For people who run their own recipe app and need to fix a file before importing it. | 17 | Pass |
| The sample opens with three repairable issues. | 7 | Pass — `demo-sample-issues` |
| Files stay in this browser. | 5 | Pass — `local-only` |
| Works offline after first visit. | 5 | Pass — `offline-reload` |
| Free — no account needed. | 4 | Pass — `free-flow` |
| An illustrated graph-paper notebook with recipe lines and red correction marks. | 11 | Pass — useful image alt |
| Inspect recipe fields. | 3 | Pass |
| Review each repair. | 3 | Pass |
| Preserve source attribution. | 3 | Pass — `neutral-export`, `source-url-no-fetch` |
| Paste JSON, JSON-LD, or Markdown. | 5 | Pass — `format-import` |
| You see the parsed fields before you export anything. | 9 | Pass — coverage gap is F-3-2 |
| Maximum file size: 2 MB. | 5 | Pass — `file-limit` |
| Source URLs are preserved and never opened. | 7 | Pass — `source-url-no-fetch` |
| Your parsed fields will appear here. | 6 | Pass — useful empty state |
| Paste recipe text or choose a file. | 7 | Pass — useful empty state |
| Then inspect it. | 3 | Pass — useful next step |
| The tool separates title, source, ingredients, and steps. | 8 | F-3-2 test gap; copy is plain |
| Every suggested repair shows its exact before and after value. | 10 | Pass — `exact-change-preview` |
| Download Recipe JSON-LD or keep the source file format. | 9 | Pass — `portable-export` |
| The tool does not fetch recipe pages. | 7 | Pass — `source-url-no-fetch` |
| Repairs do not change cooking instructions. | 6 | Pass — `instructions-unchanged` |
| No recipe text leaves your device. | 6 | Pass — `local-only` |
| No account is required. | 4 | Pass — `free-flow` |
| Fix recipe files before importing them into your recipe app. | 10 | Pass — footer one-liner |

The meta description, **“Inspect and repair JSON, JSON-LD, or Markdown recipe files before importing them into your recipe app”** (16 words), is plain and covered by `format-import` subject to F-3-2.

### Landing headings, labels, and actions

| Copy | Words | Result |
| --- | ---: | --- |
| Repair recipe files in your browser | 6 | Pass — task label |
| Fix broken recipe imports before saving | 6 | Pass — job-first h1 |
| Try it with sample data | 5 | Pass — result-naming action |
| Choose your file | 3 | Pass — result-naming action |
| Recipe file preview | 3 | Pass — section label |
| Inspect a recipe file | 4 | Pass — section h2 |
| No file read | 3 | Pass — status |
| Clear recipe and results | 4 | Pass — names deleted results |
| Recipe source | 2 | Pass — panel heading |
| Choose file | 2 | Pass — result-naming action |
| Paste JSON, JSON-LD, or Markdown | 5 | Pass — field label |
| Inspect recipe | 2 | Pass — result-naming action |
| Parsed recipe | 2 | Pass — result heading |
| How recipe repair works | 4 | Pass — section label |
| Repair a recipe in three steps | 6 | Pass — section h2 |
| Read the file | 3 | Pass — step heading |
| Review each repair | 3 | Pass — step heading |
| Choose an export format | 4 | Pass — step heading |
| Privacy and limits | 3 | Pass — section label |
| What stays in your browser | 5 | Pass — section h2 |

The remaining visible controls were checked in the demo: **Reset demo**, **Leave demo and clear sample**, **Show source**, **Clear recipe and results**, **Inspect recipe**, **Apply 3 suggested repairs**, **Undo last change**, **See exact change**, the three named repair buttons, **Add ingredient**, **Add step**, and **Download selected file** all use verbs and name their result. Row removal buttons have accessible names such as **“Remove ingredient 1.”** No copy finding remains.

### README sentences and sentence-like list items

| Sentence | Words | Result |
| --- | ---: | --- |
| Recipe Import Repair fixes broken recipe imports before saving them to a recipe app. | 14 | Pass |
| It is for people who run their own recipe app and need to fix a file before importing it. | 19 | Pass |
| Paste Recipe JSON, JSON-LD, or Markdown. | 6 | Pass — `format-import` |
| The tool separates the recipe into editable fields. | 8 | F-3-2 test gap; copy is plain |
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
| Use **Reset demo** for a clean sample. | 7 | Pass — `demo-sample-issues` |
| **Leave demo and clear sample** discards it and opens a blank workspace. | 12 | Pass — `demo-isolation` |
| Requires Node.js 22 or newer. | 5 | Pass — package engine is `>=22` |
| Open `http://127.0.0.1:5173`. | 2 | Pass |
| `npm test` runs parser tests and browser claim tests. | 9 | Pass — verified |
| Playwright 1.58.2 is pinned. | 4 | Pass — package and lockfile verified |
| The production build lands in `dist/`, with `dist/index.html` at its root. | 11 | Pass — verified |
| Individual public claims can be checked with the commands in `.factory/claims.json`. | 11 | Pass — all 14 run |
| For example: | 2 | Pass |
| JSON objects with common recipe fields | 6 | Pass — input list item |
| JSON-LD `Recipe` objects, including recipes inside `@graph` | 7 | Pass — input list item |
| Markdown with a title, Ingredients section, and Steps, Instructions, Directions, or Method section | 13 | Pass — input list item |
| The tool never opens a source URL or changes cooking instructions. | 11 | Pass — `source-url-no-fetch`, `instructions-unchanged` |
| Recipe JSON-LD uses Schema.org `Recipe` fields for recipe apps that accept JSON-LD. | 12 | Pass — `portable-export` |
| Repaired original format keeps the input as JSON, JSON-LD, or Markdown. | 11 | Pass — `portable-export` |
| Repair details includes `schemaVersion`, an ISO `exportedAt` value, the recipe, and attribution. | 12 | Pass — `neutral-export` |
| Ingredients include repaired text, quantity, unit, and item fields. | 9 | Pass — `neutral-export` |
| Run the exact build command: | 5 | Pass |
| Deploy `./dist` to Azure Static Web Apps. | 7 | Pass — documented deployment instruction |
| `staticwebapp.config.json` provides the route fallback, security headers, and 404 rewrite. | 10 | Pass — config and live headers verified |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

README headings — **Try the isolated demo**, **Run locally**, **Test and build**, **Supported input**, **Export formats**, **Deploy**, and **License** — each names its section without metaphor or mood copy. Terminology is consistent: recipe source, recipe, source URL, issue, repair, undo, Recipe JSON-LD, repaired original, repair details, and demo.

## Demo and sandbox

- One click from the live landing page opens `/?demo=1` with the “Rosemary tomato beans” JSON-LD sample, six ingredients, three steps, and three repairable issues.
- The persistent strip says **“Demo — sample data, nothing is saved”** and exposes **Reset demo** and **Leave demo and clear sample**. Reset restores the title and all three repairs.
- A seeded `localStorage["real:sentinel"]` and `sessionStorage["real:session-sentinel"]` remained unchanged. Demo added only `sessionStorage["demo:recipe-import-repair:source"]`; leaving removed only that demo key and opened an empty source field.
- The landing → demo → apply → reset → leave request log contained only the product origin. No sample or source URL was requested from another host.
- The listed offline test passed from a fresh local browser context after service-worker control.

Isolation, reset, exit, privacy, and realistic data all work. F-3-1 is specifically the first mobile viewport presentation.

## Claims and clean-clone evidence

I cloned repository head `ffa933e` to `/tmp/recipe-import-repair-review3.aVs9Ej/repo`, ran `npm ci`, and ran every manifest command independently.

| Claim id | Command result |
| --- | --- |
| `format-import` | PASS; assertion coverage gap is F-3-2 |
| `reversible-repairs` | PASS |
| `neutral-export` | PASS |
| `portable-export` | PASS |
| `demo-sample-issues` | PASS |
| `local-only` | PASS |
| `demo-isolation` | PASS |
| `offline-reload` | PASS |
| `file-limit` | PASS |
| `free-flow` | PASS |
| `source-url-no-fetch` | PASS |
| `instructions-unchanged` | PASS |
| `repair-diagnostics` | PASS |
| `exact-change-preview` | PASS |

The full clean-clone gate also passed: 10 unit/config tests, 28 Chromium tests, and `npm run build`. Production output is 33.96 kB JS raw / 11.76 kB gzip and 17.17 kB CSS raw / 4.62 kB gzip. `dist/index.html` exists. The live JavaScript and clean-build JavaScript share SHA-256 `ca1f8961590497c1efb57a99403d275c52965aea7e7e5d2eeae473cd4d2f7d93`, so the reviewed source matches the deployment.

No live claim-like sentence is wholly absent from the manifest. F-3-2 is an under-tested listed claim, so the review still has an untested part and cannot pass.

## Earlier finding verification

I read `.factory/review-1.md`, `.factory/review-2.md`, `.factory/polish-1.md`, `.factory/polish-2.md`, and the prior handoff. I then checked every earlier finding against the matching source and live site.

| Earlier finding | Independent result |
| --- | --- |
| `F-1-1` metaphor/slogan copy | Fixed. All cited phrases are absent; direct task labels are live. |
| `F-1-2` **Start for real** | Fixed. The live exit says **Leave demo and clear sample**, removes the demo key, and opens a blank workspace. |
| `F-1-3` unlisted three-issue claim | Fixed. `demo-sample-issues` exists, passes, and reset restores exactly three repairs live. |
| `F-1-4` parsed export fields | Fixed. `neutral-export` asserts repaired text, quantity, unit, and item in the download. |
| `F-2-1` dead-end neutral export | Fixed. Live export offers Recipe JSON-LD, repaired original, and repair details; `portable-export` round-trips all supported originals. |
| `F-2-2` history scroll/focus | Fixed. The live regression restores scroll/focus and focuses the cross-route How it works heading. |
| `F-2-3` 404 skip link | Fixed. The live HTTP 404 has `main#main[tabindex="-1"]`; the skip-link and Axe tests pass. |
| `F-2-4` route social metadata | Fixed. Each application route updates title, description, canonical, Open Graph, and Twitter fields; 404 metadata is complete. |
| `F-2-5` **Clear bench** | Fixed. Live copy is **Clear recipe and results**, disabled when empty. |
| `F-2-6` self-hosting jargon | Fixed. The direct recipe-app audience sentence is live and in README. |
| `F-2-7` **checked steps** | Fixed. Live heading is **Repair a recipe in three steps**. |
| `F-2-8` **safe repairs** | Fixed. Live action says **suggested repairs**. |
| `F-2-9` nonexistent marked punctuation | Fixed. The live error names commas, quotes, and brackets and gives a next action. |
| `F-2-10` untested `exportedAt` | Fixed. `neutral-export` asserts a valid round-tripping ISO timestamp. |
| `F-2-11` dense README sentence | Fixed. Parsing and diagnostics are separate sentences. |
| `F-2-12` inconsistent source-link terms | Fixed. User-facing copy consistently uses **source URL**. |

No earlier id is reopened. F-3-1 and F-3-2 are newly observed requirements gaps.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200. An unknown path returns a designed HTTP 404. The home link crawl found no dead target, including the external Param Factory link.
- Each route has `lang="en"`, one h1, a main landmark, a route-specific title in the required pattern, description, canonical, OG/Twitter metadata, favicon, apple-touch icon, and consistent header/footer. Robots and sitemap are present; the sitemap lists all four application routes.
- History/back, route focus, the live region, cross-route anchors, mobile overflow, 44 px targets, 200% text, keyboard repair focus, reduced motion, light/dark Axe scans, and console checks pass. The standalone live Axe rerun passed with zero violations after the aggregate 30-second run hit only its timeout.
- `/opt/fleet/lib/verify-url.sh` passed Home, Demo, Privacy, and Terms with one h1, `lang=en`, a main landmark, image alt text, labeled buttons, and zero console/page errors.
- Live headers include a same-origin CSP with `frame-ancestors` in the response, `nosniff`, referrer policy, permissions policy, and HSTS. No third-party fonts, scripts, analytics, provider keys, or model calls were found.
- The graph-paper repair notebook, proof marks, generated editorial still life, system type pairing, tactile controls, and matching 404 form a distinct product-specific identity. It is not a generic SaaS template. Asset provenance is recorded in `.factory/design.md`.

F-3-1 is the only structure/demo failure.

## Missed leverage

The brief calls for deterministic local inspection and reversible repair. The tool already imports the three promised formats, supports editing and undo, and exports Recipe JSON-LD, repaired originals, and repair details. An AI feature would add uncertainty without filling an implied need, so no Sociobot-gateway feature is warranted. No decorative AI or embedded provider key exists.

## What would make this perfect

Resolve F-3-1 by showing the named sample, issue summary, and repair action in the initial 390 × 844 demo viewport. Resolve F-3-2 by asserting all promised parsed fields and one edit for every input format. Then rerun every manifest command from a clean clone, the full local/live suite, the storage/request probe, and the cold mobile screenshot. Nothing else remains open.
