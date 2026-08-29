# Adversarial first-read review 2 — FAIL

- Product: Recipe Import Repair
- URL reviewed: <https://recipe-import-repair.sociobot.in>
- Date: 2026-08-29 UTC
- Viewports: fresh Chromium contexts at 390 × 844 and 1440 × 900
- Result: **FAIL** — 3 blocking and 9 minor findings remain. All 13 listed claim commands pass, but three live claims are unlisted or under-tested.

## Cold first read

Before scrolling or reading repository copy, I interpreted the page as: “This checks and repairs broken recipe-import files before I add them to a recipe collection. It is for people who run their own recipe app. I should click **Try it with sample data** first.”

Both viewports expose the exact headline **“Fix broken recipe imports before saving,”** the audience line **“For self-hosted recipe keepers who need clear fixes before an import changes their collection,”** and the primary action **“Try it with sample data.”** The mobile first screen also shows all three facts by 816 px. The required what / who / first action test passes, although F-2-6 records avoidable jargon in the audience line.

## Findings

### F-2-1 — BLOCKING — the export does not complete the stated move to another recipe keeper

**Exact copy / locations:** demo result **“Ready for another recipe keeper.”** and **“Export neutral JSON”** (`src/main.ts:398`); landing **“Export a neutral file”** and **“The export keeps attribution and uses a documented JSON shape.”** (`src/main.ts:310`); README heading **“Neutral export shape”** (`README.md:47`).

**Evidence:** I repaired the live sample, downloaded `rosemary-tomato-beans-neutral.json`, and pasted that exact download into the product. The importer returned an empty title, zero ingredients, zero steps, and three blocking errors. The export is a product-specific envelope with `schemaVersion`, `exportedAt`, `recipe`, and `attribution`, while the importer reads recipe fields only at the JSON root. No supported recipe keeper or conversion step is named. The phrase “Ready for another recipe keeper” is also absent from `.factory/claims.json`.

**Why this fails:** the brief's job is moving a recipe between formats before committing it. A first-time visitor receives a file but no usable path into another recipe keeper. “Neutral” does not name a standard or compatible destination, and the readiness claim is unproved.

**Concrete fix:** export at least Recipe JSON-LD and the repaired original format, with a format selector and plain compatibility notes. Add fixtures proving each download round-trips through the relevant parser or a named recipe keeper. List and test any retained compatibility claim. Remove **“Ready for another recipe keeper”** until that proof exists.

### F-2-2 — BLOCKING — route history does not restore scroll, and one cross-route link loses focus

**Exact location:** `changeRoute()` always runs `window.scrollTo({ top: 0, ... })` (`src/main.ts:101-120`), and header **“How it works”** is a normal `/#how-it-works` link rather than a handled route (`src/main.ts:259`).

**Evidence:** from the live home page at `scrollY = 1200`, I navigated to Privacy and used Back. The URL and h1 returned, but `scrollY` became `0`, not `1200`. From Privacy, selecting **“How it works”** opened the correct section at `/#how-it-works`, but `document.activeElement` remained `<body>` rather than the route h1 or section heading. Demo → Privacy → Back did focus the demo h1, so the failure is specific and reproducible rather than a total routing failure.

**Why this fails:** back/forward does not restore the visitor's place, and the cross-route anchor gives keyboard and screen-reader users no useful focus target. The required routing behavior explicitly includes history, scroll, focus, and announcement.

**Concrete fix:** store scroll/focus per history entry, distinguish push navigation from `popstate`, and restore saved state on back/forward. Handle cross-route section links through the router; focus/announce the new h1 and then scroll the named section into view. Add browser tests for both cases.

### F-2-3 — BLOCKING — the designed 404 has a dead skip link

**Exact location:** `public/404.html:13` links to `#main`, but the `<main>` at line 15 has no `id="main"`.

**Evidence:** the live unknown route correctly returned HTTP 404 and showed the designed page, but Axe reported `skip-link` and `region` violations: **“No skip link target.”** Activating the first keyboard link cannot move focus to the main content.

**Why this fails:** this is a dead internal link on a required route and breaks the keyboard bypass mechanism.

**Concrete fix:** add `id="main"` and a programmatically focusable target if needed. Run Axe without filtering out moderate violations and add a test that activates the skip link and confirms focus reaches `<main>`.

### F-2-4 — Minor — route social metadata is stale or missing

