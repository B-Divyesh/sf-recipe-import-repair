# Recipe Import Repair repair handoff

- Work order: `recipe-import-repair-repair-1`
- Repaired candidate: `26a7b363a2817fb00ef9108345015982394adb7c`
- Repair commit: `27ced6dd93e142e7caee4f2be9196e52ced52e5a`
- Deployment: `https://recipe-import-repair.sociobot.in`
- Deployment class: static Vite + TypeScript site on Azure Static Web Apps
- Completed: 2026-08-28

## Repairs

1. **Real HTTP 404s.** Removed the broad `navigationFallback` that rewrote
   every unknown URL to `index.html`. `staticwebapp.config.json` now rewrites
   only the three known client routes (`/demo`, `/privacy`, and `/terms`) and
   retains the designed `404.html` response override. A unit regression test
   asserts that policy.
2. **Claim coverage.** Removed the untestable “open source”, nutrition,
   tracker, and hosted-storage promises rather than making unsupported claims.
   Retained the product's promised source-URL and instruction behavior with
   two new sandbox claim tests: source URLs are exported but never requested,
   and all recipe instructions are byte-for-byte unchanged by repairs. The
   privacy, demo, and free-flow wording now matches their existing observable
   tests. There are 10 claims and exactly one `@claim:` regression tag for
   each.
3. **Keyboard focus.** Applying one or all safe repairs now restores focus to
   the enabled **Undo last change** button after the workbench re-renders.
   Undo returns focus to the next available repair/export action. A keyboard
   regression test activates **Apply 3 safe repairs** with Enter and asserts
   focus is on Undo.

## Verification

Clean install and complete local checks passed:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

- Unit/config tests: 6 passed.
- Chromium browser tests: 14 passed, including all 10 public claims,
  desktop behavior, 390 × 844 layout, keyboard focus, privacy request
  monitoring, demo storage isolation, offline reload, console errors, and
  Axe serious/critical checks on `/`, `/demo`, `/privacy`, `/terms`, and the
  not-found route. The Playwright Axe integration is the automated Axe check.
- Each of the 10 exact commands in `.factory/claims.json` was run with its
  `@claim:<id>` grep and passed. A count check confirms one matching test tag
  per claim.
- Production build: `dist/index.html` exists; JS is 27.87 KB (10.17 KB gzip)
  and CSS is 16.09 KB (4.43 KB gzip).
- Azure Static Web Apps local emulation returned 200 for `/`, `/demo`,
  `/privacy`, and `/terms`; `/no-such-route` returned **404** and served the
  designed `404.html`.
- Lighthouse (mobile, local static emulator): Performance 100,
  Accessibility 100, Best Practices 100, SEO 100; FCP 1.2 s, LCP 1.2 s,
  TBT 60 ms, CLS 0. Evidence:
  `.factory/evidence/repair-1/lighthouse.json`.

## Live deployment evidence

Deployed the fresh `dist/` with `/opt/fleet/lib/deploy-static.sh` to the
existing Azure Static Web App (`sf-recipe-import-repair`), deployment ID
`05852ffc-dc12-41c8-85d8-be5c1f0e433f`.

- `verify-url.sh` passed against the custom domain: 608 ms load, no console or
  page errors, `lang=en`, one `h1`, a `main` landmark, and no images missing
  alt text. Evidence: `.factory/evidence/repair-1/live/verify.json`.
- Live route responses are 200 for `/`, `/demo`, `/privacy`, and `/terms`.
  `https://recipe-import-repair.sociobot.in/no-such-route` now returns
  **HTTP/2 404** with the designed static not-found page.
- Live headers include the configured CSP with `connect-src 'self'`,
  `X-Content-Type-Options: nosniff`, strict referrer policy, permissions
  policy, and HSTS.

## Run and deploy

```sh
npm ci
npm test
npm run build
```

Deploy `./dist` to Azure Static Web Apps. `dist/index.html` is the artifact
root and the checked-in `staticwebapp.config.json` is copied to it by Vite.

## Known limits and next steps

- Rules cover common portable fields and unit spellings, not every recipe
  keeper's private schema.
- Markdown requires recognizable Ingredients and Steps, Instructions,
  Directions, or Method headings.
- The neutral export is an interchange file, not a direct Mealie, Tandoor,
  Paprika, or FoodYou importer.
- Run the rule set against the referenced 50-file failure corpus when it is
  available, then add safely licensed fixtures for future importer failures.
