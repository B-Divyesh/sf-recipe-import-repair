# Independent verification — FAIL

- Work order: `recipe-import-repair-verify-1`
- Verified commit: `26a7b363a2817fb00ef9108345015982394adb7c`
- Live URL: `https://recipe-import-repair.sociobot.in`
- Verification date: 2026-08-28
- Result: **FAIL**

The deployed JavaScript, CSS, hero image, social image, and service worker are
byte-for-byte identical to a fresh production build of the verified commit.
This is a candidate quality failure, not a deployment mismatch.

## First read

Cold load of `/` plainly says it fixes broken recipe imports, names
self-hosted recipe keepers as the audience, and presents **Try it with sample
data** as the first action. That action opens `/demo` in one click. The demo
banner says "Demo — sample data, nothing is saved" and includes Reset demo and
Start for real. This mandatory first-read/demo check passed.

## Release-blocking findings

### High — Unknown URLs return HTTP 200, not a real 404

`curl -D - https://recipe-import-repair.sociobot.in/no-such-route` returned
`HTTP/2 200` with `index.html`. The client subsequently renders a friendly
not-found screen, but HTTP clients, crawlers, and caches receive a success
response. The site-structure contract requires a real 404 route/status. The
checked-in `responseOverrides` configuration did not produce that result on
the live deployment.

### High — Claim-like promises are not all registered and sandbox-tested

The claims contract says every visitor-reliant claim must have an entry in
`.factory/claims.json` and an observable demo test. The live landing page and
README contain promises with no corresponding claim entry/test, including:

- "Free and open source" (the `free-flow` test covers no payment/account, not
  open-source availability).
- "Web addresses are preserved, never fetched."
- "The tool does not fetch recipe pages. It does not rewrite your cooking
  instructions. It does not calculate nutrition."
- "There are no accounts, trackers, or remote storage."
- "Normal use does not store recipe text" on `/privacy`.

Either add one observable, demo-entry-point test for each promise or remove
the promise. This is a release blocker under the attached claims skill even
though the eight existing declared claim tests pass.

### Medium — Keyboard focus is discarded after a repair

On `/demo`, focusing **Apply 3 safe repairs** and activating it with Enter
leaves `document.activeElement` as `BODY` after the workbench re-renders. The
updated state is announced, but the keyboard user loses their place rather
than remaining on a logical next control (for example Undo last change). The
action is operable, but this fails the expected keyboard-only interaction
quality and should be corrected before release.

## Passed checks

### Clean checkout and claims

`npm ci` completed with 0 vulnerabilities. Every exact command in
`.factory/claims.json` passed from the product demo entry point:

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

There is exactly one `@claim:<id>` test tag for each declared ID. `npm test`
passed: 5 Vitest parser tests and 11 Chromium Playwright tests. No lint script
is provided; `npm run build` runs `tsc --noEmit` and Vite, and passed. The
production output is `dist/` with 27,769 B JS (10,082 B gzip) and 16,091 B CSS
(4,429 B gzip), both within the stated static-web budgets.

### Functional coverage on the live deployment

- JSON-LD demo: applied all three deterministic repairs, exported
  `rosemary-tomato-beans-neutral.json`, and verified schema `1.0`, repaired
  ingredients, source URL, and author.
- Plain JSON: parsed title and source, then enabled neutral export.
- Markdown: parsed after recovery from malformed JSON; error says what broke
  and what to do next.
- Boundary/invalid inputs: 121-character title, 221-character ingredient,
  1001-character step, invalid `ftp:` source, malformed decimal, and an
  unsplittable quantity each produced the appropriate review/error state.
- 2 MiB + 1 byte file rejection passed. Demo undo restored the original three
  sample values exactly. No sign-in, purchase, or payment path appeared.

### Privacy, PWA, accessibility, and deployment

- A fresh live demo repair/export flow issued 19 requests, all to
  `https://recipe-import-repair.sociobot.in`; no failed requests, console
  errors, or page errors were observed.
- Live responses include CSP with `connect-src 'self'`,
  `X-Content-Type-Options: nosniff`, strict referrer policy, HSTS, and a
  permissions policy. Hashed JS has `max-age=31536000, immutable`.
- The service worker controlled the live page, its registration update check
  completed, and an offline reload of `/demo` showed the sample workbench and
  offline strip.
- Live axe scans found zero serious or critical violations on `/`, `/demo`,
  `/privacy`, `/terms`, and the client-side not-found view. Desktop and 390 px
  mobile had no horizontal overflow. The skip link focused the main heading;
  controls had a visible 3 px focus outline. Reduced-motion CSS is present.
- Live asset SHA-256 values exactly match the fresh build: JS
  `e640717477e818bf2e7654d80dd9a9dbc41ab9d50af959bfe2c16f2a879abfbc`, CSS
  `86f2253ccf43255508e2c44e48ee6f4e0c66a64133842dd0fc2af891c1f87928`, hero
  `289ebad228fe5e4e616b39a6ff33e401948f9e9590427f18ea1a5f1038f158bf`, and
  service worker `7ce1d0a75a71df024ef73f11618f363fb2bbbffbea3ddc37f1a83950d16837c9`.

## Remediation and re-verification

Configure the host so an unknown URL returns the designed page with status
404; register/remove the untested promises; and retain or move keyboard focus
after dynamic repair actions. Then rerun all eight exact claim commands,
`npm test`, `npm run build`, and live HTTP/keyboard checks.
