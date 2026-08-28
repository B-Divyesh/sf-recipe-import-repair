import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = 'https://recipe-import-repair.sociobot.in';
const report = { base, checkedAt: new Date().toISOString() };
const browser = await chromium.launch({ headless: true });

async function freshPage(options = {}) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  return { context, page };
}

{
  const { context, page } = await freshPage({ viewport: { width: 1440, height: 900 } });
  const consoleErrors = [];
  const requests = [];
  const failedRequests = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('request', (request) => requests.push(request.url()));
  page.on('requestfailed', (request) => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  const response = await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  report.firstRead = await page.evaluate(() => ({
    status: document.readyState,
    title: document.title,
    h1: document.querySelector('h1')?.textContent?.trim(),
    lede: document.querySelector('.hero .lede')?.textContent?.trim(),
    primary: document.querySelector('.hero .primary')?.textContent?.trim(),
    primaryHref: document.querySelector('.hero .primary')?.getAttribute('href'),
    actionNote: document.querySelector('.action-note')?.textContent?.trim(),
  }));
  report.firstRead.httpStatus = response?.status();
  report.firstRead.consoleErrors = consoleErrors;
  report.firstRead.failedRequests = failedRequests;
  await context.close();
}

{
  const { context, page } = await freshPage({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
  const consoleErrors = [];
  const requestUrls = [];
  const responseHeaders = {};
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('request', (request) => requestUrls.push(request.url()));
  page.on('response', async (response) => {
    const url = new URL(response.url());
    if (url.origin === base && !responseHeaders[url.pathname]) {
      const headers = await response.allHeaders();
      responseHeaders[url.pathname] = {
        status: response.status(),
        cacheControl: headers['cache-control'] ?? null,
        contentSecurityPolicy: headers['content-security-policy'] ?? null,
        referrerPolicy: headers['referrer-policy'] ?? null,
        strictTransportSecurity: headers['strict-transport-security'] ?? null,
        xContentTypeOptions: headers['x-content-type-options'] ?? null,
        permissionsPolicy: headers['permissions-policy'] ?? null,
      };
    }
  });
  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  const stepsBefore = await page.locator('[data-field^="step-"]').evaluateAll((nodes) => nodes.map((node) => node.value));
  const issueCountBefore = await page.locator('.issue').count();
  const previews = [];
  for (const detail of await page.locator('.issue details').all()) {
    await detail.locator('summary').click();
    previews.push((await detail.innerText()).trim());
  }
  await page.getByRole('button', { name: 'Apply 3 safe repairs' }).click();
  const stepsAfter = await page.locator('[data-field^="step-"]').evaluateAll((nodes) => nodes.map((node) => node.value));
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export neutral JSON' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const bundle = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  report.demoFlow = {
    issueCountBefore,
    previews,
    readyAfterRepair: await page.getByText('Ready to export', { exact: true }).isVisible(),
    instructionsUnchanged: JSON.stringify(stepsBefore) === JSON.stringify(stepsAfter),
    export: {
      suggestedFilename: download.suggestedFilename(),
      schemaVersion: bundle.schemaVersion,
      title: bundle.recipe.title,
      attribution: bundle.attribution,
      firstIngredient: bundle.recipe.ingredients[0].raw,
    },
    storage: await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) })),
  };
  await page.getByRole('button', { name: 'Undo last change' }).click();
  report.demoFlow.undoRestoredThreeIssues = (await page.locator('.issue').count()) === 3;
  await page.getByRole('button', { name: 'Reset demo' }).click();
  report.demoFlow.resetRestoredSample = await page.locator('#source-text').inputValue().then((value) => value.includes('Rosemary tomato beans'));
  await page.getByRole('link', { name: 'Start for real' }).click();
  report.demoFlow.startForReal = {
    path: new URL(page.url()).pathname,
    emptySource: (await page.locator('#source-text').inputValue()) === '',
    storage: await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) })),
  };
  report.privacy = {
    requests: requestUrls,
    allSameOrigin: requestUrls.every((url) => new URL(url).origin === base),
    consoleErrors,
    responseHeaders,
  };
  await context.close();
}

