export type InputFormat = 'JSON' | 'JSON-LD' | 'Markdown';
export type Severity = 'error' | 'warning';

export interface Ingredient {
  id: string;
  raw: string;
  quantity: string;
  unit: string;
  item: string;
}

export interface Recipe {
  title: string;
  description: string;
  servings: string;
  prepTime: string;
  cookTime: string;
  sourceUrl: string;
  author: string;
  ingredients: Ingredient[];
  steps: string[];
}

export interface Issue {
  id: string;
  severity: Severity;
  field: string;
  message: string;
  next: string;
  repair?: Repair;
}

export interface Repair {
  id: string;
  label: string;
  field: string;
  before: string;
  after: string;
  apply: (recipe: Recipe) => void;
}

export interface ParseResult {
  format: InputFormat;
  recipe: Recipe;
  issues: Issue[];
}

export interface NeutralBundle {
  schemaVersion: '1.0';
  exportedAt: string;
  recipe: Omit<Recipe, 'ingredients'> & { ingredients: Array<Omit<Ingredient, 'id'>> };
  attribution: { sourceUrl: string; author: string };
}

export interface ExportedRecipeFile {
  content: string;
  extension: 'json' | 'md';
  mimeType: 'application/ld+json' | 'application/json' | 'text/markdown';
  suffix: 'recipe-jsonld' | 'repaired-json' | 'repaired-jsonld' | 'repaired-markdown' | 'repair-details';
}

const canonicalUnits: Record<string, string> = {
  tablespoon: 'tbsp', tablespoons: 'tbsp', tbsp: 'tbsp', tbs: 'tbsp',
  teaspoon: 'tsp', teaspoons: 'tsp', tsp: 'tsp',
  cup: 'cup', cups: 'cup', c: 'cup',
  gram: 'g', grams: 'g', g: 'g',
  kilogram: 'kg', kilograms: 'kg', kg: 'kg',
  milliliter: 'ml', milliliters: 'ml', millilitre: 'ml', millilitres: 'ml', ml: 'ml',
  liter: 'l', liters: 'l', litre: 'l', litres: 'l', l: 'l',
  ounce: 'oz', ounces: 'oz', oz: 'oz',
  pound: 'lb', pounds: 'lb', lbs: 'lb', lb: 'lb',
  pinch: 'pinch', pinches: 'pinch',
  clove: 'clove', cloves: 'clove',
  can: 'can', cans: 'can',
  package: 'package', packages: 'package',
  slice: 'slice', slices: 'slice',
};

const verboseUnits = new Set([
  'tablespoon', 'tablespoons', 'teaspoon', 'teaspoons', 'gram', 'grams', 'kilogram', 'kilograms',
  'milliliter', 'milliliters', 'millilitre', 'millilitres', 'liter', 'liters', 'litre', 'litres',
  'ounce', 'ounces', 'pound', 'pounds',
]);

const fractions: Record<string, string> = {
  '¼': '1/4', '½': '1/2', '¾': '3/4', '⅐': '1/7', '⅑': '1/9', '⅒': '1/10',
  '⅓': '1/3', '⅔': '2/3', '⅕': '1/5', '⅖': '2/5', '⅗': '3/5', '⅘': '4/5',
  '⅙': '1/6', '⅚': '5/6', '⅛': '1/8', '⅜': '3/8', '⅝': '5/8', '⅞': '7/8',
};

const makeId = (prefix: string, index: number) => `${prefix}-${index + 1}`;

export function normalizeFractions(value: string): string {
  return value.replace(/(\d)([¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])/g, '$1 $2')
    .replace(/[¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/g, (match) => fractions[match]);
}

function readText(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  if (value && typeof value === 'object') {
    const object = value as Record<string, unknown>;
    return readText(object.raw ?? object.text ?? object.name);
  }
  return '';
}

function readSteps(value: unknown): string[] {
  if (typeof value === 'string') return value.split(/\n+/).map((line) => line.replace(/^\s*\d+[.)]\s*/, '').trim()).filter(Boolean);
  if (!Array.isArray(value)) return [];
  const steps: string[] = [];
  value.forEach((entry) => {
    if (typeof entry === 'string') steps.push(entry.trim());
    else if (entry && typeof entry === 'object') {
      const object = entry as Record<string, unknown>;
      if (Array.isArray(object.itemListElement)) steps.push(...readSteps(object.itemListElement));
      else {
        const text = readText(object.text ?? object.name);
        if (text) steps.push(text);
      }
    }
  });
  return steps.filter(Boolean);
}

