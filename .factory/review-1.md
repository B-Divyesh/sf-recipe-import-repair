# Adversarial first-read review 1 — FAIL

- Product: Recipe Import Repair
- URL reviewed: <https://recipe-import-repair.sociobot.in>
- Date: 2026-08-29 UTC
- Viewports: fresh Chromium contexts at 390 × 844 and 1440 × 900
- Result: **FAIL** — four minor findings remain. No blocking functional, demo-isolation, privacy, routing, or listed-claim test failed.

## Cold first read

Before scrolling, both viewports say **“Fix broken recipe imports before saving.”** It is clear this repairs malformed recipe files before import, for self-hosted recipe-keeper users, and that the first action is **“Try it with sample data.”** The support sentence and three facts are visible at 390 px. This passes first-read clarity.

The one-click action immediately opened `/demo` with the realistic “Rosemary tomato beans” JSON-LD source, three visible repairs, and editable fields. The persistent strip said **“Demo — sample data, nothing is saved”** and provided Reset demo plus Start for real. Applying repairs changed only `sessionStorage["demo:recipe-import-repair:source"]`; `localStorage` remained empty. Reset restored three issues. Start for real cleared the demo key and opened an empty bench. The request log contained only the site origin. An offline reload after service-worker control retained the sample bench.

## Findings

### F-1-1 — Minor — metaphor and slogan copy obscures otherwise plain labels

**Locations / exact copy:** landing eyebrow **“A local repair bench for recipe files”** (`src/main.ts:285`), eyebrow **“Live workbench”** and heading **“Bring one recipe file”** (`src/main.ts:301`), labels **“Method”** / **“Bench limits”** and heading **“Your recipe stays yours”** (`src/main.ts:305`, `src/main.ts:313`), caption **“Inspect the lines. Apply named changes. Keep the source.”** (`src/main.ts:297`), and README **“The bench separates each field…”** (`README.md:5`).

**Why:** “bench,” “workbench,” “lines,” and “marks” are notebook metaphors, not the task words. “Your recipe stays yours” is a slogan, not a section name. The headline is clear, but these headings do not stand alone for a screen-reader or hurried visitor.

**Concrete fix:** use “Repair recipe files in your browser,” “Recipe file preview,” “Inspect a recipe file,” “How recipe repair works,” “Privacy and limits,” and “What stays in your browser.” Replace the caption with “Inspect recipe fields. Review each repair. Preserve source attribution.” Use “The tool separates each field…” in the README.

### F-1-2 — Minor — demo exit control does not name its result

**Location / exact copy:** demo-strip link **“Start for real”** (`src/main.ts:253`).

**Why:** it does not say it leaves demo mode, discards the sample, and opens a blank real workspace. Those are material consequences for a privacy-sensitive file tool.

**Concrete fix:** use **“Leave demo and clear sample”** (or **“Start with my recipe”**) and state the sample is discarded adjacent to the link.

### F-1-3 — Minor — quantified sample claim is absent from claims.json

**Location / exact copy:** **“The sample opens with three repairable issues.”** (`src/main.ts:292`) and **“It loads ‘Rosemary tomato beans’ with three repairable lines.”** (`README.md:11`).

**Why:** neither statement has a `.factory/claims.json` entry. Existing tests inspect the demo, but no manifest claim promises that the sample starts with exactly three repairable issues.

**Concrete fix:** add a `demo-sample-issues` claim and clean-context test for `/demo` that asserts the sample title and exactly three repairable issues; cite both locations. Or remove the count.

### F-1-4 — Minor — README export-shape promise is only partly tested/listed

**Location / exact copy:** **“Ingredient lines keep both their original repaired text and parsed quantity, unit, and item fields.”** (`README.md:49`).

**Why:** `neutral-export` verifies a schema version, repaired raw ingredient text, source URL, and author. It does not name or assert the promised quantity, unit, and item fields, and no other manifest entry covers them.

**Concrete fix:** extend `neutral-export` (or add `ingredient-export-fields`) to assert quantity, unit, and item in the downloaded JSON. Update the manifest claim and README location.

## Copy audit

Counts treat hyphenated terms, URLs, code tokens, and `$0` as one word. No landing or README sentence exceeds 22 words. Flags below map to F-1-1 through F-1-4.

### Landing-page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| For self-hosted recipe keepers who need clear fixes before an import changes their collection. | 14 | Pass |
| The sample opens with three repairable issues. | 7 | F-1-3 |
| Files stay in this browser. | 5 | Pass (`local-only`) |
| Works offline after first visit. | 5 | Pass (`offline-reload`) |
| Free — no account needed. | 4 | Pass (`free-flow`) |
| Inspect the lines. | 3 | F-1-1 |
| Apply named changes. | 3 | F-1-1 |
| Keep the source. | 3 | F-1-1 |
| Paste JSON, JSON-LD, or Markdown. | 5 | Pass (`format-import`) |
| You see the parsed fields before you export anything. | 9 | Pass (`format-import`) |
| Maximum file size: 2 MB. | 5 | Pass (`file-limit`) |
| Web addresses are preserved and never fetched. | 7 | Pass (`source-url-no-fetch`) |
| Your parsed fields will appear here. | 6 | Pass |
| Paste recipe text or choose a file. | 7 | Pass |
| Then inspect it. | 3 | Pass |
| The bench separates title, source, ingredients, and steps. | 8 | F-1-1 |
| Every suggested repair shows its exact before and after value. | 10 | Pass (`exact-change-preview`) |
| The export keeps attribution and uses a documented JSON shape. | 10 | Pass (`neutral-export`) |
| The tool does not fetch recipe pages. | 7 | Pass (`source-url-no-fetch`) |
| Repairs do not change cooking instructions. | 6 | Pass (`instructions-unchanged`) |
| No recipe text leaves your device. | 6 | Pass (`local-only`) |
| No account is required. | 4 | Pass (`free-flow`) |

