# Recipe Import Repair

Recipe Import Repair fixes broken recipe imports before saving them to a recipe app. It is for people who run their own recipe app and need to fix a file before importing it.

Paste Recipe JSON, JSON-LD, or Markdown. The tool separates the recipe into editable fields. It flags malformed quantities, long units, missing data, invalid source URLs, and oversized fields. Each suggested repair shows the exact change and can be undone.

Download Schema.org Recipe JSON-LD or a repaired file in the original format. Both downloads can be imported into this tool again. A repair-details JSON download preserves the source URL, author, ISO export time, and parsed ingredient fields.

Recipe text stays in the browser. The app works offline after the first visit. The full repair and export flow is free and needs no account.

## Try the isolated demo

Open `?demo=1`, `/demo`, or [the deployed demo](https://recipe-import-repair.sociobot.in/?demo=1). It loads “Rosemary tomato beans” with three repairable issues. Demo source uses a separate `demo:` session storage key and never enters real storage. Use **Reset demo** for a clean sample. **Leave demo and clear sample** discards it and opens a blank workspace.

## Run locally

Requires Node.js 22 or newer.

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

## Test and build

```sh
npm test
npm run build
```

`npm test` runs parser tests and browser claim tests. Playwright 1.58.2 is pinned. The production build lands in `dist/`, with `dist/index.html` at its root.

Individual public claims can be checked with the commands in `.factory/claims.json`. For example:

```sh
npm test -- --grep @claim:neutral-export
```

## Supported input

- JSON objects with common recipe fields
- JSON-LD `Recipe` objects, including recipes inside `@graph`
- Markdown with a title, Ingredients section, and Steps, Instructions, Directions, or Method section

The tool never opens a source URL or changes cooking instructions.

## Export formats

- **Recipe JSON-LD** uses Schema.org `Recipe` fields for recipe apps that accept JSON-LD.
- **Repaired original format** keeps the input as JSON, JSON-LD, or Markdown.
- **Repair details** includes `schemaVersion`, an ISO `exportedAt` value, the recipe, and attribution. Ingredients include repaired text, quantity, unit, and item fields.

## Deploy

Run the exact build command:

```sh
npm run build
```

Deploy `./dist` to Azure Static Web Apps. `staticwebapp.config.json` provides the route fallback, security headers, and 404 rewrite.

## License

MIT. See [LICENSE](./LICENSE).
