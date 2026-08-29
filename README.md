# Recipe Import Repair

Recipe Import Repair fixes broken recipe imports before saving them to a recipe keeper. It is for people who move their own recipes between self-hosted apps.

Paste Recipe JSON, JSON-LD, or Markdown. The tool separates each field and points to malformed quantities, verbose units, missing data, invalid source addresses, and oversized fields. Each automatic repair shows the exact change and can be undone. A neutral JSON export preserves the source URL and author.

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

The tool never fetches a recipe URL or changes cooking instructions.

## Neutral export shape

Exports include `schemaVersion`, `exportedAt`, the normalized `recipe`, and an `attribution` object. Ingredient lines keep both their original repaired text and parsed quantity, unit, and item fields.

## Deploy

Run the exact build command:

```sh
npm run build
```

Deploy `./dist` to Azure Static Web Apps. `staticwebapp.config.json` provides the route fallback, security headers, and 404 rewrite.

## License

MIT. See [LICENSE](./LICENSE).
