import './styles.css';
import {
  canExport,
  cloneRecipe,
  createExportFile,
  inspectRecipe,
  parseIngredient,
  parseRecipe,
  type InputFormat,
  type Issue,
  type Recipe,
} from './parser';

const SAMPLE_SOURCE = `{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Rosemary tomato beans",
  "description": "A weeknight pantry supper from a handwritten family card.",
  "author": "Mara Vale",
  "url": "https://example.com/mara/rosemary-tomato-beans",
  "recipeYield": "4 bowls",
  "prepTime": "PT10M",
  "cookTime": "PT25M",
  "recipeIngredient": [
    "1½ cups cooked white beans",
    "2..5 tablespoons olive oil",
    "2 cloves garlic, sliced",
    "3 teaspoons tomato paste",
    "1 tbsp chopped rosemary",
    "400 g canned tomatoes"
  ],
  "recipeInstructions": [
    {"@type": "HowToStep", "text": "Warm the oil and garlic over medium heat."},
    {"@type": "HowToStep", "text": "Add rosemary, beans, and tomatoes. Simmer for 20 minutes."},
    {"@type": "HowToStep", "text": "Taste, season, and serve."}
  ]
}`;

type Route = 'home' | 'demo' | 'privacy' | 'terms' | 'not-found';
interface Snapshot { recipe: Recipe; label: string; repairLogLength: number }
interface RouteState { scrollX: number; scrollY: number; focus: string }

const appRoot = document.querySelector<HTMLDivElement>('#app');
if (!appRoot) throw new Error('App root is missing.');
const app: HTMLDivElement = appRoot;

let route: Route = getRoute();
let isDemo = route === 'demo';
let source = isDemo ? SAMPLE_SOURCE : '';
let recipe: Recipe | null = null;
let format: InputFormat | null = null;
let issues: Issue[] = [];
let errorMessage = '';
let notice = '';
let editHistory: Snapshot[] = [];
let repairLog: string[] = [];
let showSource = false;
let isOffline = !navigator.onLine;
let pendingFocusSelector = '';
let exportFormat: 'jsonld' | 'original' | 'details' = 'jsonld';

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
if (!window.history.state) window.history.replaceState({ scrollX: 0, scrollY: 0, focus: '' } satisfies RouteState, '', window.location.href);

if (isDemo) parseCurrentSource(false);

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char] ?? char);
}

function getRoute(): Route {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/' && new URLSearchParams(window.location.search).get('demo') === '1') return 'demo';
  if (path === '/') return 'home';
  if (path === '/demo') return 'demo';
  if (path === '/privacy') return 'privacy';
  if (path === '/terms') return 'terms';
  return 'not-found';
}

function routeMeta(current: Route): { title: string; description: string; canonical: string } {
  const base = 'https://recipe-import-repair.sociobot.in';
  const data = {
    home: ['Recipe Import Repair — fix recipe import files', 'Inspect and repair JSON, JSON-LD, or Markdown recipe files before importing them into your recipe app.', '/'],
    demo: ['Demo — Recipe Import Repair', 'Try recipe repair with an isolated sample file, then export Recipe JSON-LD or the repaired source format.', '/demo'],
    privacy: ['Privacy — Recipe Import Repair', 'How Recipe Import Repair handles files and browser data.', '/privacy'],
    terms: ['Terms — Recipe Import Repair', 'Terms for using the free Recipe Import Repair utility.', '/terms'],
    'not-found': ['Page not found — Recipe Import Repair', 'This page does not exist. Return to Recipe Import Repair.', window.location.pathname],
  }[current];
  return { title: data[0], description: data[1], canonical: `${base}${data[2]}` };
}

function updateMeta(): void {
  const meta = routeMeta(route);
  document.title = meta.title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', meta.description);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', meta.canonical);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', meta.title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', meta.description);
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', meta.canonical);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', meta.title);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', meta.description);
}

