# Independent verification 5 — PASS

- Work order: `recipe-import-repair-verify-5`
- Candidate commit: `05ba606bd137ffbb9d7103f937d4289efd4081a0`
- Live URL: <https://recipe-import-repair.sociobot.in>
- Verified: 2026-08-28 UTC
- Result: **PASS**

The deployed static web app is byte-for-byte the fresh production build from
the candidate. This is a fresh verification, including the two regressions
that failed verification 4; both are fixed in the live deployment.

## First-read gate — PASS

A cold, uncached desktop visit said: **“Fix broken recipe imports before
saving.”** It identified the intended user in plain words: “For self-hosted
recipe keepers who need clear fixes before an import changes their
collection.” The first action is the visible **Try it with sample data** link,
with adjacent text explaining that it opens three repairable issues. One click
opened `/demo` with populated sample data and the persistent **Demo — sample
data, nothing is saved** banner, Reset demo, and Start for real actions.

Evidence: [cold live screenshot](verification-artifacts-5/live-cold-home.png).

## Mandatory claims gate — PASS

`.factory/claims.json` exists and declares 12 claims. After `npm ci`, every
listed command was run separately from the demo entry point. Each command also
ran the 8 unit/config tests first; all passed.

| Claim ID | Exact declared test | Result |
| --- | --- | --- |
| `format-import` | `npm test -- --grep @claim:format-import` | PASS |
| `reversible-repairs` | `npm test -- --grep @claim:reversible-repairs` | PASS |
| `neutral-export` | `npm test -- --grep @claim:neutral-export` | PASS |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `file-limit` | `npm test -- --grep @claim:file-limit` | PASS |
| `free-flow` | `npm test -- --grep @claim:free-flow` | PASS |
| `source-url-no-fetch` | `npm test -- --grep @claim:source-url-no-fetch` | PASS |
| `instructions-unchanged` | `npm test -- --grep @claim:instructions-unchanged` | PASS |
| `repair-diagnostics` | `npm test -- --grep @claim:repair-diagnostics` | PASS |
| `exact-change-preview` | `npm test -- --grep @claim:exact-change-preview` | PASS |

Landing, demo, privacy, and README claims map to this manifest; no unlisted
reliance claim was found.

## Local quality gates — PASS

```text
npm ci               PASS (61 packages, 0 vulnerabilities)
npm run typecheck    PASS
npm run lint         PASS
npm test             PASS (8 unit/config + 21 Chromium browser tests)
npm run build        PASS (dist/ produced)
```

Fresh production assets are within the static-web budgets:

- JavaScript: 29,758 B raw / 10.68 KB gzip (budget: 200 KB).
- CSS: 16,820 B raw / 4.56 KB gzip (budget: 50 KB).
- LCP illustration: 60,112 B WebP (budget: 300 KB).
- No web-font payload or third-party runtime script.

## Independent live product exercise — PASS

On a fresh browser context at `/demo`:

- The sample opened with exactly three identified issues. Applying all safe
  repairs produced `1 1/2 cups`, `2.5 tbsp`, and `3 tsp`, left no issues, and
  did not alter any cooking instruction.
- The neutral JSON download was named
  `rosemary-tomato-beans-neutral.json`, used schema `1.0`, and preserved author
  `Mara Vale` and `https://example.com/mara/rosemary-tomato-beans`.
- Undo restored the original fraction and all three issues. Reset demo restored
  its original sample. Start for real discarded the sample, returned to `/`,
  cleared the source, and removed the demo storage key.
- Invalid JSON displayed the actionable error “The JSON could not be read. Fix
  the marked punctuation and try again.” Replacing it with valid Markdown
  recovered to an exportable parsed recipe.
- A combined normal case, `1½ tablespoons oil`, applied both repairs in one
  batch as `1 1/2 tbsp oil`; one undo restored `1½ tablespoons oil` and both
  diagnostics. This reproduces and passes the overlap failure from verification
  4.
