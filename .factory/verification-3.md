# Independent verification 3 — FAIL

- Work order: `recipe-import-repair-verify-3`
- Candidate commit: `05f833f6d8222585ad2d0608c4bcf9e8353af871`
- Live URL: `https://recipe-import-repair.sociobot.in`
- Verified: 2026-08-28 UTC
- Result: **FAIL**

The live deployment is current and byte-for-byte matches a fresh production
build of the candidate. This is a product-quality failure, not the previously
reported deployment-only condition.

## First-read gate — PASS

A cold desktop load says **“Fix broken recipe imports before saving”**, names
**self-hosted recipe keepers**, and presents **Try it with sample data** as the
primary action. The adjacent text says the sample opens with three repairable
issues. One click opens the populated `/demo` workbench. Its persistent banner
says “Demo — sample data, nothing is saved” and offers Reset demo and Start for
real.

## Release-blocking findings

### High — Edited blank fields bypass validation and export as valid data

The workbench does not treat a whitespace-only title or an empty ingredient
line as missing data after an edit. Reproduction on the live site:

1. Paste a valid JSON recipe with one ingredient and one step, then inspect it.
2. replace the title with three spaces and clear the only ingredient.
3. Move focus out of each field.

The title and ingredient both show **Checked**, the result says **No issues
found** and **Ready to export**, and Export neutral JSON remains enabled. The
downloaded `recipe-neutral.json` contains:

```json
{
  "title": "   ",
  "ingredients": [
    { "raw": "", "quantity": "", "unit": "", "item": "" }
  ]
}
```

This fails the brief's core requirement to export a validated neutral recipe
bundle and falsifies the public `repair-diagnostics` promise that missing data
is identified. It also leaves no way to remove an unwanted ingredient or step;
blanking an ingredient silently exports an empty record, while blanking a step
blocks export.

Evidence: [blank fields shown as checked with export enabled](verification-artifacts-3/live-blank-fields-export-enabled.png).

### Medium — The mobile Demo target is narrower than 44 px

At a 390 px viewport, the header's **Demo** link measures approximately
38 × 44 CSS px on both `/` and `/demo`. The supplied accessibility contract
requires every touch target to be at least 44 × 44 px. The repository's target
regression passes because its selector list checks the wordmark, demo strip,
summaries, and footer links but omits `.site-header nav a`.

### Medium — Home-page text overlaps at 200% text size

At 390 px with the root text size increased from 16 px to 32 px, the vertical
“FIELD NOTE 01 / CHECK BEFORE IMPORT” annotation overlaps the eyebrow and the
large headline. Measured bounds intersect: the annotation spans x=12–74 px and
the hero copy begins at x=48 px. There is no horizontal overflow, but the text
is visibly drawn over other text, failing the requirement to resize text to
200% without loss.

Evidence: [mobile home at 200% text size](verification-artifacts-3/live-mobile-text-200.png).

## Mandatory claims gate

`.factory/claims.json` exists. Each of its 12 IDs occurs in exactly one tagged
test. Every exact manifest command was run separately from the clean candidate
against the documented demo entry point and passed:

| Claim | Result |
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
| `repair-diagnostics` | PASS as written, but independently falsified by edited blanks above |
| `exact-change-preview` | PASS |

Public landing, privacy, and README promises otherwise map to the manifest.
The defect above demonstrates that the `repair-diagnostics` test is narrower
than the public “missing data” claim.

## Clean local gates

```text
npm ci             PASS (0 vulnerabilities)
npm run typecheck  PASS
npm run lint       PASS (tsc --noEmit)
npm test           PASS (7 unit/config + 18 Chromium tests)
npm run build      PASS
```

The exact production build created `dist/` at the repository root:

- JavaScript: 28,477 B raw / 10,312 B gzip (budget ≤ 200 KB)
- CSS: 16,629 B raw / 4,542 B gzip (budget ≤ 50 KB)
- Hero WebP: 60,112 B (budget ≤ 300 KB)
- No web-font payload

## Independent live functional coverage

- The JSON-LD sample opened with three issues and three exact before/after
  previews. Apply all produced `1 1/2 cups`, `2.5 tbsp`, and `3 tsp`; Undo
  restored all original values.
