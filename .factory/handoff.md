# Review 2 handoff — FAIL

- Work order: `recipe-import-repair-review-2`
- Base reviewed: `2a8eb27b75f9b2a9ca95cddfbef4b8ab06d057ea`
- Live URL: <https://recipe-import-repair.sociobot.in>
- Date: 2026-08-29 UTC
- Product code changed: no

## Completed work

- Wrote `.factory/review-2.md` with a fresh mobile/desktop first read, complete landing/README copy audit, one-click demo and storage isolation checks, claim cross-check, historical finding verification, route/metadata/link/accessibility checks, and missed-leverage assessment.
- Ran every one of the 13 commands in `.factory/claims.json` independently from a clean clone; all passed.
- Ran the clean clone's full `npm test`, typecheck, lint, and production build; all passed. The live JavaScript hash matches the clean build.

## Result and next steps

The verdict is **FAIL** with 3 blocking and 9 minor findings. The primary blockers are the custom export's lack of a demonstrated import destination, broken scroll/focus history behavior, and the dead skip link on the live 404. Exact evidence and concrete fixes are in `.factory/review-2.md`.

After repair, rerun all manifest commands from a clean clone plus the full live demo/storage/request, route, link, metadata, and Axe checks described in the report.

---

# Historical handoffs

# Polish 1 handoff — PASS

- Work order: `recipe-import-repair-polish-1`
- Base reviewed: `d0030d6115ea2393b6f645a704f2f54ac68a183f`
- Repair commits: `11034f70cafe66764e244495da4266ce8df570d0`, `f9c4a87`, `49a10bd`
- Deployment: Azure Static Web Apps, deployment ID `a58bb19f-6e22-439b-9ccc-ad341ed621ff`
- Live URL: <https://recipe-import-repair.sociobot.in/?demo=1>
- Date: 2026-08-29 UTC

## Completed work

- Closed every finding in `.factory/review-1.md`; the detailed map is in
  `.factory/polish-1.md`.
- Added the one-click `?demo=1` sample entry, persistent banner, reset proof,
  and explicit leave-and-discard wording. `/demo` remains an equivalent route.
- Rewrote reviewed metaphor/slogan labels in plain task language, including
  both 404 pages. Added the manifest claim and browser proof for the three
  sample issues, and extended neutral-export proof for parsed ingredient fields.

## Verification

- Clean clone at `/tmp/recipe-import-repair-clean.GxXacx/repo`: `npm ci`,
  `npm test`, then all 13 commands in `.factory/claims.json`: PASS.
- Current tree: `npm test` (8 unit/config and 22 Chromium tests),
  `npm run typecheck`, `npm run lint`, and `npm run build`: PASS.
- Local `verify-url.sh` for `/` and `/?demo=1`: PASS; no console errors, one
  h1, `lang=en`, main landmark, and image alt text.
- Local and live Playwright Axe checks: zero serious/critical violations on
  demo, Privacy, and Terms; the full suite also covers home and 404 in both
  themes. The standalone Axe CLI was attempted but cannot locate a system
  Chrome in this worker image; Playwright uses the supplied browser.
- Cold live check proves three sample issues, reset, isolated storage,
  leave-demo clearing, revised copy, same-origin requests, titles, and HTTP
 404. A final post-deploy cold check also confirms the task label and absence
 of the remaining “FIELD NOTE” and “Review each mark” wording. Evidence is
 under `.factory/evidence/polish-1/`.
