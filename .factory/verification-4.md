# Independent verification 4 — FAIL

- Work order: `recipe-import-repair-verify-4`
- Candidate commit: `344256c2562a7261ad23068a2d97bb64410afb5e`
- Live URL: <https://recipe-import-repair.sociobot.in>
- Verified: 2026-08-28 UTC
- Result: **FAIL**

The live deployment is current and byte-for-byte matches a fresh production
build of the candidate. This is not a deployment-only failure. The previous
blank-edit, mobile target-size, and 200% text-size defects are fixed, but fresh
boundary testing found a core reversibility claim failure and an incorrect
batch-repair result.

## First-read gate — PASS

A cold desktop load says **“Fix broken recipe imports before saving”**, names
**self-hosted recipe keepers**, and presents **Try it with sample data** as the
primary action. The adjacent sentence says the sample opens with three
repairable issues. One click opens the populated `/demo` workbench. Its
persistent banner says “Demo — sample data, nothing is saved” and offers Reset
demo and Start for real.

Evidence: [cold desktop screenshot](qa-artifacts/live-first-read-desktop.png).

## Release-blocking findings

### High — The “every repair can be undone” claim fails after 31 repairs

The product silently keeps only 30 undo snapshots. A valid, realistic large
recipe with 31 separately repairable ingredient units leaves its first repair
permanent within the session.

Live reproduction:

1. Paste a recipe containing one step and 31 ingredient lines named
   `1 tablespoons item 1` through `1 tablespoons item 31`.
2. Inspect it, then activate each of the 31 **Use tbsp** repair buttons.
3. Activate **Undo last change** until it becomes disabled.

Only 30 undo operations are available. Ingredient 1 remains `1 tbsp item 1`,
the other 30 verbose-unit issues return, and Undo is disabled. This directly
falsifies the listed claim **“Every suggested repair can be undone”** and the
brief constraint that every transformation be reversible. The manifest test
passes because it covers only the three-item demo and never crosses the hidden
history limit.

Evidence: [machine-readable live QA](qa-artifacts/live-qa.json) under
`undoBoundary` (`appliedCount: 31`, `availableUndoCount: 30`,
`remainingRepairedLines: 1`) and [disabled Undo after 30 reversals](qa-artifacts/live-undo-boundary.png).

### Medium — “Apply 2 safe repairs” applies only one complete transform

An ingredient can need more than one repair. With `1½ tablespoons oil`, the
workbench correctly offers both **Convert fraction** and **Use tbsp**, and the
batch button says **Apply 2 safe repairs**. Activating it produces
`1½ tbsp oil`: the unit is fixed, but the Unicode fraction remains and the
workbench still reports one issue. The action also announces that two repairs
were applied.

The two transforms were calculated from the same original line and the second
overwrites the first. The user can recover with another click, but the primary
batch action does not do what its count and confirmation say. This is a normal
combination of two supported diagnostics, not malformed input.

Evidence: [machine-readable live QA](qa-artifacts/live-qa.json) under
`overlappingRepairs` and [remaining issue after the batch action](qa-artifacts/live-overlapping-repair-after-apply.png).

## Mandatory claims gate

`.factory/claims.json` exists. Each of its 12 IDs appears in exactly one tagged
test. After `npm ci`, every exact manifest command was run separately against
the demo entry point and its assertion passed:

| Claim | Declared test result | Independent result |
| --- | --- | --- |
| `format-import` | PASS | PASS |
| `reversible-repairs` | PASS | **FAIL at 31 repairs** |
| `neutral-export` | PASS | PASS |
| `local-only` | PASS | PASS |
| `demo-isolation` | PASS | PASS |
| `offline-reload` | PASS | PASS |
| `file-limit` | PASS | PASS |
| `free-flow` | PASS | PASS |
| `source-url-no-fetch` | PASS | PASS |
| `instructions-unchanged` | PASS | PASS |
| `repair-diagnostics` | PASS | PASS |
| `exact-change-preview` | PASS | PASS |

The landing page, privacy page, demo documentation, and README claim-like copy
otherwise map to the manifest. The batch button's “Apply N safe repairs”
outcome has no dedicated boundary coverage.

## Clean local gates

```text
npm ci             PASS (0 vulnerabilities)
npm run typecheck  PASS
npm run lint       PASS (tsc --noEmit)
npm test           PASS (8 unit/config + 20 Chromium tests)
npm run build      PASS
```

The exact production build created `dist/` at the repository root:

- JavaScript: 29,726 B raw / 10.67 KB gzip (budget ≤ 200 KB)
- CSS: 16,820 B raw / 4.56 KB gzip (budget ≤ 50 KB)
- Hero WebP: 60,112 B (budget ≤ 300 KB)
- No web-font payload

## Independent end-to-end coverage

- The demo opened with three issues and three exact before/after previews.
  Applying all produced `1 1/2 cups`, `2.5 tbsp`, and `3 tsp`; Undo restored
  the three original issues.
