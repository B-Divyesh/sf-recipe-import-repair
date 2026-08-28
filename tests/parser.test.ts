import { describe, expect, it } from 'vitest';
import { canExport, createNeutralBundle, inspectRecipe, parseRecipe } from '../src/parser';

describe('recipe parser', () => {
  it('reads JSON-LD recipes and nested HowToStep values', () => {
    const result = parseRecipe(JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Soup',
      recipeIngredient: ['2 cups beans'],
      recipeInstructions: [{ '@type': 'HowToSection', itemListElement: [{ '@type': 'HowToStep', text: 'Warm the beans.' }] }],
    }));
    expect(result.format).toBe('JSON-LD');
    expect(result.recipe.steps).toEqual(['Warm the beans.']);
  });

  it('reads Markdown sections and attribution', () => {
    const result = parseRecipe(`# Tomato beans

Source: https://example.com/beans
Author: Mara Vale

## Ingredients
- 2 cups beans
- 1 tbsp oil

## Steps
1. Warm the beans.
2. Add the oil.`);
    expect(result.format).toBe('Markdown');
    expect(result.recipe.title).toBe('Tomato beans');
    expect(result.recipe.ingredients).toHaveLength(2);
    expect(result.recipe.sourceUrl).toBe('https://example.com/beans');
  });

  it('reports malformed JSON with a next step', () => {
    expect(() => parseRecipe('{"name": }')).toThrow(/could not be read.*Fix the marked punctuation/i);
  });

  it('finds repairable fractions, decimals, and verbose units', () => {
    const result = parseRecipe(JSON.stringify({
      title: 'Beans',
      ingredients: ['1½ cups beans', '2..5 tablespoons oil', '3 teaspoons paste'],
      steps: ['Cook.'],
    }));
    expect(result.issues.flatMap((item) => item.repair?.label ?? [])).toEqual([
      'Convert fraction', 'Fix decimal point', 'Use tsp',
    ]);
  });

  it('blocks exports with errors and preserves attribution in a neutral bundle', () => {
    const result = parseRecipe(JSON.stringify({
      title: 'Beans', sourceUrl: 'https://example.com/beans', author: 'Mara Vale', ingredients: ['1 cup beans'], steps: ['Cook.'],
    }));
    expect(canExport(result.recipe)).toBe(true);
    const bundle = createNeutralBundle(result.recipe, '2026-08-28T00:00:00.000Z');
    expect(bundle.attribution).toEqual({ sourceUrl: 'https://example.com/beans', author: 'Mara Vale' });
    expect(bundle.recipe.ingredients[0]).not.toHaveProperty('id');
    result.recipe.sourceUrl = 'not a url';
    expect(inspectRecipe(result.recipe).some((item) => item.id === 'bad-source')).toBe(true);
    expect(canExport(result.recipe)).toBe(false);
  });

  it('blocks whitespace-only titles and empty ingredient records', () => {
    const result = parseRecipe(JSON.stringify({
      title: 'Valid recipe', ingredients: ['1 cup rice'], steps: ['Cook.'],
    }));
    result.recipe.title = '   ';
    result.recipe.ingredients[0] = { id: 'ingredient-1', raw: '', quantity: '', unit: '', item: '' };
    const diagnostics = inspectRecipe(result.recipe);
    expect(diagnostics.map((item) => item.id)).toContain('missing-title');
    expect(diagnostics.map((item) => item.id)).toContain('empty-ingredient-0');
    expect(canExport(result.recipe)).toBe(false);
  });
});
