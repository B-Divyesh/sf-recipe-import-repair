# Recipe Import Repair v1 handoff

## Independent verifier result: **FAIL**

Verified commit: `26a7b363a2817fb00ef9108345015982394adb7c`

Verified URL: `https://recipe-import-repair.sociobot.in`
Verification date: 2026-08-28

The live deployment exactly matches this commit, but it does not meet the
factory acceptance contract. See `.factory/verification.md` for complete
reproduction evidence.

Release blockers:

- Unknown live routes return HTTP 200 with the SPA shell rather than a real
  HTTP 404.
- Multiple visitor-facing promises on the landing page/README are absent from
  `.factory/claims.json` and lack required sandbox tests.

Also fix the medium-severity keyboard focus loss after applying a repair.
Do not mark this candidate accepted until these issues are corrected and
independently re-verified.

- Work order: `recipe-import-repair-build-1`
- Completed: 2026-08-28
- Artifact: static Vite + TypeScript site in `dist/`

## What shipped

- Local parsing for plain Recipe JSON, schema.org JSON-LD, and structured Markdown.
- Field-by-field preview for title, description, yield, times, author, source URL, ingredients, and steps.
- Deterministic checks for missing data, invalid source URLs, malformed decimals, Unicode fractions, verbose units, and oversized fields.
- Exact Before and After previews for automatic repairs.
- One-step and grouped undo through in-memory snapshots.
- Editable parsed fields plus ingredient and step insertion.
- Neutral JSON export with schema version, repaired fields, source URL, and author attribution.
- One-click `/demo` with three repairable sample lines, a persistent banner, reset, and clean exit.
- Separate `demo:recipe-import-repair:source` session namespace. Normal recipe text is not stored.
- Offline app shell, offline status, privacy and terms routes, SPA navigation, static 404, sitemap, robots, manifest, and security headers.
- Handwritten lab-notebook visual system with light and dark treatments.
- Original generated hero illustration and social crop. Full prompt and provenance are in `.factory/design.md` and `assets/src/`.

## Run and verify

```sh
npm install
npm test
npm run build
```

The exact deploy command is `npm run build`. Deploy `./dist`; `dist/index.html` is present at its root.

Verification completed from a clean browser state:

- Vitest: 5 parser tests passed.
- Playwright: 11 browser tests passed in Chromium.
- Public claim tests: 8 of 8 passed. Commands are listed in `.factory/claims.json`.
- Axe browser scan: no serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, or an unknown route.
- `verify-url.sh`: passed with one `h1`, `lang=en`, a main landmark, complete image alt text, and no console errors.
- Mobile layout: passed at 390 × 844 with no horizontal overflow.
- Production output: 10.18 KB gzip JavaScript and 4.43 KB gzip CSS.
- Hero WebP: 60 KB. Social preview WebP: 80 KB.

## Lighthouse-class measurement

Measured locally with Lighthouse 13.0.1, mobile defaults, headless Chromium, and the production preview:

| Category or metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| First contentful paint | 0.9 s |
| Largest contentful paint | 1.5 s |
| Total blocking time | 60 ms |
| Cumulative layout shift | 0 |

Evidence is in `.factory/evidence/`: `lighthouse.json`, `verify.json`, and desktop/mobile screenshots.

## Known limits

- Rules cover common portable fields and unit spellings. They do not reproduce every target app's private schema.
- Markdown needs recognizable Ingredients and Steps, Instructions, Directions, or Method headings.
- The 50-file success corpus from the research brief was not available in this repository, so the 70% target was not measured.
- The neutral export is designed for later adapters. It is not a direct Mealie, Tandoor, Paprika, or FoodYou import file.
- URL fetching, web scraping, generative rewriting, nutrition calculation, and hosted storage remain out of scope by design.

## Next steps

- Run the rule set against the referenced 50-file failure corpus when it becomes available.
- Add target-specific exporters only after validating their current public schemas.
- Add format fixtures from community bug reports as contributors submit safely licensed samples.