function findRecipeNode(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object') throw new Error('The JSON root must be an object.');
  const object = value as Record<string, unknown>;
  const graph = Array.isArray(object['@graph']) ? object['@graph'] : [];
  const candidates = [object, ...graph].filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === 'object'));
  const recipe = candidates.find((entry) => {
    const type = entry['@type'];
    return type === 'Recipe' || (Array.isArray(type) && type.includes('Recipe'));
  });
  if (recipe) return recipe;
  if (object.recipe && typeof object.recipe === 'object' && !Array.isArray(object.recipe)) {
    return object.recipe as Record<string, unknown>;
  }
  return object;
}

function parseJson(source: string): { format: InputFormat; recipe: Recipe } {
  let value: unknown;
  try {
    value = JSON.parse(source);
  } catch {
    throw new Error('The JSON has invalid punctuation. Check its commas, quotes, and brackets, then inspect it again.');
  }
  const node = findRecipeNode(value);
  const ingredientsValue = node.recipeIngredient ?? node.ingredients ?? [];
  const ingredientLines = Array.isArray(ingredientsValue)
    ? ingredientsValue.map(readText)
    : typeof ingredientsValue === 'string'
      ? ingredientsValue.split(/\n+/)
      : [];
  const type = node['@type'];
  const isJsonLd = Boolean(node['@context']) || type === 'Recipe' || (Array.isArray(type) && type.includes('Recipe'));
  return {
    format: isJsonLd ? 'JSON-LD' : 'JSON',
    recipe: {
      title: readText(node.name ?? node.title),
      description: readText(node.description),
      servings: readText(node.recipeYield ?? node.servings),
      prepTime: readText(node.prepTime),
      cookTime: readText(node.cookTime),
      sourceUrl: readText(node.url ?? node.sourceUrl ?? node.source),
      author: readText(node.author),
      ingredients: ingredientLines.filter(Boolean).map(parseIngredient),
      steps: readSteps(node.recipeInstructions ?? node.instructions ?? node.steps),
    },
  };
}

function parseMarkdown(source: string): { format: InputFormat; recipe: Recipe } {
  const lines = source.replace(/\r/g, '').split('\n');
  let section = '';
  let title = '';
  let description = '';
  let sourceUrl = '';
  let author = '';
  let servings = '';
  let prepTime = '';
  let cookTime = '';
  const ingredients: string[] = [];
  const steps: string[] = [];
  const intro: string[] = [];

  for (const original of lines) {
    const line = original.trim();
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const value = heading[2].trim();
      if (!title && heading[1].length === 1) title = value;
      section = value.toLowerCase();
      continue;
    }
    const meta = line.match(/^\*{0,2}(source|author|servings?|prep(?: time)?|cook(?: time)?)\*{0,2}\s*:\s*(.+)$/i);
    if (meta) {
      const key = meta[1].toLowerCase();
      const value = meta[2].trim().replace(/^<|>$/g, '');
      if (key === 'source') sourceUrl = value;
      else if (key === 'author') author = value;
      else if (key.startsWith('serving')) servings = value;
      else if (key.startsWith('prep')) prepTime = value;
      else cookTime = value;
      continue;
    }
    if (!line) continue;
    if (/ingredient/i.test(section) && /^[-*+]\s+/.test(line)) ingredients.push(line.replace(/^[-*+]\s+/, ''));
    else if (/(instruction|direction|method|step)/i.test(section) && /^(?:[-*+]\s+|\d+[.)]\s+)/.test(line)) {
      steps.push(line.replace(/^(?:[-*+]\s+|\d+[.)]\s+)/, ''));
    } else if (title && !section.includes('ingredient') && !/(instruction|direction|method|step)/i.test(section)) intro.push(line);
  }

  if (!title && !ingredients.length && !steps.length) {
    throw new Error('No recipe sections were found. Add a title, an Ingredients heading, and a Steps heading.');
  }
  description = intro.join(' ').trim();
  return {
    format: 'Markdown',
    recipe: {
      title, description, servings, prepTime, cookTime, sourceUrl, author,
      ingredients: ingredients.map(parseIngredient), steps,
    },
  };
}

export function parseIngredient(rawValue: string, index = 0): Ingredient {
  const raw = rawValue.trim();
  const match = raw.match(/^([^\s]+(?:\s+\d+\/\d+)?)\s+([^\s]+)\s+(.+)$/);
  if (!match) return { id: makeId('ingredient', index), raw, quantity: '', unit: '', item: raw };
  const [, quantity, unit, item] = match;
  const looksLikeQuantity = /^(?:\d+(?:[.,]\d+)?|\d+\/\d+|\d+\s+\d+\/\d+|[¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]|\d+[¼½¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])$/.test(quantity);
  if (!looksLikeQuantity) return { id: makeId('ingredient', index), raw, quantity: '', unit: '', item: raw };
  return { id: makeId('ingredient', index), raw, quantity, unit, item };
}

