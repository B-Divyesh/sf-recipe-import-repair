import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@claim:format-import reads Recipe JSON, JSON-LD, and Markdown into editable recipe fields', async ({ page }) => {
  const fixtures = [
    { format: 'JSON', title: 'Json rice', source: JSON.stringify({ title: 'Json rice', sourceUrl: 'https://example.com/json-rice', ingredients: ['2 cups rice'], steps: ['Cook the rice.'] }) },
    { format: 'JSON-LD', title: 'Linked rice', source: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Recipe', name: 'Linked rice', url: 'https://example.com/linked-rice', recipeIngredient: ['2 cups rice'], recipeInstructions: ['Cook the rice.'] }) },
    { format: 'Markdown', title: 'Lemon rice', source: `# Lemon rice

Source: https://example.com/lemon-rice

## Ingredients
- 2 cups rice
- 1 tbsp lemon juice

## Steps
1. Cook the rice.
2. Add lemon juice.` },
  ];
  for (const fixture of fixtures) {
    await page.goto('/');
    await page.getByLabel('Paste JSON, JSON-LD, or Markdown').fill(fixture.source);
    await page.getByRole('button', { name: 'Inspect recipe' }).click();
    await expect(page.getByLabel(/Title/)).toHaveValue(fixture.title);
    await expect(page.locator('.format-badge')).toHaveText(`${fixture.format} source`);
  }
});

test('@claim:reversible-repairs applies and undoes every suggested repair', async ({ page }) => {
  test.slow();
  await page.goto('/demo');
  const repairs = [
    { button: 'Convert fraction', field: '#ingredient-0', before: '1½ cups cooked white beans', after: '1 1/2 cups cooked white beans' },
    { button: 'Fix decimal point', field: '#ingredient-1', before: '2..5 tablespoons olive oil', after: '2.5 tbsp olive oil' },
    { button: 'Use tsp', field: '#ingredient-3', before: '3 teaspoons tomato paste', after: '3 tsp tomato paste' },
  ];
  for (const repair of repairs) {
    await expect(page.locator(repair.field)).toHaveValue(repair.before);
    await page.getByRole('button', { name: repair.button }).click();
    await expect(page.locator(repair.field)).toHaveValue(repair.after);
    await page.getByRole('button', { name: 'Undo last change' }).click();
    await expect(page.locator(repair.field)).toHaveValue(repair.before);
  }

  const ingredientCount = 31;
  const ingredients = Array.from({ length: ingredientCount }, (_, index) => `1 tablespoons item ${index + 1}`);
  await page.goto('/');
  await page.getByLabel('Paste JSON, JSON-LD, or Markdown').fill(JSON.stringify({
    title: 'History boundary',
    ingredients,
    steps: ['Mix.'],
  }));
  await page.getByRole('button', { name: 'Inspect recipe' }).click();

  for (let index = 0; index < ingredientCount; index += 1) {
    await page.getByRole('button', { name: 'Use tbsp' }).first().click();
  }
  const ingredientValues = () => page.locator('[data-field^="ingredient-"]').evaluateAll(
    (fields) => fields.map((field) => (field as HTMLInputElement).value),
  );
  expect(await ingredientValues()).toEqual(ingredients.map((line) => line.replace('tablespoons', 'tbsp')));

  for (let index = 0; index < ingredientCount; index += 1) {
    await page.getByRole('button', { name: 'Undo last change' }).click();
  }
  expect(await ingredientValues()).toEqual(ingredients);
  await expect(page.getByRole('button', { name: 'Undo last change' })).toBeDisabled();
});

test('Apply N safe repairs composes overlapping changes on the latest ingredient value', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Paste JSON, JSON-LD, or Markdown').fill(JSON.stringify({
    title: 'Overlapping repairs',
    ingredients: ['1½ tablespoons oil'],
    steps: ['Mix.'],
  }));
  await page.getByRole('button', { name: 'Inspect recipe' }).click();

  await expect(page.getByRole('button', { name: 'Apply 2 safe repairs' })).toBeVisible();
  await page.getByRole('button', { name: 'Apply 2 safe repairs' }).click();

  await expect(page.locator('#ingredient-0')).toHaveValue('1 1/2 tbsp oil');
  await expect(page.getByText('Ready to export', { exact: true })).toBeVisible();
  await expect(page.locator('.issue')).toHaveCount(0);
  await expect(page.locator('.workbench [aria-live="polite"]')).toContainText('2 repairs applied');

  await page.getByRole('button', { name: 'Undo last change' }).click();
  await expect(page.locator('#ingredient-0')).toHaveValue('1½ tablespoons oil');
  await expect(page.locator('.issue')).toHaveCount(2);
});

