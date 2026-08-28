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
});
