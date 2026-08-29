import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

interface StaticWebAppConfig {
  routes: Array<{ route: string; rewrite?: string }>;
  navigationFallback?: unknown;
  responseOverrides: Record<string, { rewrite?: string }>;
}

describe('Azure Static Web Apps routing', () => {
  test('rewrites only known app routes so unknown URLs retain HTTP 404 status', async () => {
    const config = JSON.parse(await readFile(resolve('public/staticwebapp.config.json'), 'utf8')) as StaticWebAppConfig;
    expect(config.navigationFallback).toBeUndefined();
    expect(config.routes.filter((route) => route.rewrite === '/index.html').map((route) => route.route)).toEqual(['/demo', '/privacy', '/terms']);
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
  });

  test('ships a discoverable manifest and a complete static 404 skeleton', async () => {
    const [index, notFound] = await Promise.all([
      readFile(resolve('index.html'), 'utf8'),
      readFile(resolve('public/404.html'), 'utf8'),
    ]);
    expect(index).toContain('rel="manifest" href="/manifest.webmanifest"');
    expect(notFound).toContain('href="#main"');
    expect(notFound).toContain('<main id="main" tabindex="-1">');
    expect(notFound).toContain('rel="canonical"');
    expect(notFound).toContain('property="og:title"');
    expect(notFound).toContain('name="twitter:card"');
    expect(notFound).toContain('rel="apple-touch-icon"');
    expect(notFound).toContain('<nav aria-label="Main navigation">');
    expect(notFound).toContain('href="/privacy"');
    expect(notFound).toContain('href="/terms"');
    expect(notFound).toContain('Built by Param Factory');
  });

  test('keeps reviewed copy direct and every retained export promise in the claims manifest', async () => {
    const [main, parser, readme, catalog, claimsText] = await Promise.all([
      readFile(resolve('src/main.ts'), 'utf8'),
      readFile(resolve('src/parser.ts'), 'utf8'),
      readFile(resolve('README.md'), 'utf8'),
      readFile(resolve('.factory/catalog-description.txt'), 'utf8'),
      readFile(resolve('.factory/claims.json'), 'utf8'),
    ]);
    for (const removed of ['Clear bench', 'self-hosted recipe keepers', 'three checked steps', 'safe repairs', 'Ready for another recipe keeper', 'Web addresses']) {
      expect(main).not.toContain(removed);
    }
    expect(main).toContain('Clear recipe and results');
    expect(main).toContain('Apply ${availableRepairs} suggested');
    expect(parser).toContain('Check its commas, quotes, and brackets');
    expect(readme).toContain('The tool separates the recipe into editable fields. It flags malformed quantities');
    expect(readme).not.toMatch(/self-hosted|source addresses|recipe URL|Neutral export shape/);
    const claims = JSON.parse(claimsText) as Array<{ id: string; claim: string }>;
    expect(claims.find((claim) => claim.id === 'portable-export')?.claim).toContain('Recipe JSON-LD');
    expect(claims.find((claim) => claim.id === 'neutral-export')?.claim).toContain('ISO timestamp');
    expect(catalog.trim()).toMatch(/^(Repair|Fix)\b/);
    expect(catalog.trim().length).toBeLessThanOrEqual(120);
  });
});