Non-sentence labels/headings were also checked. **“Try it with sample data,” “Choose your file,” “Inspect recipe,” “Apply 3 safe repairs,” “Undo last change,”** and **“Export neutral JSON”** are result-naming actions. **“Start for real”** is F-1-2. **“A local repair bench for recipe files,” “Live workbench,” “Method,” “Bench limits,”** and **“Your recipe stays yours”** are F-1-1; remaining headings name a task or visible result.

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Recipe Import Repair fixes broken recipe imports before saving them to a recipe keeper. | 14 | Pass |
| It is for people who move their own recipes between self-hosted apps. | 12 | Pass |
| Paste Recipe JSON, JSON-LD, or Markdown. | 5 | Pass (`format-import`) |
| The bench separates each field and points to malformed quantities, verbose units, missing data, invalid source addresses, and oversized fields. | 20 | F-1-1; diagnostics listed |
| Each automatic repair shows the exact change and can be undone. | 11 | Pass |
| A neutral JSON export preserves the source URL and author. | 10 | Pass (`neutral-export`) |
| Recipe text stays in the browser. | 6 | Pass (`local-only`) |
| The app works offline after the first visit. | 8 | Pass (`offline-reload`) |
| The full repair and export flow is free and needs no account. | 12 | Pass (`free-flow`) |
| Open `/demo` or the deployed demo. | 6 | Pass |
| It loads “Rosemary tomato beans” with three repairable lines. | 9 | F-1-3 |
| Demo source uses a separate `demo:` session storage key and never enters real storage. | 14 | Pass (`demo-isolation`) |
| Use **Reset demo** for a clean sample. | 7 | Pass |
| Requires Node.js 22 or newer. | 5 | Pass (package engine) |
| Open `http://127.0.0.1:5173`. | 2 | Pass |
| `npm test` runs parser tests and browser claim tests. | 8 | Pass (verified) |
| Playwright 1.58.2 is pinned. | 4 | Pass (verified) |
| The production build lands in `dist/`, with `dist/index.html` at its root. | 12 | Pass (verified) |
| Individual public claims can be checked with the commands in `.factory/claims.json`. | 11 | Pass (verified) |
| For example: | 2 | Pass |
| The tool never fetches a recipe URL or changes cooking instructions. | 10 | Pass (`source-url-no-fetch`, `instructions-unchanged`) |
| Exports include `schemaVersion`, `exportedAt`, the normalized `recipe`, and an `attribution` object. | 10 | Pass (`neutral-export`) |
| Ingredient lines keep both their original repaired text and parsed quantity, unit, and item fields. | 14 | F-1-4 |
| Run the exact build command: | 5 | Pass |
| Deploy `./dist` to Azure Static Web Apps. | 7 | Pass (verified locally) |
| `staticwebapp.config.json` provides the route fallback, security headers, and 404 rewrite. | 9 | Pass (verified locally/live) |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

## Claims and clean-clone evidence

I read all 12 `.factory/claims.json` entries and ran every listed command from a fresh `git clone /work/repo` with `npm ci`; all passed. `npm test` also passed 8 unit/config and 21 browser tests. `npm run build` passed with `dist/index.html` present. The deployed `assets/index-BARfxwwI.js` SHA-256 equals the fresh build hash `97ca5fc88ece8df914cf8a61262154ef2e13bb2deb7f320cd19824554250e82f`.

The live request capture for landing → demo → repair → reset → leave contained only `https://recipe-import-repair.sociobot.in` requests. The controlled offline reload displayed **“Repair this sample recipe”** and bundled source after network disable. This confirms listed privacy/offline claims. F-1-3 and F-1-4 are unlisted or under-tested promises found during the copy cross-check.

## History check

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist. I read the existing handoff and verification reports. Their historic 31-change undo boundary and overlapping batch-repair findings are fixed in the reviewed artifact: the current `@claim:reversible-repairs` test passes the 31-change sequence and the overlapping-batch regression passes. The matching live build hash confirms this is not only report text.

## Structure and visual checks

The product has a distinct repair-notebook visual identity, not a generic SaaS template. `/`, `/demo`, `/privacy`, and `/terms` returned HTTP 200; the designed unknown-route page returned HTTP 404. The page has one h1, route-specific title/description/canonical, favicon, apple icon, OG image, robots, sitemap, CSP, consistent header/footer, Privacy and Terms, and no tested dead links. Back navigation from Privacy to Demo restored the title and focused its h1 with no console messages.

The brief implies a deterministic local repair utility. It already offers the expected import, inspect, repair, undo, and neutral export path; an AI feature is neither required nor useful here.

## What would make this perfect

Resolve F-1-1 through F-1-4, rerun the clean-clone manifest commands, and repeat the 390 px cold read. Then this should be eligible for PASS.
