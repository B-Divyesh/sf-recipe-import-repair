# Adversarial first-read review 4 — FAIL

- Product: Recipe Import Repair
- URL reviewed: <https://recipe-import-repair.sociobot.in>
- Date: 2026-08-29 UTC
- Repository head reviewed: `c3fb608cc69239e00d33b593fc397da740234faf`
- Viewports: fresh Chromium contexts at 390 × 844 and 1440 × 900
- Result: **FAIL** — one blocking and one minor finding remain. All 14 listed claim commands and all 28 live browser tests pass.

## Findings

### F-4-1 — BLOCKING — choosing a real file gives no visible result or focus change

**Exact copy / location:** landing action **“Choose your file”** (`src/main.ts:325`); file-change handler (`src/main.ts:552-560`). The handler reads and parses the file, calls `render()`, and leaves the page at the hero. It checks the nonexistent id `home-file`; the actual hero input id is `hero-file`.

**Evidence:** in fresh live contexts, I selected a valid JSON recipe named “Cold visitor pasta” through the hero control. The internal format changed to `JSON source`, so parsing succeeded. In both viewports, `scrollY` remained `0`, focus fell to `<body>`, and the visible hero remained unchanged. The parsed title field began at 2,684.7 px on the 390 × 844 viewport and 1,597.9 px on the 1440 × 900 viewport. The only nearby status still read **“The sample opens with three repairable issues,”** which describes the other action. A visitor can reasonably conclude that file selection did nothing. An oversized-file error is rendered in the same off-screen workbench.

**Why this blocks:** the sample path is clear, but the real job-to-be-done begins with the adjacent file picker. A successful real-file action provides no visible confirmation, result, error, or focus target within the current screen. That fails the end-to-end real workflow on both phone and desktop.

**Concrete fix:** when `#hero-file` changes, parse the file and move focus and scroll to the workbench result heading or a visible import status. For an invalid or oversized file, move focus to the visible alert. Replace the dead `home-file` branch with an explicit `hero-file` path. Add a 390 px browser test that selects a valid fixture through `#hero-file` and asserts the parsed title or status is in the viewport and focused or announced; add the equivalent oversized-file assertion.

### F-4-2 — Minor — the privacy page tells visitors to use a repository it never links

**Exact quote / location:** **“Open an issue in the product repository if this policy needs correction.”** on `/privacy` (`src/main.ts:458`).

**Evidence:** the complete live link crawl contains Home, Demo, How it works, Privacy, Terms, and Param Factory links, but no product-repository or issue-tracker link.

**Why this matters:** the instruction names an action without giving the destination, so a visitor cannot carry it out from the site.

**Concrete fix:** link **“Open an issue in the Recipe Import Repair repository”** to <https://github.com/B-Divyesh/sf-recipe-import-repair/issues>, identify it as an external link, and include it in the link crawl.

## Cold first read

Before scrolling, my interpretation at both widths was:

- What it does: fixes broken recipe-import files before they are saved or imported.
- Who it is for: people who run their own recipe app and need to repair an import file.
- What to click first: **“Try it with sample data.”**

The exact text that supplied those answers was **“Fix broken recipe imports before saving,”** **“For people who run their own recipe app and need to fix a file before importing it,”** and **“Try it with sample data.”** At 390 px the sample action and all three facts fit in the first 844 px. The cold first-read requirement passes. F-4-1 concerns the separate real-file action on that screen.

## Copy audit

Counts treat whitespace-separated tokens as words; standalone punctuation such as the em dash is not a word. Hyphenated terms, URLs, code names, and `$0` count as one word. No sentence exceeds 22 words. No banned marketing adjective, jargon, inconsistent product term, metaphor heading, mood heading, or empty slogan remains. F-4-1 is a behavior defect, not a wording flag.

### Landing-page sentences and sentence-like copy

| Sentence | Words | Result |
| --- | ---: | --- |
| For people who run their own recipe app and need to fix a file before importing it. | 17 | Pass |
| The sample opens with three repairable issues. | 7 | Pass — `demo-sample-issues` |
| Files stay in this browser | 5 | Pass — `local-only` |
| Works offline after first visit | 5 | Pass — `offline-reload` |
| Free — no account needed | 4 | Pass — `free-flow` |
| An illustrated graph-paper notebook with recipe lines and red correction marks. | 11 | Pass — useful image alt |
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

