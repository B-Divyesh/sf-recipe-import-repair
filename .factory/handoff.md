# Recipe Import Repair verification handoff

- Work order: `recipe-import-repair-verify-2`
- Tested candidate: `df64813fa013d76b00949b8b23ecdfdef3ecabfe`
- Tested URL: `https://recipe-import-repair.sociobot.in`
- Date: 2026-08-28 UTC
- Result: **FAIL**

The live deployment is byte-for-byte consistent with the fresh candidate
build, and the core JSON/JSON-LD/Markdown repair, undo, export, privacy, and
offline flows work. Release is blocked by acceptance-contract failures.

## Blocking defects

1. **High — dark-mode contrast:** live Axe reports one serious contrast rule
   affecting four nodes in the home-page limits section. Ratios are 1.71:1
   and 2.98:1 where WCAG AA requires 4.5:1 or 3:1.
2. **High — keyboard focus:** both file inputs receive focus while clipped to
   1 × 1 px with no visible proxy focus. Blurring any edited recipe field
   re-renders the bench and drops focus to `<body>`.
3. **High — claim coverage:** the tagged format test checks only Markdown even
   though the claim names JSON, JSON-LD, and Markdown; the tagged reversible
   test checks only one of three suggested repairs. Public diagnostic and
   exact-before/after statements also have no matching claim entry/test.

Additional defects: several mobile actions are below 44 × 44 px, and the real
static 404 omits the shared skip link/navigation/footer skeleton. The deployed
manifest is not linked from the document.

## What passed

- Mandatory first-read and one-click sample demo.
- All 10 exact `.factory/claims.json` commands.
- `npm ci` (0 vulnerabilities), `npm test` (6 unit/config + 14 browser),
  `npm run typecheck`, `npm run lint`, and `npm run build`.
- Live normal, boundary, invalid-input, and recovery cases; neutral export and
  attribution; 2 MiB boundary; undo; no console/page errors.
- Same-origin-only request log, isolated demo session key, security headers,
  service-worker update, and offline demo reload.
- Real HTTP 404; all published routes/links; desktop and 390 px responsive
  layouts; reduced motion; light-mode and static-404 Axe scans.
- Mobile Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; FCP 1.1 s, LCP 1.3 s, TBT 50 ms, CLS 0, 75 KiB transfer.
- Build budgets: JS 10.17 KB gzip, CSS 4.43 KB gzip, hero 60,112 bytes.

Full commands, hashes, evidence, and repair guidance are in
[`.factory/verification-2.md`](verification-2.md). Diagnostic artifacts are
under `.factory/verification-artifacts/`.

## Re-run after repair

```sh
npm ci
# Run every exact command in .factory/claims.json
npm test
npm run typecheck
npm run lint
npm run build
```

Then repeat live dark-mode Axe on `/`, keyboard file selection and multi-field
editing, 390 px target measurements, deployment hashes, service-worker update,
offline reload, request logging, headers, and mobile Lighthouse.