{
  const { context, page } = await freshPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${base}/`);
  const source = page.locator('#source-text');
  const inspect = page.getByRole('button', { name: 'Inspect recipe' });
  await source.fill('');
  await inspect.click();
  const emptyError = await page.getByRole('alert').innerText();
  await source.fill('{"name": }');
  await inspect.click();
  const malformedError = await page.getByRole('alert').innerText();
  const validMarkdown = '# Recovery soup\n\nSource: https://example.com/recovery\nAuthor: Jo Example\n\n## Ingredients\n- 1 cup beans\n\n## Steps\n1. Warm the beans.';
  await source.fill(validMarkdown);
  await inspect.click();
  const recovery = {
    title: await page.getByLabel(/Title/).inputValue(),
    author: await page.getByLabel(/Author/).inputValue(),
    exportEnabled: await page.getByRole('button', { name: 'Export neutral JSON' }).isEnabled(),
  };
  const inspectJson = async (value) => {
    await source.fill(JSON.stringify(value));
    await inspect.click();
  };
  await inspectJson({ title: 'T'.repeat(120), ingredients: [`1 cup ${'i'.repeat(214)}`], steps: ['s'.repeat(1000)] });
  const exactBoundaryIssues = await page.locator('.issue').count();
  await inspectJson({ title: 'T'.repeat(121), ingredients: [`1 cup ${'i'.repeat(215)}`], steps: ['s'.repeat(1001)] });
  const overBoundaryMessages = await page.locator('.issue').allInnerTexts();
  await inspectJson({ title: 'Invalid source', sourceUrl: 'ftp://example.com/a', ingredients: ['1 cup rice'], steps: ['Cook.'] });
  const invalidSourceBlocked = await page.getByRole('button', { name: 'Export neutral JSON' }).isDisabled();
  await inspectJson({ title: 'Valid recipe', ingredients: ['1 cup rice'], steps: ['Cook.'] });
  await page.getByLabel(/Title/).fill('   ');
  await page.getByLabel(/Title/).press('Tab');
  await page.locator('#ingredient-0').fill('');
  await page.locator('#ingredient-0').press('Tab');
  const editedBlank = {
    messages: await page.locator('.issue').allInnerTexts(),
    exportDisabled: await page.getByRole('button', { name: 'Export neutral JSON' }).isDisabled(),
  };
  report.invalidAndBoundaries = { emptyError, malformedError, recovery, exactBoundaryIssues, overBoundaryMessages, invalidSourceBlocked, editedBlank };
  await context.close();
}

{
  const { context, page } = await freshPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${base}/`);
  const source = page.locator('#source-text');
  await source.fill(JSON.stringify({ title: 'Overlap', ingredients: ['1½ tablespoons oil'], steps: ['Mix.'] }));
  await page.getByRole('button', { name: 'Inspect recipe' }).click();
  const before = await page.locator('.issue').allInnerTexts();
  const applyLabel = await page.locator('[data-action="apply-all"]').innerText();
  await page.locator('[data-action="apply-all"]').click();
  report.overlappingRepairs = {
    before,
    applyLabel,
    ingredientAfter: await page.locator('#ingredient-0').inputValue(),
    issuesAfter: await page.locator('.issue').allInnerTexts(),
    readyAfter: await page.getByText('Ready to export', { exact: true }).isVisible().catch(() => false),
  };
  await page.screenshot({ path: '.factory/qa-artifacts/live-overlapping-repair-after-apply.png', fullPage: false });

  const manyIngredients = Array.from({ length: 31 }, (_, index) => `1 tablespoons item ${index + 1}`);
  await source.fill(JSON.stringify({ title: 'History boundary', ingredients: manyIngredients, steps: ['Mix.'] }));
  await page.getByRole('button', { name: 'Inspect recipe' }).click();
  for (let index = 0; index < 31; index += 1) {
    await page.locator('[data-repair]').first().click();
  }
  let undoCount = 0;
  while (await page.locator('[data-action="undo"]').isEnabled()) {
    await page.locator('[data-action="undo"]').click();
    undoCount += 1;
    if (undoCount > 40) break;
  }
  report.undoBoundary = {
    appliedCount: 31,
    availableUndoCount: undoCount,
    remainingRepairedLines: await page.locator('[data-field^="ingredient-"]').evaluateAll((nodes) => nodes.map((node) => node.value).filter((value) => value.includes(' tbsp ')).length),
  };
  await page.screenshot({ path: '.factory/qa-artifacts/live-undo-boundary.png', fullPage: false });
  await context.close();
}

