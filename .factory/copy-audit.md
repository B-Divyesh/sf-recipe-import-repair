# Copy audit

Audit date: 2026-08-29. Counts treat hyphenated terms, URLs, code names, and `$0` as one word. No sentence exceeds 22 words. No sentence contains a banned marketing word.

## Landing page

| Sentence or label | Words | Result |
| --- | ---: | --- |
| Repair recipe files in your browser | 6 | Pass |
| Fix broken recipe imports before saving | 6 | Pass |
| For people who run their own recipe app and need to fix a file before importing it. | 17 | Pass |
| Try it with sample data | 5 | Pass |
| Choose your file | 3 | Pass |
| The sample opens with three repairable issues. | 7 | Pass — `demo-sample-issues` |
| Files stay in this browser | 5 | Pass — `local-only` |
| Works offline after first visit | 5 | Pass — `offline-reload` |
| Free — no account needed | 4 | Pass — `free-flow` |
| Inspect recipe fields. | 3 | Pass |
| Review each repair. | 3 | Pass |
| Preserve source attribution. | 3 | Pass — `neutral-export` |
| Paste JSON, JSON-LD, or Markdown. | 5 | Pass — `format-import` |
| You see the parsed fields before you export anything. | 9 | Pass — `format-import` |
| Maximum file size: 2 MB. | 5 | Pass — `file-limit` |
| Source URLs are preserved and never opened. | 7 | Pass — `source-url-no-fetch` |
| Your parsed fields will appear here. | 6 | Pass |
| Paste recipe text or choose a file. | 7 | Pass |
| Then inspect it. | 3 | Pass |
| Repair a recipe in three steps | 6 | Pass |
| The tool separates title, source, ingredients, and steps. | 8 | Pass — `format-import` |
| Every suggested repair shows its exact before and after value. | 10 | Pass — `exact-change-preview` |
| Download Recipe JSON-LD or keep the source file format. | 9 | Pass — `portable-export` |
| The tool does not fetch recipe pages. | 7 | Pass — `source-url-no-fetch` |
| Repairs do not change cooking instructions. | 6 | Pass — `instructions-unchanged` |
| No recipe text leaves your device. | 6 | Pass — `local-only` |
| No account is required. | 4 | Pass — `free-flow` |

The first screen states the job, audience, and first action in one breath at 390 px.

## Demo and export

| Sentence or label | Words | Result |
| --- | ---: | --- |
| Demo — sample data, nothing is saved | 6 | Pass — `demo-isolation` |
| Leaving opens a blank workspace and discards this sample. | 9 | Pass — `demo-isolation` |
| Repair this sample recipe | 4 | Pass |
| The sample includes a fraction, a malformed decimal, and a long unit. | 12 | Pass — `demo-sample-issues`, `exact-change-preview` |
| Apply 3 suggested repairs | 4 | Pass — no undefined safety claim |
| Choose a format and download the repaired recipe. | 8 | Pass |
| Recipe JSON-LD uses Schema.org Recipe fields. | 6 | Pass — `portable-export` |
| Repaired original keeps this file's JSON-LD format. | 7 | Pass — `portable-export` |
| Clear recipe and results | 4 | Pass |
| The JSON has invalid punctuation. | 6 | Pass |
| Check its commas, quotes, and brackets, then inspect it again. | 10 | Pass |

## README

| Sentence | Words | Result |
| --- | ---: | --- |
| Recipe Import Repair fixes broken recipe imports before saving them to a recipe app. | 14 | Pass |
| It is for people who run their own recipe app and need to fix a file before importing it. | 18 | Pass |
| Paste Recipe JSON, JSON-LD, or Markdown. | 5 | Pass — `format-import` |
| The tool separates the recipe into editable fields. | 8 | Pass — `format-import` |
| It flags malformed quantities, long units, missing data, invalid source URLs, and oversized fields. | 14 | Pass — `repair-diagnostics` |
| Each suggested repair shows the exact change and can be undone. | 11 | Pass — `exact-change-preview`, `reversible-repairs` |
| Download Schema.org Recipe JSON-LD or a repaired file in the original format. | 12 | Pass — `portable-export` |
| Both downloads can be imported into this tool again. | 9 | Pass — `portable-export` |
| A repair-details JSON download preserves the source URL, author, ISO export time, and parsed ingredient fields. | 16 | Pass — `neutral-export` |
| Recipe text stays in the browser. | 6 | Pass — `local-only` |
| The app works offline after the first visit. | 8 | Pass — `offline-reload` |
| The full repair and export flow is free and needs no account. | 12 | Pass — `free-flow` |
| It loads “Rosemary tomato beans” with three repairable issues. | 9 | Pass — `demo-sample-issues` |
| Demo source uses a separate `demo:` session storage key and never enters real storage. | 14 | Pass — `demo-isolation` |
| Use Reset demo for a clean sample. | 7 | Pass — `demo-sample-issues` |
| Leave demo and clear sample discards it and opens a blank workspace. | 12 | Pass — `demo-isolation` |
| The tool never opens a source URL or changes cooking instructions. | 11 | Pass — `source-url-no-fetch`, `instructions-unchanged` |

Operational installation, testing, build, deployment, license, and format-list statements were checked separately. Each is factual, under 22 words, and verified by the package configuration or tests.

## Terminology

| Concept | One term used |
| --- | --- |
| User-provided text or file | recipe source |
| Parsed object | recipe |
| Original website field | source URL |
| Detected problem | issue |
| Named automatic change | repair |
| Reverting the latest change | undo |
| Portable linked-data download | Recipe JSON-LD |
| Input-shaped download | repaired original |
| Structured audit download | repair details |
| Isolated sample workspace | demo |

Catalog description: “Repair JSON, JSON-LD, and Markdown recipe files before importing them into your recipe app.” It starts with a verb and has 91 characters.