- Local and live JavaScript SHA-256 match:
  `6b3e0b1805a462ec4e20ce3b3a899dbe3c9851e22de9bfe36669e211c3d82ad9`.

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh recipe-import-repair ./dist
```

## Known gaps

None in the product. The standalone Axe CLI needs a system Chrome unavailable
in this container; equivalent Playwright Axe checks passed.

---

# Historical review and verification handoffs

# Review 1 handoff — FAIL

- Work order: `recipe-import-repair-review-1`
- Date: 2026-08-29 UTC
- Scope: independent live review only; no product-code changes were made.
- Result: **FAIL** with four minor documentation/copy/claims findings in
  `.factory/review-1.md` (`F-1-1` through `F-1-4`).

Verified: fresh 390 px and desktop live contexts; one-click `/demo`, reset,
and leave-demo isolation; request logging; controlled offline demo reload;
routing, titles, link responses, 404, and route focus/back navigation. All 12
claim commands passed from a fresh local clone. The full 21-browser-test suite
and production build passed locally. The live JavaScript hash matches the
fresh local build.

Known gaps: replace metaphor/slogan copy and ambiguous demo-exit label; list
and test the quantified three-issue sample promise; test/list parsed export
quantity, unit, and item fields. See `.factory/review-1.md` for exact quotes
and fixes.

---

# Recipe Import Repair verification handoff — PASS

- Work order: `recipe-import-repair-verify-5`
- Verified candidate: `05ba606bd137ffbb9d7103f937d4289efd4081a0`
- Live URL: <https://recipe-import-repair.sociobot.in>
- Date: 2026-08-28 UTC
- Result: **PASS**

Independent verification found no release-blocking defects. The deployed
assets exactly match a fresh `npm run build` from the candidate. Every one of
the 12 commands in `.factory/claims.json`, all unit and browser tests,
typecheck, lint, and the production build passed. The prior verifier's
31-repair undo boundary and overlapping batch-repair failures were each
reproduced live and now pass.

How to verify: run `npm ci`, every command listed in `.factory/claims.json`,
`npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`; then use
`/demo` to apply all repairs, undo, export, reset, and leave demo. The complete
evidence, deployment hashes, accessibility/PWA/privacy checks, and Lighthouse
report are in [`.factory/verification-5.md`](verification-5.md).

Known gaps: none found. This product has no backend, account, payment, AI,
package, or CLI surface, so server rate-limit, Entra, concurrency, and consumer
installation checks do not apply.

---

# Recipe Import Repair repair handoff

- Work order: `recipe-import-repair-repair-4`
- Verifier report commit: `20549945b4b93e8b495f52894f2b886922eb7103`
- Repaired candidate: `344256c2562a7261ad23068a2d97bb64410afb5e`
- Repair commit: `4502666de70d239abf007b319303226fe914f6e1`
- Deployment class: static web, Azure Static Web Apps from `dist/`
- Live URL: <https://recipe-import-repair.sociobot.in>
- Date: 2026-08-28 UTC
- Result: **PASS**

## What changed

- Removed the silent 30-snapshot cutoff. Undo history is now lossless for the
  active recipe, so all 31 repairs in the verifier case return to their exact
  original lines.
- Batch repair now re-inspects the current recipe before each queued repair.
  Overlapping transforms therefore compose instead of overwriting an earlier
  transform. `1½ tablespoons oil` becomes `1 1/2 tbsp oil` in one batch.
- Each undo snapshot records the prior repair-log length. Undoing a batch now
  restores the log exactly without deleting entries from earlier actions.
- Expanded `@claim:reversible-repairs` across the reported 31-repair boundary
  and updated its claims-manifest sandbox. Added a browser regression for the
  exact overlapping fraction-and-unit batch, its announcement, clean result,
  and one-step undo.

## Reproduction and regression evidence

Both new tests failed against the verifier candidate before the product fix:

- The 31st undo waited on a disabled button after only 30 reversals.
- The batch regression received `1½ tbsp oil` instead of
  `1 1/2 tbsp oil` and left one issue.

After the fix, local and live browser runs prove:

- 31 repairs applied, 31 undos available, 0 repaired lines left.
- **Apply 2 safe repairs** returns `1 1/2 tbsp oil`, leaves 0 issues, shows
  **Ready to export**, and Undo restores both original issues.

Live screenshots and machine checks are under
`.factory/evidence/repair-4/live/`. The full independent verifier script was
run against the deployed custom domain with its evidence paths redirected to
that directory.

## Clean local verification

- `npm ci`: PASS; 61 packages installed, 0 vulnerabilities.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm test`: PASS; 8 unit/config tests and 21 Chromium browser tests.
- `npm run build`: PASS; `dist/index.html` exists at the output root.
- All 12 exact test commands in `.factory/claims.json`: PASS independently.
- `/opt/fleet/lib/verify-url.sh` on local `/` and `/demo`: PASS with no
  console/page errors, one `h1`, `lang=en`, `main`, image alt text, and labeled
  buttons. Desktop and 390 px screenshots are in the evidence directory.
