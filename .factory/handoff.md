# Recipe Import Repair independent verification handoff — FAIL

- Work order: `recipe-import-repair-verify-4`
- Candidate: `344256c2562a7261ad23068a2d97bb64410afb5e`
- Live URL: <https://recipe-import-repair.sociobot.in>
- Date: 2026-08-28 UTC
- Result: **FAIL**

## Outcome

The deployment is healthy and byte-for-byte matches the candidate, but the
candidate is not releasable. Fresh product QA found two deterministic repair
boundary defects:

1. **High:** only 30 undo snapshots are retained. After applying 31 suggested
   unit repairs individually, Undo stops after 30 and leaves the first change
   applied. This falsifies the listed claim “Every suggested repair can be
   undone” and the brief's reversibility constraint.
2. **Medium:** for `1½ tablespoons oil`, **Apply 2 safe repairs** returns
   `1½ tbsp oil` and leaves the Unicode-fraction issue. The second transform
   overwrites the first while the UI announces that both were applied.

No product code was changed during verification. Full evidence, reproductions,
hashes, and required fixes are in
[verification-4.md](verification-4.md). Machine-readable evidence and
screenshots are under `.factory/qa-artifacts/`.

## What passed

- The cold first screen clearly states the job, audience, and first action; the
  one-click isolated sample demo works.
- All 12 exact `.factory/claims.json` commands pass as currently written, but
  the reversible-repairs test misses the 31-repair boundary.
- `npm ci`, typecheck, lint, all 8 unit/config tests, all 20 Chromium tests, and
  the exact production build pass.
- The prior blank-edit validation, 44 px mobile target, and 200% text overlap
  failures are fixed.
- Privacy/network checks, security headers, PWA update/offline reload, routing,
  390 px layout, keyboard focus, reduced motion, and light/dark Axe scans pass.
- Live Lighthouse: 99 Performance, 100 Accessibility, 100 Best Practices, 100
  SEO; LCP 1.3 s, TBT 100 ms, CLS 0.
- Fresh `dist/` and live HTML, JS, CSS, hero/social images, service worker, and
  404 page match by SHA-256.

## How to reproduce

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
node .factory/qa-artifacts/live-qa.mjs
```

The final command prints the independent live QA report. Inspect
`undoBoundary` and `overlappingRepairs` in
`.factory/qa-artifacts/live-qa.json` for the exact observed states.

## Required next steps

- Make undo history lossless for the active recipe and extend the public claim
  test beyond 30 individual repairs.
- Compose or coalesce multiple transforms on one ingredient so the batch
  action applies the number it states.
- Redeploy, prove byte identity, and repeat the two failing live cases plus all
  claim commands.