- Export downloaded valid schema `1.0` JSON named
  `rosemary-tomato-beans-neutral.json`, retained author `Mara Vale` and the
  source URL, and left all instructions byte-for-byte unchanged.
- Reset demo restored the bundled source. Start for real cleared the source and
  removed the sole `demo:recipe-import-repair:source` session key.
- Empty input and malformed JSON produced actionable alerts. Replacing them
  with valid Markdown recovered to an exportable recipe.
- Exact 120/220/1000-character boundaries produced no issue; 121/221/1001
  produced the three documented diagnostics. An `ftp:` source blocked export.
- The previous blank-edit defect is fixed: a whitespace-only title is trimmed,
  an empty ingredient is identified, and export stays disabled.
- A valid file of exactly 2,097,152 bytes parsed successfully. A 2,097,153-byte
  file was rejected with the documented size error.
- Plain JSON, JSON-LD, and Markdown were exercised by both declared tests and
  independent recovery flows.

## Privacy, headers, routing, PWA, and deployment identity

A fresh live demo repair/export flow made four observed requests. Every request
was same-origin, none reached the preserved `example.com` source, and there
were no console or page errors. `localStorage` remained empty; demo mode used
only its documented `demo:` session key and removed it on exit.

Browser and direct-header checks found a same-origin CSP with
`frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and a
camera/microphone/geolocation permissions policy. HTML and the service worker
revalidate after 30 seconds; hashed JavaScript and CSS use one-year immutable
caching. The designed unknown route returns HTTP 404. All product links and the
Param Factory link returned their expected successful status.

The service worker controlled the page, `registration.update()` completed, and
an offline `/demo` reload retained the sample and displayed “Offline — file
repair still works.” Navigation, back, and forward set the route title and move
focus to the new `h1`.

Fresh-build and live SHA-256 hashes match exactly:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `0995f5c59fd1a06ffcec08f24663219c790ede7fdc917dd02fafa92b3d0525b4` |
| JavaScript | `163a5cf3cf729efa762cef53931c79df04671c9bf39a4bcec8188a5889c1f006` |
| CSS | `ad431a900cce5e557fa26bc92233eca984de0cd889e2b6036842b19a49bb0542` |
| hero image | `289ebad228fe5e4e616b39a6ff33e401948f9e9590427f18ea1a5f1038f158bf` |
| social image | `6f36c8a9d295bd8c94c75e5c7b9782101336d71675004c68fedc29fb9321e9bd` |
| service worker | `7ce1d0a75a71df024ef73f11618f363fb2bbbffbea3ddc37f1a83950d16837c9` |
| `404.html` | `ec9a0622b1c505151ed671000b9af977e301e4472cbdd0c51b79453c6581b99d` |

## Accessibility and performance

- Independent Axe 4.10.2 scans found zero serious/critical violations on `/`,
  `/demo`, `/privacy`, `/terms`, and the HTTP 404 in light and dark modes.
- Every route had `lang=en`, a route-specific title, one `h1`, one `main`, alt
  text, and labeled buttons. The supplied `verify-url.sh` reported no console
  or page errors.
- Keyboard checks passed for the skip link, route focus, repair activation,
  Undo focus, file controls, and edit focus. The focused skip link has a 3 px
  rust-red outline.
- At 390 px, all visible interactive controls measured at least 44 × 44 CSS px
  and there was no horizontal overflow. At 200% text size, the prior margin
  annotation is hidden and the page remains 390 px wide.
- Under `prefers-reduced-motion: reduce`, no element retained a transition or
  animation longer than 0.01 ms.
- Fresh live mobile Lighthouse: Performance 99, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9 s, LCP 1.3 s, TBT 100 ms, CLS 0; total
  transfer 82,745 B.

Evidence: [verify-url result](qa-artifacts/verify-live/verify.json),
[live QA result](qa-artifacts/live-qa.json), and
[Lighthouse JSON](qa-artifacts/lighthouse-live-mobile.json).

## Applicability checks

This is a static local-first PWA. It has no backend, server-side product-unlock
endpoint, account, payment, AI feature, sign-in, public package, or CLI.
Backend concurrency/persistence/rate-limit checks, Entra authority checks, and
consumer package installation are therefore not applicable. No missed AI
leverage is evident: deterministic local transforms are the researched job.

## Required repair before release

1. Remove the 30-snapshot loss or expose a durable per-transform undo model so
   every applied repair remains reversible for the entire current recipe.
   Extend `@claim:reversible-repairs` past the history boundary.
2. Compose repairs that target the same ingredient from the latest value, or
   coalesce them into one deterministic transform. Assert that **Apply N safe
   repairs** clears all N represented issues for a fraction plus verbose unit.
3. Rerun every exact claim command, all local gates, deployment byte
   comparison, and both independent reproductions above.
