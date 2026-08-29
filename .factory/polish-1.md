# Polish 1 — review finding closure

- Work order: `recipe-import-repair-polish-1`
- Reviewed report: `d0030d6115ea2393b6f645a704f2f54ac68a183f`
- Repair commits: `11034f70cafe66764e244495da4266ce8df570d0`, `f9c4a87`, `49a10bd`
- Live check: <https://recipe-import-repair.sociobot.in/?demo=1>
- Evidence directory: `.factory/evidence/polish-1/`

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced the reviewed metaphor/slogan labels with “Repair recipe files in your browser,” “Recipe file preview,” “Inspect a recipe file,” “How recipe repair works,” “Privacy and limits,” and “What stays in your browser.” Rewrote the illustration caption and README field sentence. The 404 now uses plain status language. | `npm test`; `copy-audit.md`; live cold check asserts all five old phrases are absent and new headings are present; `live-home/screenshot-desktop.png`. |
| F-1-2 | Replaced “Start for real” with “Leave demo and clear sample,” beside a sentence explaining that it discards the sample and opens a blank workspace. | `@claim:demo-isolation`; `@claim:demo-sample-issues`; live check leaves the demo with empty source and no session keys; `live-demo-query-390.png`. |
| F-1-3 | Added the `demo-sample-issues` claim. The new browser test opens `?demo=1`, asserts Rosemary tomato beans, exactly three repairable issues, the banner, reset behavior, and leave action. | `npm test -- --grep @claim:demo-sample-issues`; all 13 claim commands pass from the clean clone; live URL above shows all three issues. |
| F-1-4 | Expanded `neutral-export` claim wording and test to assert downloaded ingredient `raw`, `quantity`, `unit`, and `item`, alongside schema and attribution. | `npm test -- --grep @claim:neutral-export`; all 13 claim commands pass from the clean clone. |

## Live re-check

The deployed cold run returned `Demo — Recipe Import Repair`, the persistent
banner, three issues, working reset, empty real workspace after leaving, only
same-origin requests, zero primary-route console errors, zero serious/critical
Playwright Axe violations, and an HTTP 404 with “Page not found.” The live app
bundle SHA-256 equals the local build:
`6b3e0b1805a462ec4e20ce3b3a899dbe3c9851e22de9bfe36669e211c3d82ad9`.
The final deployment also removes the remaining visible “FIELD NOTE” and
“Review each mark” phrases while retaining the product’s notebook visual system.