The home meta description, **“Inspect and repair JSON, JSON-LD, or Markdown recipe files before importing them into your recipe app”** (16 words), is also plain and covered by `format-import`.

### Landing headings, labels, and actions

| Copy | Words | Result |
| --- | ---: | --- |
| Recipe Import Repair | 3 | Pass — wordmark |
| Demo | 1 | Pass — navigation |
| How it works | 3 | Pass — navigation |
| Privacy | 1 | Pass — navigation |
| Repair recipe files in your browser | 6 | Pass — task label |
| Fix broken recipe imports before saving | 6 | Pass — job-first h1 |
| Try it with sample data | 5 | Pass — result-naming action |
| Choose your file | 3 | Pass wording; behavior fails F-4-1 |
| Recipe file preview | 3 | Pass — section label |
| Inspect a recipe file | 4 | Pass — section heading |
| No file read | 3 | Pass — status |
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
| Terms | 1 | Pass — footer link |
| Built by Param Factory | 4 | Pass — external link |
| Original generated illustration | 3 | Pass — provenance |

Demo controls were also checked: **Reset demo**, **Leave demo and clear sample**, **Show source**, **Clear recipe and results**, **Inspect recipe**, **Apply 3 suggested repairs**, **Undo last change**, **See exact change**, **Convert fraction**, **Fix decimal point**, **Use tsp**, **Add ingredient**, **Add step**, **Remove ingredient 1**, and **Download selected file** use verbs and name their result.

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
| Individual public claims can be checked with the commands in `.factory/claims.json`. | 11 | Pass — all commands run |
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
| Deploy `./dist` to Azure Static Web Apps. | 7 | Pass — build output verified |
| `staticwebapp.config.json` provides the route fallback, security headers, and 404 rewrite. | 10 | Pass — config and live headers verified |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

README headings **Try the isolated demo** (4), **Run locally** (2), **Test and build** (3), **Supported input** (2), **Export formats** (2), **Deploy** (1), and **License** (1) all name their section. Terminology remains consistent: recipe source, recipe, source URL, issue, repair, undo, Recipe JSON-LD, repaired original, repair details, and demo.

## Demo and sandbox

- The first click from the landing page opens `/?demo=1` with the realistic “Rosemary tomato beans” sample, six ingredients, three steps, and exactly three repairs.
- At 390 × 844, the named h1 ends at 395.5 px, the populated Sample title at 558.7 px, the first issue at 670.1 px, and **Apply 3 suggested repairs** at 730.9 px. No scroll is needed.
- The persistent banner says **“Demo — sample data, nothing is saved”** and includes **Reset demo** plus **Leave demo and clear sample**.
- Editing the sample and applying all repairs leaves a seeded `localStorage["real:sentinel"]` and `sessionStorage["real:sentinel"]` unchanged. Demo creates only `sessionStorage["demo:recipe-import-repair:source"]`.
- Reset restores the original title and three repairs. Leaving removes only the demo key, preserves both real-data sentinels, and opens an empty normal workspace.
- The complete landing → demo → edit → apply → reset → leave request log contains only `recipe-import-repair.sociobot.in`. The controlled offline test also passes.

The demo requirement passes. F-4-1 is the separate real-file path.

## Claims

I cloned the reviewed repository to `/tmp/recipe-import-repair-review4.y4ofPU/repo`, installed from the lockfile, and ran every manifest command independently.

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

The clean-clone full gate also passes: 10 unit/config tests, 28 Chromium tests, and `npm run build`. The built JavaScript is 34.73 kB raw / 11.94 kB gzip, and `dist/index.html` exists. The built and live JavaScript SHA-256 values both equal `b35319f3004faf3088608e6672c074756525b848f97d45fd42a5d9ac5668d557`.

Every claim-like product sentence on the live landing, demo, Privacy, Terms, and README maps to a manifest entry. No unlisted claim and no failed or partly tested manifest claim remains.

## Earlier finding verification

I read all three earlier reviews, all three polish reports, and the prior handoff, then checked every earlier finding in both deployed behavior and current source.