test('@claim:repair-diagnostics identifies malformed quantities, verbose units, missing data, invalid addresses, and oversized fields', async ({ page }) => {
  const inspect = async (source: string) => {
    await page.goto('/');
    await page.getByLabel('Paste JSON, JSON-LD, or Markdown').fill(source);
    await page.getByRole('button', { name: 'Inspect recipe' }).click();
  };
  await page.goto('/demo');
  await expect(page.getByText('starts with a malformed decimal')).toBeVisible();
  await expect(page.getByText('uses “teaspoons”')).toBeVisible();
  await inspect(JSON.stringify({ title: '', ingredients: [], steps: [] }));
  await expect(page.getByText('The recipe has no title.')).toBeVisible();
  await expect(page.getByText('No ingredients were found.')).toBeVisible();
  await expect(page.getByText('No steps were found.')).toBeVisible();
  await inspect(JSON.stringify({ title: 'Bad source', sourceUrl: 'ftp://example.com/recipe', ingredients: ['1 cup rice'], steps: ['Cook.'] }));
  await expect(page.getByText('The source is not a valid web address.')).toBeVisible();
  await inspect(JSON.stringify({ title: 'T'.repeat(121), ingredients: [`1 cup ${'i'.repeat(215)}`], steps: ['s'.repeat(1001)] }));
  await expect(page.getByText('The title has 121 characters.')).toBeVisible();
  await expect(page.getByText('Ingredient 1 has 221 characters.')).toBeVisible();
  await expect(page.getByText('Step 1 has 1001 characters.')).toBeVisible();

  await inspect(JSON.stringify({ title: 'Valid recipe', ingredients: ['1 cup rice'], steps: ['Cook the rice.'] }));
  await page.getByLabel(/Title/).fill('   ');
  await page.getByLabel(/Title/).press('Tab');
  await page.locator('#ingredient-0').fill('');
  await page.locator('#ingredient-0').press('Tab');
  await expect(page.getByLabel(/Title/)).toHaveValue('');
  await expect(page.getByText('The recipe has no title.')).toBeVisible();
  await expect(page.getByText('Ingredient 1 is empty.')).toBeVisible();
  await expect(page.locator('#ingredient-0-state')).toContainText('Fix needed');
  await expect(page.getByRole('button', { name: 'Export neutral JSON' })).toBeDisabled();
  await page.getByRole('button', { name: 'Remove ingredient 1' }).click();
  await expect(page.locator('#ingredient-0')).toHaveCount(0);
  await expect(page.getByText('No ingredients were found.')).toBeVisible();
});

test('ingredients and steps have deliberate, reversible remove controls', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Remove ingredient 1' }).click();
  await expect(page.locator('[data-field^="ingredient-"]')).toHaveCount(5);
  await page.getByRole('button', { name: 'Undo last change' }).click();
  await expect(page.locator('[data-field^="ingredient-"]')).toHaveCount(6);
  await page.getByRole('button', { name: 'Remove step 1' }).click();
  await expect(page.locator('[data-field^="step-"]')).toHaveCount(2);
  await page.getByRole('button', { name: 'Undo last change' }).click();
  await expect(page.locator('[data-field^="step-"]')).toHaveCount(3);
});

test('@claim:exact-change-preview shows before and after for every suggested repair', async ({ page }) => {
  await page.goto('/demo');
  const expected = [
    ['1½ cups cooked white beans', '1 1/2 cups cooked white beans'],
    ['2..5 tablespoons olive oil', '2.5 tbsp olive oil'],
    ['3 teaspoons tomato paste', '3 tsp tomato paste'],
  ];
  const changes = page.locator('.issue details');
  await expect(changes).toHaveCount(expected.length);
  for (let index = 0; index < expected.length; index += 1) {
    await changes.nth(index).locator('summary').click();
    await expect(changes.nth(index)).toContainText(expected[index][0]);
    await expect(changes.nth(index)).toContainText(expected[index][1]);
  }
});

test('@claim:neutral-export exports repaired JSON with attribution', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Apply 3 safe repairs' }).click();
  await expect(page.getByText('Ready to export', { exact: true })).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export neutral JSON' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const bundle = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  expect(bundle.schemaVersion).toBe('1.0');
  expect(bundle.attribution).toEqual({
    sourceUrl: 'https://example.com/mara/rosemary-tomato-beans',
    author: 'Mara Vale',
  });
  expect(bundle.recipe.ingredients[0].raw).toBe('1 1/2 cups cooked white beans');
  expect(bundle.recipe.ingredients[0]).toMatchObject({
    quantity: '1 1/2',
    unit: 'cups',
    item: 'cooked white beans',
  });
});

test('@claim:demo-sample-issues opens an isolated three-issue sample from the one-click URL', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { level: 1, name: 'Repair this sample recipe' })).toBeVisible();
  await expect(page.getByLabel('Demo mode')).toContainText('Demo — sample data, nothing is saved');
  await expect(page.getByLabel(/Title/)).toHaveValue('Rosemary tomato beans');
  await expect(page.locator('.issue [data-repair], .issue button[data-repair]')).toHaveCount(3);
  await expect(page.getByRole('link', { name: 'Leave demo and clear sample' })).toBeVisible();
});