**Exact location:** `updateMeta()` changes only title, description, and canonical (`src/main.ts:88-93`). On live `/demo`, `/privacy`, and `/terms`, `og:title` remains **“Recipe Import Repair — fix recipe files locally”** and `og:description` remains the home description. The live 404 has no canonical, Open Graph, Twitter, or apple-touch metadata (`public/404.html:3-10`).

**Why this fails:** shared policy/demo URLs describe the home route, while the 404 omits required metadata. A crawler that does not execute the SPA receives home metadata for every application route.

**Concrete fix:** produce route-specific HTML heads (preferred for crawlers), or at minimum update Open Graph and Twitter tags with the route metadata. Add canonical, OG/Twitter image fields, theme color, and apple-touch icon to `404.html`; test the rendered head for every route.

### F-2-5 — Minor — “Clear bench” is a metaphor and does not name what is deleted

**Exact copy / location:** landing work area button **“Clear bench”** (`src/main.ts:382`).

**Why this fails:** “bench” is notebook lore, not the user's recipe or result. The control clears the pasted source, parsed recipe, issues, and undo history, which the label does not disclose. This is a remaining instance of the copy class addressed in review 1, although the exact phrases listed in F-1-1 were removed.

**Concrete rewrite:** **“Clear recipe and results.”** Hide or disable it when nothing has been entered.

### F-2-6 — Minor — the audience description uses unexplained jargon

**Exact copy / locations:** **“For self-hosted recipe keepers…”** (`src/main.ts:288`) and **“people who move their own recipes between self-hosted apps”** (`README.md:3`).

**Why this fails:** “self-hosted” is infrastructure jargon in the sentence that must identify the visitor. “Recipe keeper” is also less direct than “recipe app.”

**Concrete rewrite:** **“For people who run their own recipe app and need to fix a file before importing it.”** Use the same wording in the README.

### F-2-7 — Minor — “checked steps” implies proof but gives no information

**Exact copy / location:** heading **“Repair in three checked steps”** (`src/main.ts:306`).

**Why this fails:** “checked” is an unexplained quality adjective. The section contains steps, not evidence that someone checked them.

**Concrete rewrite:** **“Repair a recipe in three steps.”**

### F-2-8 — Minor — “safe repairs” is an unlisted, undefined claim

**Exact copy / location:** demo button **“Apply 3 safe repairs”** (`src/main.ts:398`).

**Why this fails:** `.factory/claims.json` proves the changes can be previewed and undone, but it does not define or test “safe.” A quantity repair can affect recipe meaning, so the adjective carries information a visitor could rely on.

**Concrete rewrite:** **“Apply 3 suggested repairs.”** If “safe” is retained, define it and add a claim test that proves the exact invariant.

### F-2-9 — Minor — the malformed-JSON error says punctuation is marked when nothing is marked

**Exact copy / location:** **“The JSON could not be read. Fix the marked punctuation and try again.”** (`src/parser.ts:133`).

**Evidence:** the live input `{"name": }` produced that alert. The source textarea had no `<mark>`, error marker, or `aria-invalid` state.

**Why this fails:** the error directs the visitor to an aid that does not exist and does not identify the bad line or character.

**Concrete rewrite:** **“The JSON has invalid punctuation. Check its commas, quotes, and brackets, then inspect it again.”** A stronger fix would show the parser's line and column.

### F-2-10 — Minor — the README promises an `exportedAt` field without a manifest assertion

**Exact copy / location:** **“Exports include `schemaVersion`, `exportedAt`, the normalized `recipe`, and an `attribution` object.”** (`README.md:49`).

**Why this fails:** `@claim:neutral-export` asserts `schemaVersion`, attribution, and parsed ingredient fields, but never asserts `exportedAt` or its format. The visible promise is under-tested even though the current download happens to contain an ISO timestamp.

**Concrete fix:** include `exportedAt` in the manifest claim and assert a valid ISO timestamp in `@claim:neutral-export`, or remove it from the README promise.

### F-2-11 — Minor — one README sentence carries two jobs and a dense diagnostic list

**Exact copy / location:** **“The tool separates each field and points to malformed quantities, verbose units, missing data, invalid source addresses, and oversized fields.”** (`README.md:5`, 20 words).

**Why this fails:** it stays below the hard cap but combines parsing with six diagnostic concepts, contrary to the one-idea rule.

**Concrete rewrite:** **“The tool separates the recipe into editable fields. It flags malformed quantities, long units, missing data, invalid source URLs, and oversized fields.”**

