# Independent verification 2 — FAIL

- Work order: `recipe-import-repair-verify-2`
- Candidate: `df64813fa013d76b00949b8b23ecdfdef3ecabfe`
- Live URL: `https://recipe-import-repair.sociobot.in`
- Verified: 2026-08-28 UTC
- Result: **FAIL**

The deployed product matches the candidate and completes the core repair job,
but it does not meet the mandatory accessibility and claims-test contracts.

## First-read gate — PASS

A cold load says **“Fix broken recipe imports before saving”**, identifies
**self-hosted recipe keepers**, and presents **Try it with sample data** as the
primary action. The adjacent sentence says the sample opens with three
repairable issues. The one-click action opens a populated workbench, and the
persistent banner says “Demo — sample data, nothing is saved” with Reset demo
and Start for real controls.

Evidence:

- [Desktop first screen](verification-artifacts/live-first-read-desktop.png)
- [390 px first screen](verification-artifacts/live-first-read-mobile.png)

## Release-blocking findings

### High — Dark mode has a serious WCAG contrast violation

An independent live Axe 4.10.2 scan of `/` in dark mode reports the serious
`color-contrast` rule on four nodes in `.boundaries`:

- “Bench limits”: `#f0b7ab` on `#5f9fac`, **1.71:1**; required 4.5:1.
- “Your recipe stays yours”: white on `#5f9fac`, **2.98:1**; required 3:1.
- Both 16 px boundary paragraphs: white on `#5f9fac`, **2.98:1**; required
  4.5:1.

The repository test misses this because it scans dark mode only on `/demo`,
where the failing home section is absent. Light desktop/mobile, dark demo,
privacy, terms, and the static 404 had no serious/critical Axe findings.

Evidence: [dark-mode boundary section](verification-artifacts/live-dark-boundaries.png).

### High — Core keyboard flows lose or hide focus

Two reproducible failures violate the visible-focus and keyboard-only
requirements:

1. On `/`, Tab reaches `#hero-file` after the sample-data link. The active
   input is clipped to **1 × 1 px** (`clip: rect(0, 0, 0, 0)`), while its
   visible “Choose your file” label receives no focus indicator. The real-file
   import action therefore has no visible keyboard focus.
2. In a parsed recipe, changing Source URL and pressing Tab triggers the
   workbench re-render. `document.activeElement` becomes `<body>` instead of
   the next control. The same render path is used for every editable field,
   so keyboard users must restart traversal after each edit.

The repaired Apply action itself now behaves correctly: activating “Apply 3
safe repairs” with Enter moves focus to “Undo last change.” The defects above
remain outside that regression test.

Evidence: [file chooser focused but invisible](verification-artifacts/live-hidden-file-focus.png).

### High — Public claims are not fully represented and proven by claim tests

All commands in `.factory/claims.json` pass, and each ID occurs exactly once as
a test tag. However, the observable assertions do not cover all their wording:

- `format-import` promises Recipe JSON, JSON-LD, and Markdown, but its tagged
  test exercises only Markdown.
- `reversible-repairs` promises every suggested repair can be undone, but its
  tagged test exercises only the Unicode-fraction repair.

There are also claim-like statements without their own manifest entry/test:

- README: the bench points to malformed quantities, verbose units, missing
  data, invalid source addresses, and oversized fields.
- Landing page/README: every suggested repair shows its exact before and after
  value.

Independent probes found those behaviors working, but the claims contract
requires the sandbox test itself to prove the full public statement. This is a
release blocker until the tagged tests are expanded and the unlisted claims
are registered, or the wording is narrowed.

## Other findings

### Medium — Several mobile targets are smaller than 44 × 44 px

At 390 px, measured live hit areas include Start for real at 135 × 25 px,
three “See exact change” summaries at 248 × 25 px, footer links at 25 px high,
the wordmark at 200 × 32 px, and Demo at 39 × 44 px. These do not meet the
supplied 44 × 44 px target rule.

### Medium — The real 404 omits the standard site skeleton

`/definitely-missing` correctly returns HTTP 404 and has a title, `lang`, one
`h1`, a `main`, and no serious/critical Axe issue. It has no skip link, main
navigation, Privacy/Terms footer links, factory attribution, or build note,
despite the site-structure contract requiring the shared header/footer on
every route.

### Informational — The web app manifest is not linked

`manifest.webmanifest` is valid and deployed, but `index.html` has no
`<link rel="manifest">`, so browsers do not discover it for installation.
This does not break the tested offline claim.

## Claim gate results

Each exact command was run separately after `npm ci` from the clean candidate.

| Claim | Command result |
| --- | --- |
| `format-import` | PASS |
| `reversible-repairs` | PASS |
| `neutral-export` | PASS |
| `local-only` | PASS |
| `demo-isolation` | PASS |
| `offline-reload` | PASS |
| `file-limit` | PASS |
| `free-flow` | PASS |
| `source-url-no-fetch` | PASS |
| `instructions-unchanged` | PASS |