- A 31-ingredient recipe requiring 31 unit repairs applied all changes, then
  restored every original line after 31 undo actions; Undo was then disabled.
  This reproduces and passes the prior hidden-history-boundary failure.
- The claim suite separately covered JSON, JSON-LD, Markdown, exact 2 MB plus
  one byte rejection, blank/missing fields, invalid source addresses, oversized
  title/ingredient/step diagnostics, and file-flow recovery.

Evidence: [live end-to-end screenshot](verification-artifacts-5/live-demo-e2e.png).

## Privacy, deployment identity, PWA, and headers — PASS

The live demo repair/export flow observed only these same-origin requests:
`/demo`, the hashed JS and CSS, and the local hero image. No request reached
the preserved `example.com` URL; no recipe text went to another origin. In demo
mode, `localStorage` was empty and the only session key was
`demo:recipe-import-repair:source`; it was removed on exit.

Fresh browser runs had no console or page errors. One isolated 502 console line
appeared during the long stress-flow browser run, but its request/response
listeners recorded no failing URL and three new cold `/demo` runs had zero
console, page, failed-request, or >=400 response events. Direct checks of the
app shell, service worker, assets, and routes returned their expected statuses.
It is not reproducible and is not treated as a product defect.

`navigator.serviceWorker.ready`, active service-worker control, and
`registration.update()` all completed. After the first visit, an offline
`/demo` reload retained the sample and showed “Offline — file repair still
works.”

Direct headers include an effective same-origin CSP with `frame-ancestors
'none'`, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer
policy, and disabled camera/microphone/geolocation. HTML and service worker
revalidate at 30 seconds; hashed JS/CSS are immutable for one year. The
designed unknown route returned HTTP 404.

Fresh-build and production SHA-256 values match exactly:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `03a5bb74f15827fefb038927fb3ae3f76d4ec81ddc8b5bf9ce3619849668cf81` |
| JavaScript | `97ca5fc88ece8df914cf8a61262154ef2e13bb2deb7f320cd19824554250e82f` |
| CSS | `ad431a900cce5e557fa26bc92233eca984de0cd889e2b6036842b19a49bb0542` |
| Hero WebP | `289ebad228fe5e4e616b39a6ff33e401948f9e9590427f18ea1a5f1038f158bf` |
| Service worker | `7ce1d0a75a71df024ef73f11618f363fb2bbbffbea3ddc37f1a83950d16837c9` |
| `404.html` | `ec9a0622b1c505151ed671000b9af977e301e4472cbdd0c51b79453c6581b99d` |

## Accessibility, keyboard, mobile, and performance — PASS

- Axe 4.10.2 reported zero serious or critical violations on `/`, `/demo`,
  `/privacy`, `/terms`, and the 404 route in both light and dark modes.
- Every checked route had one `h1`, one `main`, a route-specific title, and the
  semantic/labelled controls required by the accessibility baseline.
- Keyboard-only checks passed: skip link received focus and moved focus to the
  page heading; applying a repair moved focus to Undo last change.
- At 390 px, `scrollWidth` equaled the 390 px viewport. All inspected controls,
  including nav, demo actions, repair disclosures, removal actions, and footer
  links, measured at least 44 px in both dimensions.
- Reduced-motion maximum transition/animation duration was 0.01 ms.
- Fresh live mobile Lighthouse: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9 s, LCP 1.0 s, TBT 70 ms, CLS 0, transfer 18
  KiB. Evidence: [Lighthouse JSON](verification-artifacts-5/lighthouse-live-mobile-retry.json).

Evidence: [390 px demo screenshot](verification-artifacts-5/live-mobile-demo.png).

## Applicability and defects

This is a static local-first PWA with no backend product endpoint, login,
payment, AI runtime, public package, or CLI. Backend concurrency, server rate
allowance/429, Entra tenant, and consumer-package checks are therefore not
applicable.

| Severity | Defects |
| --- | --- |
| Blocker | None |
| High | None |
| Medium | None |
| Low | None |

