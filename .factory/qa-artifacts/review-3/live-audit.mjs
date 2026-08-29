import { chromium } from '@playwright/test';
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const base = 'https://recipe-import-repair.sociobot.in';
const out = new URL('./', import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const report = { cold: {}, demo: {}, routes: {}, links: {}, console: [] };

for (const [name, viewport] of Object.entries({ mobile: { width: 390, height: 844 }, desktop: { width: 1440, height: 900 } })) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  page.on('console', message => { if (message.type() === 'error') report.console.push(`${name}: ${message.text()}`); });
  page.on('pageerror', error => report.console.push(`${name}: ${error.message}`));
  const response = await page.goto(base, { waitUntil: 'networkidle' });
  const cold = await page.evaluate(() => {
    const details = selector => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const box = el.getBoundingClientRect();
      return { text: el.textContent.trim(), top: box.top, bottom: box.bottom, fullyVisible: box.top >= 0 && box.bottom <= innerHeight };
    };
    return {
      title: document.title,
      statusText: document.body.innerText,
      scrollY,
      h1Count: document.querySelectorAll('h1').length,
      h1: details('h1'),
      lede: details('.lede'),
      primary: details('.hero-actions .primary'),
      actionNote: details('.action-note'),
      facts: details('.facts'),
      main: Boolean(document.querySelector('main')),
      lang: document.documentElement.lang,
      bodyWidth: document.body.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    };
  });
  cold.status = response?.status();
  report.cold[name] = cold;
  await page.screenshot({ path: fileURLToPath(new URL(`cold-${name}.png`, out)), fullPage: false });
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    localStorage.setItem('real:sentinel', 'keep');
    sessionStorage.setItem('real:session-sentinel', 'keep');
  });
  const page = await context.newPage();
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  page.on('console', message => { if (message.type() === 'error') report.console.push(`demo: ${message.text()}`); });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await page.waitForLoadState('networkidle');
  report.demo.initial = await page.evaluate(() => ({
    url: location.href,
    title: document.title,
    h1: document.querySelector('h1')?.textContent.trim(),
    banner: document.querySelector('.demo-strip')?.textContent.replace(/\s+/g, ' ').trim(),
    recipeTitle: document.querySelector('[data-field="title"]')?.value,
    ingredients: document.querySelectorAll('[data-field^="ingredient-"]').length,
    steps: document.querySelectorAll('[data-field^="step-"]').length,
    repairs: document.querySelectorAll('[data-repair]').length,
    local: Object.fromEntries(Object.entries(localStorage)),
    session: Object.fromEntries(Object.entries(sessionStorage)),
  }));
  await page.screenshot({ path: fileURLToPath(new URL('demo-mobile.png', out)), fullPage: false });
  await page.getByRole('button', { name: 'Apply 3 suggested repairs' }).click();
  report.demo.afterApply = await page.evaluate(() => ({
    repairs: document.querySelectorAll('[data-repair]').length,
    status: document.querySelector('.status-summary')?.textContent.replace(/\s+/g, ' ').trim(),
    local: Object.fromEntries(Object.entries(localStorage)),
    session: Object.fromEntries(Object.entries(sessionStorage)),
  }));
  await page.getByRole('button', { name: 'Reset demo' }).click();
  report.demo.afterReset = await page.evaluate(() => ({
    title: document.querySelector('[data-field="title"]')?.value,
    repairs: document.querySelectorAll('[data-repair]').length,
  }));
  await page.getByRole('link', { name: 'Leave demo and clear sample' }).click();
  report.demo.afterLeave = await page.evaluate(() => ({
    url: location.href,
    source: document.querySelector('#source-text')?.value,
    local: Object.fromEntries(Object.entries(localStorage)),
    session: Object.fromEntries(Object.entries(sessionStorage)),
  }));
  report.demo.requests = requests;
  report.demo.onlySameOrigin = requests.every(url => new URL(url).origin === new URL(base).origin);
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  for (const path of ['/', '/demo', '/privacy', '/terms', '/review-3-missing']) {
    const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    report.routes[path] = await page.evaluate(() => ({
      title: document.title,
      h1: [...document.querySelectorAll('h1')].map(el => el.textContent.trim()),
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      ogTitle: document.querySelector('meta[property="og:title"]')?.content,
      main: Boolean(document.querySelector('main')),
      header: Boolean(document.querySelector('header')),
      footer: Boolean(document.querySelector('footer')),
    }));
    report.routes[path].status = response?.status();
  }
  await page.goto(`${base}/`);
  const hrefs = await page.locator('a[href]').evaluateAll(els => [...new Set(els.map(el => el.href))]);
  for (const href of hrefs) {
    if (href.startsWith('mailto:')) continue;
    try {
      const response = await context.request.get(href);
      report.links[href] = response.status();
    } catch (error) {
      report.links[href] = String(error);
    }
  }
  await context.close();
}

await browser.close();
await writeFile(new URL('live-audit.json', out), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
