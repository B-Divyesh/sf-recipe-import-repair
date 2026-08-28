# Recipe Import Repair verification handoff

- Work order: `recipe-import-repair-verify-3`
- Candidate: `05f833f6d8222585ad2d0608c4bcf9e8353af871`
- Live URL: `https://recipe-import-repair.sociobot.in`
- Date: 2026-08-28 UTC
- Result: **FAIL**

## What was verified

- Ran all 12 exact commands in `.factory/claims.json` first; every command
  passed and every claim ID has exactly one tagged test.
- Ran `npm ci`, typecheck, lint, the full test suite, and the exact production
  build. All passed; 7 unit/config and 18 browser tests completed.
- Exercised live JSON, JSON-LD, Markdown, upload, repair, undo, export, malformed
  input recovery, exact/over boundaries, demo reset/exit, and 2 MiB file limits.
- Audited live request logs, browser response headers, real 404 behavior,
  service-worker update/offline reload, link health, desktop/390 px layouts,
  keyboard focus, reduced motion, light/dark Axe, and mobile Lighthouse.
- Compared fresh `dist/` bytes to the deployment. HTML, JS, CSS, hero image,
  service worker, and 404 are exact matches, so deployment is not the blocker.

## Release blockers

1. **High:** Clearing an edited title to spaces and the only ingredient to an
   empty value leaves both fields “Checked,” reports no issues, and permits an
   export containing the blank values. This violates validated export and the
   missing-data diagnostic promise.
2. **Medium:** At 390 px, the header Demo link is about 38 × 44 px, below the
   required 44 × 44 px target. Existing regression coverage omits header links.
3. **Medium:** At 200% text size on a 390 px viewport, the vertical margin note
   visibly overlaps the hero eyebrow and headline.

Full evidence and exact results are in
[verification-3.md](verification-3.md). Key artifacts are under
`.factory/verification-artifacts-3/`, including the invalid export state,
200% text overlap, live verifier output, screenshots, and Lighthouse JSON.

## Passing evidence

- Live request log: 10/10 requests same-origin; no failed request, console
  error, page error, tracker, source-URL fetch, auth, payment, or server API.
- Live headers include CSP, HSTS, `nosniff`, strict referrer policy, and the
  permissions policy. Unknown paths return HTTP 404; hashed assets are
  immutable for one year.
- Service-worker update and offline demo reload passed.
- Axe: zero serious/critical issues on all primary routes and 404 in light and
  dark modes. Keyboard and normal responsive-layout checks passed.
- Lighthouse: 96 Performance, 100 Accessibility, 100 Best Practices, 100 SEO;
  LCP 1.3 s, CLS 0, total transfer 81 KiB.
- Build payload: 10,312 B gzip JS, 4,542 B gzip CSS, 60,112 B hero image.

## Next step

Repair the three blockers without weakening the claims, add regression tests
for edited blank fields, all header targets, and 200% text resize, deploy, then
repeat verification. No product code was changed during this verification.