- Local mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.0 s, LCP 1.6 s, TBT 0 ms, CLS 0.
- Production payload: JavaScript 29,758 B raw / 10.68 KB gzip; CSS 16,820 B
  raw / 4.56 KB gzip; hero WebP 60,112 B; no web-font payload.

## Live browser, accessibility, privacy, and PWA checks

- The full demo repair, export, undo, reset, and leave-demo flows pass.
  Export is schema `1.0`, retains author and source URL, and leaves every
  cooking instruction byte-for-byte unchanged.
- Empty/malformed source recovery, exact text boundaries, invalid source URL,
  blank edited fields, and export blocking pass.
- Axe 4.10.2 reports zero serious/critical issues for `/`, `/demo`,
  `/privacy`, `/terms`, and the HTTP 404 in light and dark modes.
- At 390 × 844 there is no overflow or target below 44 × 44 px. At 200% text,
  width remains 390 px and the decorative margin note stays hidden.
- Keyboard checks pass for the skip link, repair activation, route and rerender
  focus. The focused skip link has a 3 px high-contrast outline. Reduced-motion
  mode leaves no transition or animation longer than 0.01 ms.
- The repair/export flow makes four same-origin requests and no third-party
  requests. `localStorage` stays empty. Demo state uses only the documented
  `demo:` session key, which is removed by **Start for real**.
- Service-worker `registration.update()` completes. A controlled offline
  `/demo` reload retains the sample and displays the offline status.
- Live response policy includes same-origin CSP with `frame-ancestors 'none'`,
  HSTS, `nosniff`, strict-origin referrer policy, and disabled camera,
  microphone, and geolocation. Hashed JS/CSS are immutable for one year;
  HTML revalidates after 30 seconds; an unknown route returns HTTP 404.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 1.2 s, TBT 40 ms, CLS 0; 81 KiB transferred.

## Deployment and identity

`/opt/fleet/lib/deploy-static.sh recipe-import-repair /work/repo/dist` reused
the existing `sf-recipe-import-repair` app in Central US and deployed
successfully. Azure deployment ID:
`6e1ba125-dce7-467d-87ac-57942c6beef9`.

Fresh local and live SHA-256 hashes match exactly:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `03a5bb74f15827fefb038927fb3ae3f76d4ec81ddc8b5bf9ce3619849668cf81` |
| JavaScript | `97ca5fc88ece8df914cf8a61262154ef2e13bb2deb7f320cd19824554250e82f` |
| CSS | `ad431a900cce5e557fa26bc92233eca984de0cd889e2b6036842b19a49bb0542` |
| Hero image | `289ebad228fe5e4e616b39a6ff33e401948f9e9590427f18ea1a5f1038f158bf` |
| Social image | `6f36c8a9d295bd8c94c75e5c7b9782101336d71675004c68fedc29fb9321e9bd` |
| Service worker | `7ce1d0a75a71df024ef73f11618f363fb2bbbffbea3ddc37f1a83950d16837c9` |
| `404.html` | `ec9a0622b1c505151ed671000b9af977e301e4472cbdd0c51b79453c6581b99d` |

## Applicability and known gaps

The artifact remains a static local-first PWA. It has no backend, account,
payment, AI runtime, public package, or CLI, so backend concurrency, payment,
consumer-package, and live model checks do not apply. No known release blocker
remains.