{
  const routeResults = [];
  for (const colorScheme of ['light', 'dark']) {
    const { context, page } = await freshPage({ colorScheme, viewport: { width: 1280, height: 900 } });
    for (const path of ['/', '/demo', '/privacy', '/terms', '/missing-verification-route']) {
      const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
      const axe = await new AxeBuilder({ page }).analyze();
      routeResults.push({
        colorScheme,
        path,
        status: response?.status(),
        title: await page.title(),
        lang: await page.locator('html').getAttribute('lang'),
        h1Count: await page.locator('h1').count(),
        mainCount: await page.locator('main').count(),
        seriousCritical: axe.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical').map((item) => item.id),
      });
    }
    await context.close();
  }
  report.routesAndAxe = routeResults;
}

{
  const { context, page } = await freshPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  const tooSmall = await page.locator('a, button, input, textarea, summary').evaluateAll((nodes) => nodes.flatMap((node) => {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    if (rect.width === 0 || rect.height === 0 || style.visibility === 'hidden' || style.display === 'none') return [];
    return rect.width < 44 || rect.height < 44 ? [{ tag: node.tagName, text: (node.textContent || node.getAttribute('aria-label') || '').trim().slice(0, 80), width: rect.width, height: rect.height }] : [];
  }));
  const motion = await page.locator('*').evaluateAll((nodes) => nodes.flatMap((node) => {
    const style = getComputedStyle(node);
    const animation = style.animationDuration.split(',').some((value) => parseFloat(value) > 0.01);
    const transition = style.transitionDuration.split(',').some((value) => parseFloat(value) > 0.01);
    return animation || transition ? [{ tag: node.tagName, className: node.className, animationDuration: style.animationDuration, transitionDuration: style.transitionDuration }] : [];
  }));
  await page.keyboard.press('Tab');
  const skipFocused = await page.locator('.skip-link').evaluate((node) => node === document.activeElement);
  const focusStyle = await page.locator('.skip-link').evaluate((node) => {
    const style = getComputedStyle(node);
    return { outline: style.outline, boxShadow: style.boxShadow };
  });
  await page.screenshot({ path: '.factory/qa-artifacts/live-mobile-demo.png', fullPage: true });
  await page.goto(`${base}/`);
  await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
  const text200 = await page.evaluate(() => ({
    scrollWidth: document.body.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
    marginNoteVisible: getComputedStyle(document.querySelector('.margin-note')).display !== 'none',
  }));
  await page.screenshot({ path: '.factory/qa-artifacts/live-mobile-text-200.png', fullPage: true });
  report.mobileKeyboardMotion = {
    viewport: { width: 390, height: 844 },
    horizontalOverflow: await page.evaluate(() => document.body.scrollWidth > document.documentElement.clientWidth),
    tooSmall,
    motion,
    skipFocused,
    focusStyle,
    text200,
  };
  await context.close();
}

{
  const { context, page } = await freshPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  const serviceWorker = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    if (!navigator.serviceWorker.controller) {
      await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
    }
    return { scope: registration.scope, controlled: Boolean(navigator.serviceWorker.controller) };
  });
  await page.reload({ waitUntil: 'networkidle' });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  report.pwa = {
    ...serviceWorker,
    offlineHeadingVisible: await page.getByRole('heading', { level: 1, name: 'Repair this sample recipe' }).isVisible(),
    offlineStrip: await page.getByText('Offline — file repair still works').isVisible(),
    sampleAvailable: (await page.locator('#source-text').inputValue()).includes('Rosemary tomato beans'),
  };
  await context.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 2));
