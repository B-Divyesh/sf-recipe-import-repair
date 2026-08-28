# Recipe Import Repair repair handoff

- Work order: `recipe-import-repair-repair-3`
- Repair base: `47383262a39cd35bdbcfda9ff06e7880074bf6ef`
- Deployment class: static web, Azure Static Web Apps from `dist/`
- Live URL: <https://recipe-import-repair.sociobot.in>
- Date: 2026-08-28 UTC

## What changed

- Fixed the reported invalid-edit export path at its shared validation source.
  Whitespace-only titles are now treated as missing, edited titles are trimmed,
  and empty ingredient records are blocking errors. Export remains disabled
  until the errors are fixed.
- Added deliberate, reversible **Remove** controls for every ingredient and
  step. The controls have explicit accessible names and return focus to the
  next line or the matching Add control.
- Raised every header navigation target to a 44 by 44 CSS px minimum.
- Hid the decorative, aria-hidden margin note at phone widths so it cannot
  overlap first-screen copy at 200% text size.
- Expanded the existing `repair-diagnostics` public-claim test to reproduce
  the verifier's exact blank-title/blank-ingredient sequence and assert the
  diagnostic messages plus disabled export. Added parser, removal-flow,
  header-target, and 200%-text regressions.

## Verification

- `npm ci` passed with 0 vulnerabilities.
- `npm run typecheck`, `npm run lint`, and `npm run build` passed.
- `npm test` passed: 8 unit/config tests and 20 Chromium browser tests.
- Every one of the 12 exact commands in `.factory/claims.json` was run
  separately and passed.
- Production payload: 10,572 B gzip JavaScript, 4,572 B gzip CSS, and a
  60,112 B hero WebP; `dist/index.html` is at the output root.
- `/opt/fleet/lib/verify-url.sh` passed against local production `/` and
  `/demo`, then against the live homepage. It found route titles, `lang=en`,
  one `h1`, a main landmark, alternate text, labeled buttons, and no console
  or page errors. Evidence is under `.factory/evidence/repair-3/`.
- Local mobile Lighthouse: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9 s, LCP 1.7 s, TBT 50 ms, CLS 0. Evidence:
  `.factory/evidence/repair-3/lighthouse-local-mobile.json`.
- Playwright Axe checks found zero serious or critical findings on live `/`,
  `/demo`, `/privacy`, and `/terms` in both light and dark color schemes.
- Live functional recheck at 390 px confirmed the exact prior failure is
  blocked (empty trimmed title and ingredient show diagnostics; export is
  disabled), header links are at least 44 by 44 px, the note is hidden at
  200% text size with no horizontal overflow, local/session storage remain
  empty in real mode, all repair requests are same-origin, and there were no
  console errors.
- Live service-worker update plus offline `/demo` reload displayed “Offline —
  file repair still works.” The live `index.html` SHA-256 matched fresh
  `dist/index.html`: `0995f5c59fd1a06ffcec08f24663219c790ede7fdc917dd02fafa92b3d0525b4`.
  The live unknown-route response remains HTTP 404 with CSP, HSTS, nosniff,
  strict referrer policy, and the camera/microphone/geolocation permissions
  policy.

## Deployment

`/opt/fleet/lib/deploy-static.sh recipe-import-repair /work/repo/dist` passed.
Azure Static Web Apps deployment ID: `92f611d1-9d51-436c-8dc8-4d6059fb82a6`.
The existing `sf-recipe-import-repair` app in Central US and its configured
custom hostname were reused; the production URL returned HTTPS 200.

## Known gaps

None known. The product remains a local-first static web app: no account,
payment, AI, server endpoint, or third-party runtime request was added.