test('@claim:local-only sends no recipe data to another origin', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Apply 3 safe repairs' }).click();
  await expect(page.getByText('Ready to export', { exact: true })).toBeVisible();
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:demo-isolation keeps sample state out of real storage', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Apply 3 safe repairs' }).click();
  const demoState = await page.evaluate(() => ({
    localKeys: Object.keys(localStorage),
    sessionKeys: Object.keys(sessionStorage),
  }));
  expect(demoState.localKeys).toEqual([]);
  expect(demoState.sessionKeys).toEqual(['demo:recipe-import-repair:source']);
  await page.getByRole('link', { name: 'Leave demo and clear sample' }).click();
  expect(await page.evaluate(() => Object.keys(sessionStorage))).toEqual([]);
  await expect(page.getByLabel('Paste JSON, JSON-LD, or Markdown')).toHaveValue('');
});

test('@claim:offline-reload reloads the demo without a network', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
  });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Repair this sample recipe' })).toBeVisible();
  await expect(page.getByLabel('Paste JSON, JSON-LD, or Markdown')).toHaveValue(/Rosemary tomato beans/);
});

test('@claim:file-limit rejects recipe files larger than 2 MB', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#demo-file').setInputFiles({
    name: 'large-recipe.json',
    mimeType: 'application/json',
    buffer: Buffer.alloc(2 * 1024 * 1024 + 1, 'x'),
  });
  await expect(page.getByRole('alert')).toContainText('larger than 2 MB');
});

test('@claim:free-flow completes without an account or payment', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Apply 3 safe repairs' }).click();
  await expect(page.getByRole('button', { name: 'Export neutral JSON' })).toBeEnabled();
  await expect(page.getByText(/sign in|buy|payment/i)).toHaveCount(0);
});

test('@claim:source-url-no-fetch preserves the source URL without requesting it', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Apply 3 safe repairs' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export neutral JSON' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const bundle = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  expect(bundle.attribution.sourceUrl).toBe('https://example.com/mara/rosemary-tomato-beans');
  expect(requests.some((url) => new URL(url).origin === 'https://example.com')).toBe(false);
});

test('@claim:instructions-unchanged leaves cooking instructions byte-for-byte unchanged', async ({ page }) => {
  await page.goto('/demo');
  const before = await page.locator('[data-field^="step-"]').evaluateAll((fields) => fields.map((field) => (field as HTMLTextAreaElement).value));
  await page.getByRole('button', { name: 'Apply 3 safe repairs' }).click();
  const after = await page.locator('[data-field^="step-"]').evaluateAll((fields) => fields.map((field) => (field as HTMLTextAreaElement).value));
  expect(after).toEqual(before);
});

test('keyboard repair keeps focus on Undo last change after the workbench rerenders', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Apply 3 safe repairs' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Undo last change' })).toBeFocused();
  await expect(page.getByText('Ready to export', { exact: true })).toBeVisible();
});

test('file pickers have a visible proxy focus and field edits retain tab position', async ({ page }) => {
  await page.goto('/');
  for (const id of ['#hero-file', '#bench-home-file']) {
    const input = page.locator(id);
    await input.focus();
    await expect(input).toBeFocused();
    const box = await input.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
    await expect(input.locator('..')).toHaveCSS('outline-width', '3px');
  }
  await page.goto('/demo');
  const sourceUrl = page.getByLabel(/Source URL/);
  await sourceUrl.fill('https://example.com/changed');
  await sourceUrl.press('Tab');
  await expect(page.locator('#ingredient-0')).toBeFocused();
});

test('pages meet the automated accessibility baseline', async ({ page }) => {
  for (const path of ['/', '/demo', '/privacy', '/terms', '/missing-page']) {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }
  await page.emulateMedia({ colorScheme: 'dark' });
  for (const path of ['/', '/demo', '/privacy', '/terms']) {
    await page.goto(path);
    const darkResults = await new AxeBuilder({ page }).analyze();
    expect(darkResults.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }
});

test('mobile layout has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  const sizes = await page.evaluate(() => ({ body: document.body.scrollWidth, viewport: document.documentElement.clientWidth }));
  expect(sizes.body).toBeLessThanOrEqual(sizes.viewport);
});

test('mobile interactive targets meet the 44 px baseline', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  const selectors = ['.wordmark', '.site-header nav a', '.demo-strip a', '.demo-strip button', 'summary', '.remove-line', '.site-footer nav a'];
  for (const selector of selectors) {
    for (const target of await page.locator(selector).all()) {
      const box = await target.boundingBox();
      expect(box, `${selector} should have a box`).not.toBeNull();
      expect(Math.min(box!.width, box!.height), `${selector} should be at least 44 px in both dimensions`).toBeGreaterThanOrEqual(44);
    }
  }
});

test('mobile 200 percent text size hides the decorative margin note without overlap', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
  await expect(page.locator('.margin-note')).toBeHidden();
  const sizes = await page.evaluate(() => ({ body: document.body.scrollWidth, viewport: document.documentElement.clientWidth }));
  expect(sizes.body).toBeLessThanOrEqual(sizes.viewport);
});

test('primary routes load without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  for (const path of ['/', '/demo', '/privacy', '/terms']) {
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
  }
  expect(errors).toEqual([]);
});
