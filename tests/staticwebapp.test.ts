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
});
