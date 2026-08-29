# Polish 3 handoff — PASS

- Work order: `recipe-import-repair-polish-3-retry1`
- Product repair commit: `6ffbea418e6184e5301bcc2779ee5919d9b71b3c`
- Deployment ID: `e6b6a08c-a55a-4785-806d-eb4a769b9bd4`
- Live URL: <https://recipe-import-repair.sociobot.in>
- Demo URL: <https://recipe-import-repair.sociobot.in/?demo=1>
- Date: 2026-08-29 UTC

## Result

**PASS.** All findings from reviews 1–3 are closed. The mobile demo now proves the product immediately: its initial 390 × 844 screen contains the named Rosemary tomato beans sample, a populated editable title field, a concrete issue, and an enabled apply action, while retaining the isolated-demo banner, reset, and exit controls.

`@claim:format-import` now proves the full public claim for JSON, JSON-LD, and Markdown: title, source URL, ingredient, step, and a persisted editable-field change for every format.

## What changed

- Changed the demo first-screen wording to **Repair Rosemary tomato beans**.
- Moved the parsed result before the source editor only in the compact mobile demo layout. It exposes a real sample-title editor, issue preview, count, and repair action without replacing the notebook visual system.
- Preserved desktop source/result flow, editable recipe fields, source editor, demo isolation, and all earlier repaired behaviors.
- Expanded the import claim test and its manifest sandbox description.
- Updated the verb-first catalog description and copy audit.
- Recorded the complete finding-by-finding map in `.factory/polish-3.md`.

## Verification evidence

- Fresh clone: `/tmp/recipe-import-repair-polish3.3lKSMR/repo` at `6ffbea4`.
- `npm ci`: passed, zero vulnerabilities.
- All 14 `.factory/claims.json` commands: passed independently from that fresh clone.
- Clean full gate: `npm test` passed 10 unit/config and 28 Chromium browser tests; `npm run lint` and `npm run build` passed; `dist/index.html` exists.
- Live gate: `PLAYWRIGHT_BASE_URL=https://recipe-import-repair.sociobot.in npm run test:e2e` passed 28/28, including the Playwright Axe scans, same-origin privacy capture, service-worker offline reload, real HTTP 404/skip link, route focus/history, and mobile checks.
- URL verifier: Home, Demo, Privacy, and Terms passed with one h1, `lang=en`, a main landmark, image alt text, labeled buttons, and zero console/page errors. Evidence: `.factory/qa-artifacts/polish-3/live/verify-*/verify.json`.
- Cold mobile evidence: `.factory/qa-artifacts/polish-3/live/demo-390-cold.png`.
- Local mobile evidence: `.factory/qa-artifacts/polish-3/local/demo-390.png`.
- HTTP check: `/`, `/demo`, `/privacy`, and `/terms` returned 200; `/polish-3-not-found` returned 404.
- Local/live deployed JavaScript SHA-256 match: `ab314aaf8b8405614ac1a64f2735386a19fcc9590641e1fbfa51c5c0ea8524a4`.
- Payload: JavaScript 34,265 bytes raw / 11.84 kB gzip; CSS 18,426 bytes raw / 4.85 kB gzip; hero image 60,112 bytes.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 904 ms, LCP 958 ms, TBT 59 ms, CLS 0. Evidence: `.factory/qa-artifacts/polish-3/live/lighthouse-demo-mobile.json`.

## Run and deploy

```sh
npm ci
npm test
npm run lint
npm run build
PLAYWRIGHT_BASE_URL=https://recipe-import-repair.sociobot.in npm run test:e2e
```

The static deployment is `dist/` through Azure Static Web Apps. The work-order deployment command completed successfully for the ID above.

## Known gaps and next steps

None. The deterministic local repair scope needs no runtime AI service; the product imports, inspects, repairs, undoes, and exports locally without one.