### F-2-12 — Minor — the same source-link concept has four names

**Exact copy / locations:** **“source URL”** (`README.md:5`), **“invalid source addresses”** (`README.md:5`), **“recipe URL”** (`README.md:45`), and **“Web addresses”** (`src/main.ts:391`).

**Why this fails:** inconsistent terminology makes it less obvious that all four phrases refer to the same attribution field.

**Concrete fix:** use **“source URL”** in all four places, for example **“Source URLs are preserved and never opened.”**

## Copy audit

Counts exclude standalone punctuation and symbols; hyphenated terms, URLs, code tokens, and `$0` count as one word. No sentence exceeds 22 words and no banned marketing word appears. Findings below cover jargon, multi-idea copy, unclear headings, metaphor, and unsupported adjectives.

### Landing-page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| For self-hosted recipe keepers who need clear fixes before an import changes their collection. | 14 | F-2-6 |
| The sample opens with three repairable issues. | 7 | Pass (`demo-sample-issues`) |
| Files stay in this browser. | 5 | Pass (`local-only`) |
| Works offline after first visit. | 5 | Pass (`offline-reload`) |
| Free — no account needed. | 4 | Pass (`free-flow`) |
| An illustrated graph-paper notebook with recipe lines and red correction marks. | 11 | Pass (image alt) |
| Inspect recipe fields. | 3 | Pass |
| Review each repair. | 3 | Pass |
| Preserve source attribution. | 3 | Pass (`neutral-export`) |
| Paste JSON, JSON-LD, or Markdown. | 5 | Pass (`format-import`) |
| You see the parsed fields before you export anything. | 9 | Pass (`format-import`) |
| Maximum file size: 2 MB. | 5 | Pass (`file-limit`) |
| Web addresses are preserved and never fetched. | 7 | F-2-12 |
| Paste recipe text or choose a file. | 7 | Pass |
| Then inspect it. | 3 | Pass |
| The tool separates title, source, ingredients, and steps. | 8 | Pass (`format-import`) |
| Every suggested repair shows its exact before and after value. | 10 | Pass (`exact-change-preview`) |
| The export keeps attribution and uses a documented JSON shape. | 10 | F-2-1 |
| The tool does not fetch recipe pages. | 7 | Pass (`source-url-no-fetch`) |
| Repairs do not change cooking instructions. | 6 | Pass (`instructions-unchanged`) |
| No recipe text leaves your device. | 6 | Pass (`local-only`) |
| No account is required. | 4 | Pass (`free-flow`) |
| Fix recipe files before they reach your recipe keeper. | 9 | Pass |
| Inspect broken recipe imports, apply clear repairs, and export a neutral recipe file in your browser. | 14 | F-2-1 (meta description) |

### Landing headings, labels, and controls

| Copy | Words | Result |
| --- | ---: | --- |
| Recipe Import Repair | 3 | Pass (wordmark) |
| Demo | 1 | Pass (navigation) |
| How it works | 3 | Pass; route behavior is F-2-2 |
| Privacy | 1 | Pass |
| Repair recipe files in your browser | 6 | Pass |
| Fix broken recipe imports before saving | 6 | Pass; h1 is under nine words |
| Try it with sample data | 5 | Pass |
| Choose your file | 3 | Pass |
| Recipe file preview | 3 | Pass |
| Inspect a recipe file | 4 | Pass |
| No file read | 3 | Pass |
| Clear bench | 2 | F-2-5 |
| Input | 1 | Pass |
| Recipe source | 2 | Pass |
| Choose file | 2 | Pass |
| Paste JSON, JSON-LD, or Markdown | 5 | Pass |
| Inspect recipe | 2 | Pass |
| Inspection | 1 | Pass |
| Parsed recipe | 2 | Pass |
| Your parsed fields will appear here | 6 | Pass |
| How recipe repair works | 4 | Pass |
| Repair in three checked steps | 5 | F-2-7 |
| Read the file | 3 | Pass |
| Review each repair | 3 | Pass |
| Export a neutral file | 4 | F-2-1 |
| Privacy and limits | 3 | Pass |
| What stays in your browser | 5 | Pass |
| Original generated illustration | 3 | Pass (provenance) |