| Earlier finding | Independent result |
| --- | --- |
| `F-1-1` metaphor and slogan copy | Fixed. All cited phrases are absent; the direct task labels remain live and in source. |
| `F-1-2` vague **Start for real** exit | Fixed. **Leave demo and clear sample** names the result, clears the demo key, and opens an empty workspace. |
| `F-1-3` unlisted three-issue sample claim | Fixed. `demo-sample-issues` exists, passes, and Reset restores exactly three repairs live. |
| `F-1-4` under-tested parsed export fields | Fixed. `neutral-export` asserts repaired text, quantity, unit, and item. |
| `F-2-1` unusable neutral-only export | Fixed. Recipe JSON-LD and repaired-original exports round-trip for all supported formats. |
| `F-2-2` history scroll and focus | Fixed. The live regression restores scroll/focus and focuses the cross-route How it works heading. |
| `F-2-3` dead 404 skip link | Fixed. The live HTTP 404 has `main#main[tabindex="-1"]`; skip-link and Axe tests pass. |
| `F-2-4` stale route social metadata | Fixed. Every application route updates title, description, canonical, Open Graph, and Twitter fields; the static 404 metadata is complete. |
| `F-2-5` metaphorical **Clear bench** | Fixed. The disabled empty-state action is **Clear recipe and results**. |
| `F-2-6` self-hosting jargon | Fixed. The plain recipe-app audience sentence is live and in README. |
| `F-2-7` unexplained **checked steps** | Fixed. The live heading is **Repair a recipe in three steps**. |
| `F-2-8` unsupported **safe repairs** | Fixed. Actions consistently say **suggested repairs**. |
| `F-2-9` nonexistent marked punctuation | Fixed. The malformed-JSON error names commas, quotes, and brackets and gives a next action. |
| `F-2-10` untested `exportedAt` | Fixed. `neutral-export` validates an ISO timestamp and exact round trip. |
| `F-2-11` dense README diagnostic sentence | Fixed. Parsing and diagnostics are separate sentences. |
| `F-2-12` inconsistent source-link terms | Fixed. User-facing copy consistently uses **source URL**. |
| `F-3-1` sample hidden below the mobile fold | Fixed. The named sample, editable title, issue summary, concrete issue, and apply action all end above 731 px live. |
| `F-3-2` under-tested editable import fields | Fixed. `format-import` asserts title, source URL, ingredient, step, and a retained title edit for all three formats. |

No earlier finding is reopened. F-4-1 and F-4-2 are newly observed.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown path returns the designed HTTP 404. `robots.txt`, `sitemap.xml`, favicon, apple-touch icon, and the 1200 × 630 social image return 200.
- Each route has `lang="en"`, exactly one h1, a main landmark, a route-specific title in the required pattern, a description, canonical URL, Open Graph/Twitter metadata, and the consistent header/footer. The sitemap lists all four application routes.
- The link crawl found no broken actual link: internal routes and anchors resolve, and the external Param Factory link returns 200. The missing repository destination is F-4-2.
- The live 28-test suite passes history/back restoration, route focus and announcement, keyboard repair focus, mobile overflow, 44 px targets, 200% text, reduced motion, console checks, and Axe scans of Home, Demo, Privacy, Terms, and 404 in light and dark modes.
- `/opt/fleet/lib/verify-url.sh` passes Home, Demo, Privacy, and Terms with one h1, `lang=en`, a main landmark, image alt text, labeled buttons, and zero console/page errors.
- Response headers include a same-origin CSP with `frame-ancestors` sent as a header, `nosniff`, referrer policy, permissions policy, and HSTS. No third-party font, script, analytics, model call, or provider key is present.
- The graph-paper repair notebook, proof marks, illustrated still life, type pairing, tactile controls, and matching 404 are distinct and product-specific rather than a generic SaaS template. `.factory/design.md` records the tokens, spacing, motion, and original generated-asset provenance.

## Missed leverage

The brief requires deterministic local inspection, reversible repair, and portable output. The product already imports JSON, JSON-LD, and Markdown and exports Recipe JSON-LD, repaired originals, and repair details. A model would add uncertainty to this job, so no Sociobot-gateway AI step is warranted. Sync is not implied by the pre-import repair scope. No decorative AI or embedded provider key exists.

The obvious missing leverage is not another feature; it is completing the existing hero file-import interaction described in F-4-1.

## What would make this perfect

Resolve F-4-1 by making successful and failed hero file selections visibly land at a focused or announced workbench result. Resolve F-4-2 by linking the privacy contact instruction to the repository issue tracker. Add regressions for both, then rerun every claim command, the full clean-clone and live suites, the storage/request probe, link crawl, and both cold viewports. Nothing else remains open.
