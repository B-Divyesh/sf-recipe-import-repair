# Review 3 handoff — FAIL

- Work order: `recipe-import-repair-review-3`
- Reviewed repository head: `ffa933e8975dfd6588559b37f35d60b6ae5b2433`
- Live URL: <https://recipe-import-repair.sociobot.in>
- Date: 2026-08-29 UTC

## What was done

- Performed fresh 390 × 844 and 1440 × 900 cold reads of the deployed site.
- Audited every landing-page and README sentence, heading, term, and action.
- Exercised the one-click demo, repair, reset, leave, storage isolation, same-origin request behavior, and offline flow.
- Ran every command in `.factory/claims.json` independently from a clean clone.
- Re-ran the full local and deployed browser suites, build, Axe integration, route metadata, history/focus, live link crawl, HTTP 404, security headers, and `verify-url.sh` checks.
- Read all earlier review, polish, and handoff reports and independently verified every earlier finding in live behavior and matching source.
- Recorded the result in `.factory/review-3.md`. Product code was not modified.

## Result

**FAIL:** `.factory/review-3.md` contains one blocking finding and one minor finding.

- `F-3-1` — BLOCKING: at 390 × 844, the first screen after entering the demo does not show the sample name, a populated field, a repair issue, or the apply action.
- `F-3-2` — Minor: `@claim:format-import` checks only the title and format badge, not all promised editable fields or editability.

All findings from review 1 and review 2 remain fixed.

## Verification

- Clean clone: `/tmp/recipe-import-repair-review3.aVs9Ej/repo` at `ffa933e`.
- All 14 claim commands: passed independently.
- Full clean suite: 10 unit/config tests and 28 Chromium tests passed.
- `npm run build`: passed; `dist/index.html` exists; JS is 33.96 kB raw / 11.76 kB gzip.
- Live suite: 27 tests passed in the aggregate run; its multi-route Axe test hit the 30-second aggregate timeout, then passed alone with a 60-second limit and zero violations.
- Live/local JavaScript SHA-256: `ca1f8961590497c1efb57a99403d275c52965aea7e7e5d2eeae473cd4d2f7d93`.
- Live request capture: same-origin only; seeded real storage remained unchanged; reset and leave behaved correctly.
- `verify-url.sh`: Home, Demo, Privacy, and Terms passed with no console/page errors.
- Evidence: `.factory/qa-artifacts/review-3/`.

## How to reproduce

```sh
npm ci
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://recipe-import-repair.sociobot.in npm run test:e2e
```

For F-3-1, open the live landing page in a fresh 390 × 844 context, select **Try it with sample data**, and do not scroll. The sample title is at about 2,458 px, the first repair at 1,672 px, and the apply action at 1,517 px.

For F-3-2, inspect `@claim:format-import` in `tests/e2e/claims.spec.ts`; it asserts only title values and format badges for the three fixtures.

## Next steps

Show a compact named sample and usable repair action in the first mobile demo viewport. Expand the format-import claim test to cover source URL, ingredients, steps, and one editable-field change for each format. Then repeat the full review checklist from scratch.