Demo controls were also checked: **Reset demo**, **Leave demo and clear sample**, **Show source**, **Hide source**, **Inspect recipe**, **Undo last change**, **Convert fraction**, **Fix decimal point**, **Use tsp**, **Add ingredient**, **Add step**, and **Export neutral JSON** name their result. **Apply 3 safe repairs** is F-2-8. Row-level **Remove** controls expose result-specific accessible names such as “Remove ingredient 1.”

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Recipe Import Repair fixes broken recipe imports before saving them to a recipe keeper. | 14 | Pass |
| It is for people who move their own recipes between self-hosted apps. | 12 | F-2-6 |
| Paste Recipe JSON, JSON-LD, or Markdown. | 6 | Pass (`format-import`) |
| The tool separates each field and points to malformed quantities, verbose units, missing data, invalid source addresses, and oversized fields. | 20 | F-2-11, F-2-12 |
| Each automatic repair shows the exact change and can be undone. | 11 | Pass (`exact-change-preview`, `reversible-repairs`) |
| A neutral JSON export preserves the source URL and author. | 10 | F-2-1; field retention itself passes `neutral-export` |
| Recipe text stays in the browser. | 6 | Pass (`local-only`) |
| The app works offline after the first visit. | 8 | Pass (`offline-reload`) |
| The full repair and export flow is free and needs no account. | 12 | Pass (`free-flow`) |
| Open `?demo=1`, `/demo`, or the deployed demo. | 7 | Pass |
| It loads “Rosemary tomato beans” with three repairable issues. | 9 | Pass (`demo-sample-issues`) |
| Demo source uses a separate `demo:` session storage key and never enters real storage. | 14 | Pass (`demo-isolation`) |
| Use **Reset demo** for a clean sample. | 7 | Pass (`demo-sample-issues`) |
| **Leave demo and clear sample** discards it and opens a blank workspace. | 12 | Pass (`demo-isolation`) |
| Requires Node.js 22 or newer. | 5 | Pass (package engine checked) |
| Open `http://127.0.0.1:5173`. | 2 | Pass |
| `npm test` runs parser tests and browser claim tests. | 9 | Pass (verified) |
| Playwright 1.58.2 is pinned. | 4 | Pass (lockfile verified) |
| The production build lands in `dist/`, with `dist/index.html` at its root. | 11 | Pass (verified) |
| Individual public claims can be checked with the commands in `.factory/claims.json`. | 11 | Pass (all commands run) |
| For example: | 2 | Pass |
| JSON objects with common recipe fields. | 6 | Pass |
| JSON-LD `Recipe` objects, including recipes inside `@graph`. | 7 | Pass |
| Markdown with a title, Ingredients section, and Steps, Instructions, Directions, or Method section. | 13 | Pass |
| The tool never fetches a recipe URL or changes cooking instructions. | 11 | F-2-12; behaviors pass `source-url-no-fetch` and `instructions-unchanged` |
| Exports include `schemaVersion`, `exportedAt`, the normalized `recipe`, and an `attribution` object. | 11 | F-2-10 |
| Ingredient lines keep both their original repaired text and parsed quantity, unit, and item fields. | 15 | Pass (`neutral-export`) |
| Run the exact build command: | 5 | Pass |
| Deploy `./dist` to Azure Static Web Apps. | 7 | Pass (build output checked) |
| `staticwebapp.config.json` provides the route fallback, security headers, and 404 rewrite. | 10 | Pass (config and live 404 checked) |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

README headings were checked separately: **Recipe Import Repair** (3), **Try the isolated demo** (4), **Run locally** (2), **Test and build** (3), **Supported input** (2), **Neutral export shape** (3; F-2-1), **Deploy** (1), and **License** (1). Each names its section; only “neutral” lacks an interoperable meaning.

## Demo and sandbox

- One click from the live landing page opened `/?demo=1` with the populated “Rosemary tomato beans” JSON-LD recipe, six ingredients, three steps, and exactly three visible repairs.
- The banner remained present and said **“Demo — sample data, nothing is saved,”** with **Reset demo** and **Leave demo and clear sample**.
- **Apply 3 safe repairs** reduced the visible issues from three to zero. **Reset demo** restored three. Leaving opened `/` with an empty source field and removed the `demo:` key.
- During the live flow, `localStorage` retained a seeded non-demo sentinel unchanged. `sessionStorage` retained a seeded non-demo sentinel unchanged and added only `demo:recipe-import-repair:source`; leaving removed only the demo key.
- The request log contained only the page, hashed JS/CSS, and same-origin illustration. No request reached `example.com` or another third-party origin.
- After service-worker control, a live offline reload retained the demo h1, sample source, and **“Offline — file repair still works”** status.