function navigate(path: string): void {
  if (`${window.location.pathname}${window.location.search}${window.location.hash}` === path) return;
  saveCurrentRouteState();
  window.history.pushState({ scrollX: 0, scrollY: 0, focus: '' } satisfies RouteState, '', path);
  changeRoute('push');
}

function saveCurrentRouteState(): void {
  const state: RouteState = { scrollX: window.scrollX, scrollY: window.scrollY, focus: focusSelector(document.activeElement) };
  window.history.replaceState(state, '', window.location.href);
}

function focusRouteTarget(mode: 'push' | 'pop'): void {
  const state = (window.history.state ?? {}) as Partial<RouteState>;
  if (mode === 'pop') {
    const target = state.focus ? document.querySelector<HTMLElement>(state.focus) : document.querySelector<HTMLHeadingElement>('h1');
    if (target?.matches('h1, h2, h3, main')) target.setAttribute('tabindex', '-1');
    target?.focus({ preventScroll: true });
    window.scrollTo({ left: state.scrollX ?? 0, top: state.scrollY ?? 0, behavior: 'instant' });
    return;
  }
  const hashTarget = window.location.hash ? document.querySelector<HTMLElement>(window.location.hash) : null;
  if (hashTarget) {
    const heading = hashTarget.matches('h1, h2, h3') ? hashTarget : hashTarget.querySelector<HTMLElement>('h1, h2, h3');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus({ preventScroll: true });
    hashTarget.scrollIntoView({ block: 'start', behavior: 'instant' });
    return;
  }
  const heading = document.querySelector<HTMLHeadingElement>('h1');
  heading?.setAttribute('tabindex', '-1');
  heading?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function changeRoute(mode: 'push' | 'pop' = 'push'): void {
  const wasDemo = isDemo;
  route = getRoute();
  isDemo = route === 'demo';
  if (isDemo && !wasDemo) resetDemo();
  if (!isDemo && wasDemo) {
    sessionStorage.removeItem('demo:recipe-import-repair:source');
    source = '';
    recipe = null;
    issues = [];
    editHistory = [];
    repairLog = [];
  }
  updateMeta();
  render();
  requestAnimationFrame(() => requestAnimationFrame(() => focusRouteTarget(mode)));
}

function parseCurrentSource(shouldAnnounce = true): void {
  try {
    const result = parseRecipe(source);
    recipe = result.recipe;
    format = result.format;
    issues = result.issues;
    editHistory = [];
    repairLog = [];
    errorMessage = '';
    notice = `${format} read. ${issues.length} ${issues.length === 1 ? 'issue' : 'issues'} found.`;
    if (isDemo) sessionStorage.setItem('demo:recipe-import-repair:source', source);
  } catch (error) {
    recipe = null;
    format = null;
    issues = [];
    errorMessage = error instanceof Error ? error.message : 'The recipe could not be read. Check the text and try again.';
    if (shouldAnnounce) notice = errorMessage;
  }
}

function saveSnapshot(label: string): void {
  if (!recipe) return;
  editHistory.push({ recipe: cloneRecipe(recipe), label, repairLogLength: repairLog.length });
}

function refreshIssues(): void {
  if (recipe) issues = inspectRecipe(recipe);
}

function applyRepair(id: string): void {
  if (!recipe) return;
  const selected = issues.find((item) => item.repair?.id === id)?.repair;
  if (!selected) return;
  saveSnapshot(selected.label);
  selected.apply(recipe);
  repairLog.push(selected.label);
  refreshIssues();
  notice = `${selected.label} applied. You can undo it.`;
  renderAndFocus('[data-action="undo"]:not([disabled])');
}

function applyAllRepairs(): void {
  if (!recipe) return;
  const available = issues.flatMap((item) => item.repair ? [item.repair] : []);
  if (!available.length) return;
  saveSnapshot(`Apply ${available.length} repairs`);
  available.forEach((queued) => {
    const current = inspectRecipe(recipe!).find((item) => item.repair?.id === queued.id)?.repair;
    current?.apply(recipe!);
  });
  repairLog.push(...available.map((item) => item.label));
  refreshIssues();
  notice = `${available.length} repairs applied. You can undo them together.`;
  renderAndFocus('[data-action="undo"]:not([disabled])');
}

function undoRepair(): void {
  const snapshot = editHistory.pop();
  if (!snapshot) return;
  recipe = snapshot.recipe;
  refreshIssues();
  repairLog = repairLog.slice(0, snapshot.repairLogLength);
  notice = `${snapshot.label} undone.`;
  renderAndFocus('[data-action="apply-all"]:not([disabled]), [data-action="export"]:not([disabled])');
}

function resetDemo(): void {
  source = SAMPLE_SOURCE;
  recipe = null;
  errorMessage = '';
  editHistory = [];
  repairLog = [];
  parseCurrentSource(false);
  sessionStorage.setItem('demo:recipe-import-repair:source', SAMPLE_SOURCE);
}

function updateRecipeField(field: string, value: string): void {
  if (!recipe) return;
  if (field.startsWith('ingredient-')) {
    const index = Number(field.slice('ingredient-'.length));
    recipe.ingredients[index] = parseIngredient(value, index);
  } else if (field.startsWith('step-')) {
    const index = Number(field.slice('step-'.length));
    recipe.steps[index] = value;
  } else if (field === 'title') {
    recipe.title = value.trim();
  } else if (field in recipe && typeof recipe[field as keyof Recipe] === 'string') {
    (recipe as unknown as Record<string, string>)[field] = value;
  }
  refreshIssues();
}

function removeIngredient(index: number): void {
  if (!recipe || index < 0 || index >= recipe.ingredients.length) return;
  saveSnapshot(`Remove ingredient ${index + 1}`);
  recipe.ingredients.splice(index, 1);
  refreshIssues();
  notice = `Ingredient ${index + 1} removed. You can undo it.`;
  const nextIndex = Math.min(index, recipe.ingredients.length - 1);
  renderAndFocus(nextIndex >= 0 ? `#ingredient-${nextIndex}` : '[data-action="add-ingredient"]');
}

function removeStep(index: number): void {
  if (!recipe || index < 0 || index >= recipe.steps.length) return;
  saveSnapshot(`Remove step ${index + 1}`);
  recipe.steps.splice(index, 1);
  refreshIssues();
  notice = `Step ${index + 1} removed. You can undo it.`;
  const nextIndex = Math.min(index, recipe.steps.length - 1);
  renderAndFocus(nextIndex >= 0 ? `#step-${nextIndex}` : '[data-action="add-step"]');
}

function exportRecipe(): void {
  if (!recipe || !format || !canExport(recipe)) return;
  const exported = createExportFile(recipe, exportFormat, format);
  const blob = new Blob([exported.content], { type: exported.mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = `${recipe.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'recipe'}-${exported.suffix}.${exported.extension}`;
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  notice = `Exported ${filename}.`;
  render();
}

function header(): string {
  return `<a class="skip-link" href="#main">Skip to main content</a>
    ${isOffline ? '<div class="offline-strip" role="status">Offline — file repair still works</div>' : ''}
    ${isDemo ? `<aside class="demo-strip" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved</strong><span><button class="text-button" data-action="reset-demo">Reset demo</button><a href="/" data-nav>Leave demo and clear sample</a></span><small>Leaving opens a blank workspace and discards this sample.</small></aside>` : ''}
    <header class="site-header">
      <a class="wordmark" href="/" data-nav aria-label="Recipe Import Repair home"><span aria-hidden="true">✓</span> Recipe Import Repair</a>
      <nav aria-label="Main navigation">
        <a href="/demo" data-nav${route === 'demo' ? ' aria-current="page"' : ''}>Demo</a>
        <a href="/#how-it-works" data-nav>How it works</a>
        <a href="/privacy" data-nav${route === 'privacy' ? ' aria-current="page"' : ''}>Privacy</a>
      </nav>
    </header>`;
}

function footer(): string {
  return `<footer class="site-footer">
    <div><strong>Recipe Import Repair</strong><p>Fix recipe files before importing them into your recipe app.</p></div>
    <nav aria-label="Footer navigation"><a href="/privacy" data-nav>Privacy</a><a href="/terms" data-nav>Terms</a><a href="https://hello-factory.sociobot.in" target="_blank" rel="noreferrer">Built by Param Factory <span class="sr-only">(opens in a new tab)</span></a></nav>
    <p class="build-note">v1.0.0 · Original generated illustration</p>
  </footer>`;
}

function factList(): string {
  return `<ul class="facts" aria-label="Product facts">
    <li><span aria-hidden="true">⌂</span> Files stay in this browser</li>
    <li><span aria-hidden="true">↯</span> Works offline after first visit</li>
    <li><span aria-hidden="true">$0</span> Free — no account needed</li>
  </ul>`;
}

function homePage(): string {
  return `<main id="main">
    <section class="hero" aria-labelledby="home-title">
      <div class="margin-note" aria-hidden="true">CHECK<br>BEFORE IMPORT</div>
      <div class="hero-copy">
        <p class="eyebrow">Repair recipe files in your browser</p>
        <h1 id="home-title">Fix broken recipe imports before saving</h1>
        <p class="lede">For people who run their own recipe app and need to fix a file before importing it.</p>
        <div class="hero-actions">
          <a class="button primary" href="/?demo=1" data-nav>Try it with sample data</a>
          <label class="button secondary file-picker">Choose your file<input id="hero-file" class="file-input" type="file" accept=".json,.jsonld,.md,.markdown,text/markdown,application/json" /></label>
        </div>
        <p class="action-note">The sample opens with three repairable issues.</p>
        ${factList()}
      </div>
      <figure class="hero-art">
        <img src="/assets/repair-workbench.webp" width="960" height="640" alt="An illustrated graph-paper notebook with recipe lines and red correction marks." fetchpriority="high" decoding="async" />
        <figcaption>Inspect recipe fields. Review each repair. Preserve source attribution.</figcaption>
      </figure>
    </section>
    <section class="preview-section" aria-labelledby="preview-title">
      <div class="section-intro"><p class="eyebrow">Recipe file preview</p><h2 id="preview-title">Inspect a recipe file</h2><p>Paste JSON, JSON-LD, or Markdown. You see the parsed fields before you export anything.</p></div>
      ${workbench(false)}
    </section>
    <section id="how-it-works" class="method" aria-labelledby="method-title">
      <div class="section-intro"><p class="eyebrow">How recipe repair works</p><h2 id="method-title">Repair a recipe in three steps</h2></div>
      <ol class="method-list">
        <li><span>01</span><div><h3>Read the file</h3><p>The tool separates title, source, ingredients, and steps.</p></div></li>
        <li><span>02</span><div><h3>Review each repair</h3><p>Every suggested repair shows its exact before and after value.</p></div></li>
        <li><span>03</span><div><h3>Choose an export format</h3><p>Download Recipe JSON-LD or keep the source file format.</p></div></li>
      </ol>
    </section>
    <section class="boundaries" aria-labelledby="boundaries-title">
      <div><p class="eyebrow">Privacy and limits</p><h2 id="boundaries-title">What stays in your browser</h2></div>
      <div><p>The tool does not fetch recipe pages. Repairs do not change cooking instructions.</p><p>No recipe text leaves your device. No account is required.</p></div>
    </section>
  </main>`;
}

function demoPage(): string {
  return `<main id="main" class="demo-main">
    <section class="demo-heading"><p class="eyebrow">Sample recipe file</p><h1>Repair this sample recipe</h1><p>The sample includes a fraction, a malformed decimal, and a long unit.</p></section>
    ${workbench(true)}
  </main>`;
}

function issueSummary(): string {
  const errors = issues.filter((item) => item.severity === 'error').length;
  const warnings = issues.length - errors;
  if (!issues.length) return `<div class="status-summary valid"><strong>Ready to export</strong><span>No blocking issues remain.</span></div>`;
  return `<div class="status-summary"><strong>${issues.length} ${issues.length === 1 ? 'issue' : 'issues'} found</strong><span>${errors} blocking · ${warnings} to review</span></div>`;
}

function issueList(): string {
  if (!recipe) return '';
  if (!issues.length) return `<div class="clean-sheet"><span aria-hidden="true">✓</span><div><h3>No issues found</h3><p>Choose a format and download the repaired recipe.</p></div></div>`;
  return `<ol class="issue-list">${issues.map((item) => `<li class="issue ${item.severity}" data-issue="${item.id}">
      <div class="issue-mark" aria-hidden="true">${item.severity === 'error' ? '!' : '?'}</div>
      <div class="issue-copy"><p><strong>${item.severity === 'error' ? 'Fix' : 'Review'}:</strong> ${escapeHtml(item.message)}</p><p>${escapeHtml(item.next)}</p>
      ${item.repair ? `<details><summary>See exact change</summary><dl class="change"><div><dt>Before</dt><dd>${escapeHtml(item.repair.before)}</dd></div><div><dt>After</dt><dd>${escapeHtml(item.repair.after)}</dd></div></dl></details><button class="small-button" data-repair="${item.repair.id}">${escapeHtml(item.repair.label)}</button>` : `<button class="text-button jump" data-jump="${escapeHtml(item.field)}">Edit this field</button>`}
      </div></li>`).join('')}</ol>`;
}

function fieldStatus(field: string): string {
  const fieldIssues = issues.filter((item) => item.field === field);
  if (!fieldIssues.length) return '<span class="field-state good">Checked</span>';
  const error = fieldIssues.some((item) => item.severity === 'error');
  return `<span class="field-state ${error ? 'bad' : 'review'}">${error ? 'Fix needed' : 'Review'}</span>`;
}

function editor(): string {
  if (!recipe) return '';
  return `<div class="recipe-editor">
    <div class="field-grid">
      <label class="field full"><span>Title ${fieldStatus('title')}</span><input data-field="title" value="${escapeHtml(recipe.title)}" /></label>
      <label class="field full"><span>Description ${fieldStatus('description')}</span><textarea data-field="description" rows="2">${escapeHtml(recipe.description)}</textarea></label>
      <label class="field"><span>Servings ${fieldStatus('servings')}</span><input data-field="servings" value="${escapeHtml(recipe.servings)}" /></label>
      <label class="field"><span>Author ${fieldStatus('author')}</span><input data-field="author" value="${escapeHtml(recipe.author)}" /></label>
      <label class="field"><span>Prep time ${fieldStatus('prepTime')}</span><input data-field="prepTime" value="${escapeHtml(recipe.prepTime)}" /></label>
      <label class="field"><span>Cook time ${fieldStatus('cookTime')}</span><input data-field="cookTime" value="${escapeHtml(recipe.cookTime)}" /></label>
      <label class="field full"><span>Source URL ${fieldStatus('sourceUrl')}</span><input type="url" data-field="sourceUrl" value="${escapeHtml(recipe.sourceUrl)}" /></label>
    </div>
    <fieldset class="line-group"><legend>Ingredients <span>${recipe.ingredients.length} lines</span></legend>
      ${recipe.ingredients.map((item, index) => `<div class="line-field"><label for="ingredient-${index}"><span aria-hidden="true">${index + 1}</span><span class="sr-only">Ingredient ${index + 1}</span></label><input id="ingredient-${index}" data-field="ingredient-${index}" value="${escapeHtml(item.raw)}" aria-describedby="ingredient-${index}-state" /><div class="line-controls"><span id="ingredient-${index}-state">${fieldStatus(`ingredient-${index}`)}</span><button class="text-button remove-line" data-action="remove-ingredient" data-index="${index}" aria-label="Remove ingredient ${index + 1}">Remove</button></div></div>`).join('')}
      <button class="text-button add-line" data-action="add-ingredient">+ Add ingredient</button>
    </fieldset>
    <fieldset class="line-group"><legend>Steps <span>${recipe.steps.length} lines</span></legend>
      ${recipe.steps.map((step, index) => `<div class="line-field step-field"><label for="step-${index}"><span aria-hidden="true">${index + 1}</span><span class="sr-only">Step ${index + 1}</span></label><textarea id="step-${index}" data-field="step-${index}" rows="2" aria-describedby="step-${index}-state">${escapeHtml(step)}</textarea><div class="line-controls"><span id="step-${index}-state">${fieldStatus(`step-${index}`)}</span><button class="text-button remove-line" data-action="remove-step" data-index="${index}" aria-label="Remove step ${index + 1}">Remove</button></div></div>`).join('')}
      <button class="text-button add-line" data-action="add-step">+ Add step</button>
    </fieldset>
  </div>`;
}

function workbench(expanded: boolean): string {
  const availableRepairs = issues.filter((item) => item.repair).length;
  const panelHeading = expanded ? 'h2' : 'h3';
  return `<section class="workbench${expanded ? ' expanded' : ''}" aria-label="Recipe repair workbench">
    <div class="bench-toolbar">
      <div class="format-badge">${format ? `${format} source` : 'No file read'}</div>
      <div class="toolbar-actions">
        ${recipe ? `<button class="text-button" data-action="toggle-source">${showSource ? 'Hide source' : 'Show source'}</button>` : ''}
        <button class="text-button" data-action="clear" ${source || recipe ? '' : 'disabled'}>Clear recipe and results</button>
      </div>
    </div>
    ${notice ? `<div class="sr-only" aria-live="polite">${escapeHtml(notice)}</div>` : ''}
    <div class="bench-grid">
      <div class="source-panel">
        <div class="panel-heading"><div><p class="step-label">Input</p><${panelHeading}>Recipe source</${panelHeading}></div><label class="file-label file-picker">Choose file<input id="${expanded ? 'demo' : 'bench-home'}-file" class="file-input" type="file" accept=".json,.jsonld,.md,.markdown,text/markdown,application/json" /></label></div>
        <label class="source-label" for="source-text">Paste JSON, JSON-LD, or Markdown</label>
        <textarea id="source-text" class="source-text" rows="${expanded ? '15' : '10'}" spellcheck="false" placeholder="# Tomato beans&#10;&#10;## Ingredients&#10;- 2 cups beans&#10;&#10;## Steps&#10;1. Warm the beans.">${escapeHtml(source)}</textarea>
        <p class="input-help">Maximum file size: 2 MB. Source URLs are preserved and never opened.</p>
        <button class="button primary full-button" data-action="inspect">Inspect recipe</button>
        ${errorMessage ? `<div class="parse-error" role="alert"><strong>Source not read</strong><p>${escapeHtml(errorMessage)}</p></div>` : ''}
        ${showSource && recipe ? `<pre class="raw-source" tabindex="0"><code>${escapeHtml(source)}</code></pre>` : ''}
      </div>
      <div class="result-panel">
        <div class="panel-heading result-heading"><div><p class="step-label">Inspection</p><${panelHeading}>Parsed recipe</${panelHeading}></div>${recipe ? issueSummary() : ''}</div>
        ${recipe ? `<div class="issue-actions"><button class="button proof-button" data-action="apply-all" ${availableRepairs ? '' : 'disabled'}>Apply ${availableRepairs} suggested ${availableRepairs === 1 ? 'repair' : 'repairs'}</button><button class="button secondary" data-action="undo" ${editHistory.length ? '' : 'disabled'}>Undo last change</button></div>${issueList()}${editor()}<div class="export-strip"><div class="export-copy"><strong>Download repaired recipe</strong><label for="export-format">Export format</label><select id="export-format" data-export-format><option value="jsonld"${exportFormat === 'jsonld' ? ' selected' : ''}>Recipe JSON-LD (.json)</option><option value="original"${exportFormat === 'original' ? ' selected' : ''}>Repaired original format (${format})</option><option value="details"${exportFormat === 'details' ? ' selected' : ''}>Repair details (.json)</option></select><span>Recipe JSON-LD uses Schema.org Recipe fields. Repaired original keeps this file's ${format} format.</span>${canExport(recipe) ? '' : '<span>Fix blocking issues before export.</span>'}</div><button class="button export-button" data-action="export" ${canExport(recipe) ? '' : 'disabled'}>Download selected file</button></div>${repairLog.length ? `<details class="repair-log"><summary>Repair log (${repairLog.length})</summary><ol>${repairLog.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol></details>` : ''}` : `<div class="empty-sheet"><span aria-hidden="true">↳</span><h3>Your parsed fields will appear here</h3><p>Paste recipe text or choose a file. Then inspect it.</p></div>`}
      </div>
    </div>
  </section>`;
}

function privacyPage(): string {
  return `<main id="main" class="prose-page"><p class="eyebrow">Policy note</p><h1>Privacy in plain words</h1><p class="lede">Recipe Import Repair works without an account or a server upload.</p><section><h2>Your recipe files</h2><p>Your browser reads and repairs the text. The site does not send recipe text to us or another service.</p><h2>Browser storage</h2><p>Demo mode stores only its bundled sample in session storage under a <code>demo:</code> key. Starting normal work removes that demo key.</p><h2>Network requests</h2><p>The installed app shell can load from a local browser cache. The repair flow makes no third-party requests.</p><h2>Questions</h2><p>Open an issue in the product repository if this policy needs correction.</p></section></main>`;
}

function termsPage(): string {
  return `<main id="main" class="prose-page"><p class="eyebrow">Usage note</p><h1>Terms for this free tool</h1><p class="lede">Use Recipe Import Repair to inspect recipe files you have the right to use.</p><section><h2>No recipe collection service</h2><p>This tool does not fetch web pages. You choose every file and every repair.</p><h2>Your responsibility</h2><p>Review the exported file before importing it elsewhere. Keep a backup of the original file.</p><h2>No warranty</h2><p>The software is provided under the MIT License without warranty. These terms do not limit rights that local law gives you.</p><h2>Changes</h2><p>Material changes will appear here with a new version date. This version is dated August 28, 2026.</p></section></main>`;
}

function notFoundPage(): string {
  return `<main id="main" class="not-found"><div class="red-mark" aria-hidden="true">404</div><p class="eyebrow">Page status</p><h1>Page not found</h1><p>The address may be wrong, or the page may have moved.</p><a class="button primary" href="/" data-nav>Return to recipe repair</a></main>`;
}

function render(): void {
  updateMeta();
  const content = route === 'home' ? homePage() : route === 'demo' ? demoPage() : route === 'privacy' ? privacyPage() : route === 'terms' ? termsPage() : notFoundPage();
  app.innerHTML = `${header()}${content}${footer()}<div class="route-announcer sr-only" aria-live="polite">${escapeHtml(routeMeta(route).title)}</div>`;
}

function renderAndFocus(selector: string): void {
  render();
  requestAnimationFrame(() => document.querySelector<HTMLElement>(selector)?.focus());
}

function focusSelector(element: Element | null): string {
  if (!(element instanceof HTMLElement)) return '';
  if (element.id) return `#${CSS.escape(element.id)}`;
  const field = element.dataset.field;
  if (field) return `[data-field="${CSS.escape(field)}"]`;
  const action = element.dataset.action;
  if (action) return `[data-action="${CSS.escape(action)}"]`;
  return '';
}

function nextFocusableSelector(element: HTMLElement, backwards: boolean): string {
  const focusable = Array.from(app.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), summary')).filter((item) => item.tabIndex >= 0);
  const index = focusable.indexOf(element);
  if (index < 0) return '';
  return focusSelector(focusable[(index + (backwards ? -1 : 1) + focusable.length) % focusable.length]);
}

app.addEventListener('keydown', (event) => {
  const target = event.target;
  if (event.key === 'Tab' && target instanceof HTMLElement && target.dataset.field) {
    pendingFocusSelector = nextFocusableSelector(target, event.shiftKey);
  }
});

app.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const nav = target.closest<HTMLAnchorElement>('a[data-nav]');
  if (nav && nav.origin === window.location.origin) {
    event.preventDefault();
    navigate(`${nav.pathname}${nav.search}${nav.hash}`);
    return;
  }
  const repairButton = target.closest<HTMLButtonElement>('[data-repair]');
  if (repairButton) return applyRepair(repairButton.dataset.repair ?? '');
  const jump = target.closest<HTMLButtonElement>('[data-jump]');
  if (jump) {
    document.querySelector<HTMLElement>(`[data-field="${CSS.escape(jump.dataset.jump ?? '')}"]`)?.focus();
    return;
  }
  const button = target.closest<HTMLButtonElement>('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'inspect') {
    source = document.querySelector<HTMLTextAreaElement>('#source-text')?.value ?? '';
    parseCurrentSource();
    render();
  } else if (action === 'apply-all') applyAllRepairs();
  else if (action === 'undo') undoRepair();
  else if (action === 'export') exportRecipe();
  else if (action === 'toggle-source') { showSource = !showSource; render(); }
  else if (action === 'reset-demo') { resetDemo(); notice = 'Demo reset to the original sample.'; render(); }
  else if (action === 'clear') {
    source = ''; recipe = null; format = null; issues = []; errorMessage = ''; editHistory = []; repairLog = []; notice = 'Recipe and results cleared.'; render();
  } else if (action === 'remove-ingredient') removeIngredient(Number(button.dataset.index));
  else if (action === 'remove-step') removeStep(Number(button.dataset.index));
  else if (action === 'add-ingredient' && recipe) {
    saveSnapshot('Add ingredient');
    recipe.ingredients.push(parseIngredient('', recipe.ingredients.length));
    refreshIssues(); render();
    requestAnimationFrame(() => document.querySelector<HTMLInputElement>(`#ingredient-${recipe!.ingredients.length - 1}`)?.focus());
  } else if (action === 'add-step' && recipe) {
    saveSnapshot('Add step'); recipe.steps.push(''); refreshIssues(); render();
    requestAnimationFrame(() => document.querySelector<HTMLTextAreaElement>(`#step-${recipe!.steps.length - 1}`)?.focus());
  }
});

app.addEventListener('change', async (event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  if (target instanceof HTMLSelectElement && target.dataset.exportFormat !== undefined) {
    exportFormat = target.value as typeof exportFormat;
    return;
  }
  if (target.type === 'file' && target instanceof HTMLInputElement && target.files?.[0]) {
    const file = target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      errorMessage = 'The file is larger than 2 MB. Choose a smaller recipe file.';
      render(); return;
    }
    source = await file.text();
    if (route === 'home' && target.id === 'home-file' && !document.querySelector('.workbench')) return;
    parseCurrentSource(); render(); return;
  }
  const field = target.dataset.field;
  if (field && recipe) {
    const focusAfterEdit = pendingFocusSelector || focusSelector(document.activeElement) || focusSelector(target);
    pendingFocusSelector = '';
    saveSnapshot(`Edit ${field.replace(/-/g, ' ')}`);
    updateRecipeField(field, target.value);
    notice = `${field.replace(/-/g, ' ')} updated.`;
    renderAndFocus(focusAfterEdit);
  }
});

window.addEventListener('popstate', () => changeRoute('pop'));
window.addEventListener('online', () => { isOffline = false; render(); });
window.addEventListener('offline', () => { isOffline = true; render(); });

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/service-worker.js').catch(() => undefined));
}

render();