The semantic coverage defects above still fail the claims acceptance contract.

## Clean local gates

```text
npm ci             PASS (0 vulnerabilities)
npm test           PASS (6 unit/config, 14 Chromium)
npm run typecheck  PASS
npm run lint       PASS (script aliases tsc --noEmit)
npm run build      PASS
```

The production build created `dist/`:

- JavaScript: 27.87 KB raw / 10.17 KB gzip (budget ≤ 200 KB)
- CSS: 16.09 KB raw / 4.43 KB gzip (budget ≤ 50 KB)
- Hero WebP: 60,112 bytes (budget ≤ 300 KB)
- No web-font payload

## Independent live functional coverage

- JSON-LD demo opened with three issues. Apply all produced `1 1/2 cups`,
  `2.5 tbsp`, and `3 tsp`; Undo restored all three original strings.
- Export produced `rosemary-tomato-beans-neutral.json`, schema `1.0`, author
  `Mara Vale`, the source URL, repaired ingredients, and unchanged instructions.
- Plain JSON and Markdown both parsed into editable fields and enabled export.
- Blank and malformed JSON showed actionable errors; replacing either with
  valid Markdown recovered to “Lemon rice.”
- The exact 120/220/1000 character boundaries were accepted. Values of
  121/221/1001 were flagged. Invalid `ftp:` source and an unsplittable quantity
  blocked export; correcting both enabled it.
- A 2 MiB file reached parsing; 2 MiB + 1 byte was rejected with the documented
  size error.
- Desktop and 390 px layouts had no horizontal overflow. At simulated 200%
  root text size, the 390 px demo still had no horizontal overflow.
- Reduced motion computed to 0.01 ms transitions/animations and auto scrolling.
- No console or page errors occurred in the tested home, demo, input-recovery,
  privacy, terms, or not-found flows.

## Privacy, offline, and headers

The live demo apply/undo/export/update/offline sequence made nine observed
requests, all to `https://recipe-import-repair.sociobot.in`; none failed and no
request reached the preserved `example.com` source URL. `localStorage` stayed
empty. The only session key was
`demo:recipe-import-repair:source`.

The service worker controlled the page, `registration.update()` completed,
and an offline `/demo` reload restored the sample and displayed “Offline —
file repair still works.”

Live HTML responses include CSP with `connect-src 'self'`, HSTS,
`X-Content-Type-Options: nosniff`, strict referrer policy, and a camera/
microphone/geolocation permissions policy. HTML and the service worker use
30-second revalidation. Hashed JS/CSS use one-year immutable caching.

This is a static product with no server API, unlock endpoint, payment path, or
sign-in. Rate-limit and Entra authority checks are therefore not applicable.

## Performance and deployment identity

Independent mobile Lighthouse evidence is at
[lighthouse-live-mobile.json](verification-artifacts/lighthouse-live-mobile.json):

- Performance 100, Accessibility 100, Best Practices 100, SEO 100
- FCP 1.1 s, LCP 1.3 s, TBT 50 ms, CLS 0
- Initial transfer 75 KiB

The supplied `verify-url.sh` passed in 574 ms with zero console/page errors,
one `h1`, `lang=en`, a main landmark, no missing alt text, and no unlabeled
buttons. Evidence: [verify.json](verification-artifacts/verify-url/verify.json).

Fresh-build and live SHA-256 hashes match exactly:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `625db852822162532819734f1b956cfd2df12083eedd50ca0ef559a1098113b8` |
| JavaScript | `764264df0b281306b96ae3860857a79443054f840e4f512b528d1b6ab24c5ee0` |
| CSS | `86f2253ccf43255508e2c44e48ee6f4e0c66a64133842dd0fc2af891c1f87928` |
| Hero image | `289ebad228fe5e4e616b39a6ff33e401948f9e9590427f18ea1a5f1038f158bf` |
| Social image | `6f36c8a9d295bd8c94c75e5c7b9782101336d71675004c68fedc29fb9321e9bd` |
| Service worker | `7ce1d0a75a71df024ef73f11618f363fb2bbbffbea3ddc37f1a83950d16837c9` |
| `404.html` | `a4aa6cc70491055a9c0064c7c3a2bfbd3e792248036ac0ff83a8a7f98f756eb0` |

All site links tested successfully. `/`, `/demo`, `/privacy`, `/terms`, and
the external Param Factory link return 200; an unknown route returns 404.

## Required repair before another verification

1. Correct dark `.boundaries` colors and add a dark-home Axe regression.
2. Expose visible focus on both file pickers and retain logical focus after
   field-change re-renders.
3. Expand claim tests to prove every format/repair named, and register or
   narrow the remaining public diagnostic/exact-change claims.
4. Bring actionable mobile targets to at least 44 × 44 px.
5. Give the static 404 the shared skip link, navigation, and footer skeleton.