The demo itself passes. F-2-1 concerns what happens after its successful export.

## Claims

Every command was run independently from clean clone `/tmp/recipe-import-repair-review2.ZLlRh1/repo` after `npm ci`.

| Claim id | Exact command result |
| --- | --- |
| `format-import` | PASS |
| `reversible-repairs` | PASS |
| `neutral-export` | PASS |
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

The full clean-clone suite also passed: 8 unit/config tests and 22 Chromium tests. Typecheck, lint, and build passed. Production output was 29.99 kB JS raw / 10.74 kB gzip, and `dist/index.html` exists. The deployed and clean-built JavaScript hashes both equal `683b3bc45330fc44cbb59d91dd5687935833fdaa558505dd508d9bf5f0c60b76`.

Unlisted or under-tested live claims are:

- **“Ready for another recipe keeper.”** — F-2-1.
- **“safe repairs”** — F-2-8.
- README inclusion/format of **`exportedAt`** — F-2-10.

No listed claim test failed, but the review cannot pass with these unmatched promises.

## History verification

I read `.factory/review-1.md`, `.factory/polish-1.md`, and the full current `.factory/handoff.md`, then checked both live behavior and the matching deployed code.

| Earlier finding | Result in this round |
| --- | --- |
| `F-1-1` metaphor/slogan locations | The exact cited phrases are absent live and in source; the named replacements are present. Fixed. The separately overlooked **“Clear bench”** is new F-2-5. |
| `F-1-2` **“Start for real”** | Replaced by **“Leave demo and clear sample”** with adjacent consequence copy; live leave clears the sample. Fixed. |
| `F-1-3` three-issue sample claim | `demo-sample-issues` exists; its isolated test passes; live reset restores exactly three repairs. Fixed. |
| `F-1-4` parsed export fields | `neutral-export` now asserts `raw`, `quantity`, `unit`, and `item`; the clean-clone command passes. Fixed. |

No earlier finding regressed, so no F-1 id is reopened.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/?demo=1`, `/privacy`, and `/terms` return 200; an unknown path returns 404 with the designed notebook treatment.
- Every application route has one h1, a main landmark, `lang="en"`, a route-specific title, a route-specific description, and a canonical URL. F-2-4 covers incomplete social/404 head metadata.
- Home, Demo, Privacy, Terms, the in-page How it works target, and the external Param Factory link returned 200. F-2-3 is the one dead internal target.
- `robots.txt` and `sitemap.xml` return 200, and the sitemap lists Home, Demo, Privacy, and Terms. Live headers include same-origin CSP, `frame-ancestors 'none'`, HSTS, `nosniff`, referrer policy, and permissions policy.
- Demo → Privacy → Back restores the Demo URL, title, and h1 focus. F-2-2 covers the missing scroll restoration and cross-route anchor focus.
- `/opt/fleet/lib/verify-url.sh` passed on live `/` and `/demo` with no console errors, one h1, a main landmark, language, alt text, and labeled buttons.
- Live Axe reported no violations on `/`, `/demo`, `/privacy`, or `/terms` in light or dark mode. The live 404 reported the two moderate violations in F-2-3. The clean suite currently filters Axe results to serious/critical, which is why it passes.
- The site uses an original repair-notebook identity: graph paper, proof marks, tactile recipe art, distinct typography, restrained motion, and a matching 404. It is not a generic SaaS template. Asset provenance is recorded in `.factory/design.md`.
- No third-party fonts, scripts, model calls, provider keys, or analytics were found. Reduced motion, mobile overflow, 44 px targets, and 200% text behavior pass the checked tests.

## Missed leverage

An AI feature would add uncertainty to a deliberately deterministic repair tool, so no Sociobot-gateway feature is warranted. The obvious missing leverage is a usable export target: JSON-LD and repaired-original export are directly implied by the format-moving job and are specified in F-2-1. No runtime AI/provider key is embedded.

## What would make this perfect

Resolve F-2-1 through F-2-12, especially the interoperable export, history/focus behavior, and 404 skip target. Add claim coverage for every retained compatibility, safety, and export-field promise. Then rerun every manifest command from a clean clone, the full accessibility scan without discarding moderate violations, the live sandbox/storage/request probe, route metadata checks, link crawl, and the 390 px cold read. At that point there should be no remaining qualification, unsupported promise, or manual workaround.