function issue(id: string, severity: Severity, field: string, message: string, next: string, repair?: Repair): Issue {
  return { id, severity, field, message, next, repair };
}

export function inspectRecipe(recipe: Recipe): Issue[] {
  const issues: Issue[] = [];
  if (!recipe.title.trim()) issues.push(issue('missing-title', 'error', 'title', 'The recipe has no title.', 'Enter a title before export.'));
  if (recipe.title.length > 120) issues.push(issue('long-title', 'warning', 'title', `The title has ${recipe.title.length} characters.`, 'Shorten it to 120 characters or fewer.'));
  if (!recipe.ingredients.length) issues.push(issue('missing-ingredients', 'error', 'ingredients', 'No ingredients were found.', 'Add at least one ingredient.'));
  if (!recipe.steps.length) issues.push(issue('missing-steps', 'error', 'steps', 'No steps were found.', 'Add at least one step.'));
  if (recipe.sourceUrl) {
    try {
      const url = new URL(recipe.sourceUrl);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    } catch {
      issues.push(issue('bad-source', 'error', 'sourceUrl', 'The source URL is not valid.', 'Enter a full source URL starting with http:// or https://.'));
    }
  }

  recipe.ingredients.forEach((ingredient, index) => {
    const field = `ingredient-${index}`;
    if (!ingredient.raw.trim()) {
      issues.push(issue(`empty-${field}`, 'error', field, `Ingredient ${index + 1} is empty.`, 'Write the ingredient or remove this line.'));
      return;
    }
    if (ingredient.raw.length > 220) issues.push(issue(`long-${field}`, 'warning', field, `Ingredient ${index + 1} has ${ingredient.raw.length} characters.`, 'Shorten it to 220 characters or fewer.'));
    if (/^\d+\.\.\d+/.test(ingredient.raw)) {
      const decimalFixed = ingredient.raw.replace(/^(\d+)\.\.(\d+)/, '$1.$2');
      const parsedFixed = parseIngredient(decimalFixed, index);
      const fixedUnit = canonicalUnits[parsedFixed.unit.toLowerCase()];
      const after = fixedUnit && verboseUnits.has(parsedFixed.unit.toLowerCase())
        ? [parsedFixed.quantity, fixedUnit, parsedFixed.item].join(' ')
        : decimalFixed;
      issues.push(issue(`decimal-${field}`, 'error', field, `Ingredient ${index + 1} starts with a malformed decimal.`, 'Replace the double dot with one decimal point.', {
        id: `decimal-${field}`, label: 'Fix decimal point', field, before: ingredient.raw, after,
        apply: (target) => { target.ingredients[index] = parseIngredient(after, index); },
      }));
      return;
    }
    if (/[¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/.test(ingredient.raw)) {
      const after = normalizeFractions(ingredient.raw);
      issues.push(issue(`fraction-${field}`, 'warning', field, `Ingredient ${index + 1} uses a Unicode fraction.`, 'Convert it to a portable slash fraction.', {
        id: `fraction-${field}`, label: 'Convert fraction', field, before: ingredient.raw, after,
        apply: (target) => { target.ingredients[index] = parseIngredient(after, index); },
      }));
    }
    const parsed = parseIngredient(ingredient.raw, index);
    if (!parsed.quantity && /^\d/.test(ingredient.raw)) {
      issues.push(issue(`quantity-${field}`, 'error', field, `Ingredient ${index + 1} has a quantity that could not be split.`, 'Edit the line to use a number, unit, then ingredient.'));
    } else if (parsed.unit) {
      const unitKey = parsed.unit.toLowerCase().replace(/[.,]$/, '');
      const canonical = canonicalUnits[unitKey];
      if (canonical && canonical !== parsed.unit && verboseUnits.has(unitKey)) {
        const after = [parsed.quantity, canonical, parsed.item].filter(Boolean).join(' ');
        issues.push(issue(`unit-${field}`, 'warning', field, `Ingredient ${index + 1} uses “${parsed.unit}”.`, `Change the unit to “${canonical}”.`, {
          id: `unit-${field}`, label: `Use ${canonical}`, field, before: ingredient.raw, after,
          apply: (target) => { target.ingredients[index] = parseIngredient(after, index); },
        }));
      }
    }
  });

  recipe.steps.forEach((step, index) => {
    if (!step.trim()) issues.push(issue(`empty-step-${index}`, 'error', `step-${index}`, `Step ${index + 1} is empty.`, 'Write the step or remove it.'));
    if (step.length > 1000) issues.push(issue(`long-step-${index}`, 'warning', `step-${index}`, `Step ${index + 1} has ${step.length} characters.`, 'Split it into shorter steps.'));
  });
  return issues;
}

export function parseRecipe(source: string): ParseResult {
  const trimmed = source.trim();
  if (!trimmed) throw new Error('Nothing was added. Paste recipe text or choose a file first.');
  const parsed = /^[\[{]/.test(trimmed) ? parseJson(trimmed) : parseMarkdown(trimmed);
  parsed.recipe.ingredients = parsed.recipe.ingredients.map((ingredient, index) => ({ ...ingredient, id: makeId('ingredient', index) }));
  return { ...parsed, issues: inspectRecipe(parsed.recipe) };
}

export function cloneRecipe(recipe: Recipe): Recipe {
  return structuredClone(recipe);
}

export function createNeutralBundle(recipe: Recipe, exportedAt = new Date().toISOString()): NeutralBundle {
  const cleanRecipe = cloneRecipe(recipe);
  const ingredients = cleanRecipe.ingredients.map(({ id: _id, ...ingredient }) => ingredient);
  return {
    schemaVersion: '1.0',
    exportedAt,
    recipe: { ...cleanRecipe, ingredients },
    attribution: { sourceUrl: recipe.sourceUrl, author: recipe.author },
  };
}

function jsonText(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function createJsonLd(recipe: Recipe): Record<string, unknown> {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    recipeIngredient: recipe.ingredients.map((ingredient) => ingredient.raw),
    recipeInstructions: recipe.steps.map((step) => ({ '@type': 'HowToStep', text: step })),
  };
  if (recipe.description) jsonLd.description = recipe.description;
  if (recipe.author) jsonLd.author = recipe.author;
  if (recipe.sourceUrl) jsonLd.url = recipe.sourceUrl;
  if (recipe.servings) jsonLd.recipeYield = recipe.servings;
  if (recipe.prepTime) jsonLd.prepTime = recipe.prepTime;
  if (recipe.cookTime) jsonLd.cookTime = recipe.cookTime;
  return jsonLd;
}

function createPlainJson(recipe: Recipe): Record<string, unknown> {
  return {
    title: recipe.title,
    description: recipe.description,
    servings: recipe.servings,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    sourceUrl: recipe.sourceUrl,
    author: recipe.author,
    ingredients: recipe.ingredients.map((ingredient) => ingredient.raw),
    steps: [...recipe.steps],
  };
}

function createMarkdown(recipe: Recipe): string {
  const metadata = [
    recipe.sourceUrl ? `Source: ${recipe.sourceUrl}` : '',
    recipe.author ? `Author: ${recipe.author}` : '',
    recipe.servings ? `Servings: ${recipe.servings}` : '',
    recipe.prepTime ? `Prep time: ${recipe.prepTime}` : '',
    recipe.cookTime ? `Cook time: ${recipe.cookTime}` : '',
  ].filter(Boolean);
  return [
    `# ${recipe.title}`,
    recipe.description,
    ...metadata,
    '## Ingredients',
    ...recipe.ingredients.map((ingredient) => `- ${ingredient.raw}`),
    '## Steps',
    ...recipe.steps.map((step, index) => `${index + 1}. ${step}`),
  ].filter((line, index, lines) => line || (index > 0 && lines[index - 1] !== '')).join('\n\n').replace(/\n{3,}/g, '\n\n') + '\n';
}

export function createExportFile(recipe: Recipe, exportFormat: 'jsonld' | 'original' | 'details', inputFormat: InputFormat): ExportedRecipeFile {
  if (exportFormat === 'jsonld') {
    return { content: jsonText(createJsonLd(recipe)), extension: 'json', mimeType: 'application/ld+json', suffix: 'recipe-jsonld' };
  }
  if (exportFormat === 'details') {
    return { content: jsonText(createNeutralBundle(recipe)), extension: 'json', mimeType: 'application/json', suffix: 'repair-details' };
  }
  if (inputFormat === 'Markdown') {
    return { content: createMarkdown(recipe), extension: 'md', mimeType: 'text/markdown', suffix: 'repaired-markdown' };
  }
  if (inputFormat === 'JSON-LD') {
    return { content: jsonText(createJsonLd(recipe)), extension: 'json', mimeType: 'application/ld+json', suffix: 'repaired-jsonld' };
  }
  return { content: jsonText(createPlainJson(recipe)), extension: 'json', mimeType: 'application/json', suffix: 'repaired-json' };
}

export function canExport(recipe: Recipe): boolean {
  return !inspectRecipe(recipe).some((item) => item.severity === 'error');
}