- Neutral export used schema `1.0`, retained author `Mara Vale` and the source
  URL, and left all cooking steps byte-for-byte unchanged.
- Plain JSON file upload and Markdown paste both populated editable fields.
- Blank input and malformed JSON produced actionable alerts; replacing the
  malformed JSON with valid Markdown recovered successfully.
- Exact 120/220/1000-character boundaries had no issue. Values of
  121/221/1001 were identified. An `ftp:` source blocked export.
- A file of exactly 2 MiB was accepted; 2 MiB + 1 byte was rejected with the
  stated size error.
- Reset demo restored the original three issues. Start for real cleared the
  source and removed the only `demo:` session key.
- No account, billing, AI, or sign-in path exists. This static product exposes
  no server endpoint or product-unlock call, so rate limiting and Entra checks
  are not applicable.

## Privacy, headers, PWA, and deployment identity

A fresh live repair/edit/export flow made 10 observed requests. Every request
was same-origin, none failed, no request reached the preserved `example.com`
source, and there were no console or page errors. `localStorage` remained
empty; demo mode used only `demo:recipe-import-repair:source` in
`sessionStorage`.

Playwright-observed HTML responses include a same-origin CSP with
`frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and a
camera/microphone/geolocation permissions policy. HTML and the service worker
use 30-second revalidation; hashed JS/CSS use one-year immutable caching. An
unknown route returns the designed page with HTTP 404.

The service worker controlled the page, `registration.update()` completed,
and an offline reload of `/demo` restored the sample and displayed “Offline —
file repair still works.” `robots.txt`, the four-route sitemap, manifest, and
all crawled internal/external links returned successfully.

Fresh-build and live SHA-256 hashes match exactly:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `b3dbae6a8b41488bffc664e18f1537977b200e17048e53c90eae6be8d5a20f26` |
| JavaScript | `ebf73f4136c0fd5c2778a56dfd344a60f33912ca0913ad936e61c19944264e67` |
| CSS | `88659bb8af44533f1e27d22d7353d094b220e812142d9fb03e163ac76f1f5f0f` |
| hero image | `289ebad228fe5e4e616b39a6ff33e401948f9e9590427f18ea1a5f1038f158bf` |
| service worker | `7ce1d0a75a71df024ef73f11618f363fb2bbbffbea3ddc37f1a83950d16837c9` |
| `404.html` | `ec9a0622b1c505151ed671000b9af977e301e4472cbdd0c51b79453c6581b99d` |

## Accessibility and performance results

- Independent Axe 4.10.2 scans found zero serious/critical violations on `/`,
  `/demo`, `/privacy`, `/terms`, and the HTTP 404 in both light and dark modes.
- Every route had `lang=en`, a route-specific title, one `h1`, one `main`, alt
  text, and no unlabeled button. Heading focus moved correctly on client
  navigation and back/forward navigation.
- Keyboard checks passed for the skip link, visible 3 px focus rings, file
  controls, repair activation, post-repair Undo focus, and post-edit focus.
- Desktop and 390 px mobile had no horizontal overflow. Reduced motion
  computed to 0.01 ms transitions/animations and automatic scrolling.
- The supplied `verify-url.sh` passed with zero console errors. Evidence:
  [verify.json](verification-artifacts-3/verify-url/verify.json).
- Fresh mobile Lighthouse: Performance 96, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.0 s, LCP 1.3 s, TBT 220 ms, CLS 0; total transfer 81 KiB.
  Evidence: [Lighthouse JSON](verification-artifacts-3/lighthouse-live-mobile.json).

## Required repair before release

1. Trim and validate title edits, reject empty ingredient records, and provide
   a deliberate remove-line path for ingredients and steps. Add live-observable
   claim coverage for edited missing data and invalid-export prevention.
2. Give every header navigation link a 44 × 44 px minimum target and include
   header links in the regression selector.
3. At 200% text size, move or hide the decorative margin note so it cannot
   overlap the hero copy; add a narrow-viewport text-resize regression.
4. Rerun every claim command, all local gates, deployment-byte comparison, and
   the independent invalid-edit, mobile-target, and text-resize checks.
