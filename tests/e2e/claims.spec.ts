import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@claim:format-import reads Markdown into editable recipe fields', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Paste JSON, JSON-LD, or Markdown').fill(`# Lemon rice

Source: https://example.com/lemon-rice

## Ingredients
- 2 cups rice
- 1 tbsp lemon juice

## Steps
1. Cook the rice.
2. Add lemon juice.`);
  await page.getByRole('button', { name: 'Inspect recipe' }).click();
  await expect(page.getByLabel(/Title/)).toHaveValue('Lemon rice');
  await expect(page.getByLabel(/Source URL/)).toHaveValue('https://example.com/lemon-rice');
  await expect(page.locator('.format-badge')).toHaveText('Markdown source');
});

test('@claim:reversible-repairs applies and undoes an exact change', async ({ page }) => {
  await page.goto('/demo');
  const firstIngredient = page.locator('#ingredient-0');
  await expect(firstIngredient).toHaveValue('1½ cups cooked white beans');
  await page.getByRole('button', { name: 'Convert fraction' }).click();
  await expect(firstIngredient).toHaveValue('1 1/2 cups cooked white beans');
  await page.getByRole('button', { name: 'Undo last change' }).click();
  await expect(firstIngredient).toHaveValue('1½ cups cooked white beans');
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
  await page.getByRole('link', { name: 'Start for real' }).click();
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

test('pages meet the automated accessibility baseline', async ({ page }) => {
  for (const path of ['/', '/demo', '/privacy', '/terms', '/missing-page']) {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/demo');
  const darkResults = await new AxeBuilder({ page }).analyze();
  expect(darkResults.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('mobile layout has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
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
