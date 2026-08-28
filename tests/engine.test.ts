import { describe, expect, it } from 'vitest';
import { applyTransform, runRecipe, validateRecipe } from '../src/engine';
import type { FieldMapping } from '../src/types';

describe('transforms and validation', () => {
  it('normalizes dates, currency, integer, and IDs explicitly', () => {
    expect(applyTransform('31/01/2026', 'date-iso')).toBe('2026-01-31');
    expect(applyTransform('2026.2.8', 'date-iso')).toBe('2026-02-08');
    expect(applyTransform('(€1,240.50)', 'currency')).toBe('-1240.5');
    expect(applyTransform('12.6', 'integer')).toBe('13');
    expect(applyTransform(' ac-2 ', 'id-upper')).toBe('AC-2');
    expect(applyTransform('31/02/2026', 'date-iso')).toBe('31/02/2026');
  });

  it('separates accepted and rejected rows with target-language reasons', () => {
    const mappings: FieldMapping[] = [
      { target: 'external_id', source: 'ID', transform: 'id-upper', validation: 'required', required: true, defaultValue: '' },
      { target: 'email', source: 'Email', transform: 'lowercase', validation: 'email', required: true, defaultValue: '' },
      { target: 'amount', source: 'Cost', transform: 'currency', validation: 'number', required: false, defaultValue: '0' }
    ];
    const result = runRecipe(['ID', 'Email', 'Cost'], [[' a-1 ', 'ADA@EXAMPLE.COM', '$12.00'], ['', 'wrong', 'free']], mappings);
    expect(result.accepted).toHaveLength(1);
    expect(result.accepted[0]?.values).toEqual(['A-1', 'ada@example.com', '12']);
    expect(result.rejected[0]?.errors).toEqual(expect.arrayContaining(['external_id is required but empty', 'email is not a valid email address', 'amount is not a number']));
    expect(result.lossyCount).toBeGreaterThan(0);
  });

  it('detects formula-risk fields before safe export', () => {
    const mappings: FieldMapping[] = [{ target: 'external_id', source: 'ID', transform: 'copy', validation: 'none', required: false, defaultValue: '' }];
    expect(runRecipe(['ID'], [['=2+2']], mappings).formulaCount).toBe(1);
  });
});

describe('recipe validation', () => {
  it('accepts only a complete versioned Cleanroom recipe', () => {
    const recipe = { kind: 'csv-import-cleanroom-recipe', version: 1, id: '1', name: 'x', createdAt: '', updatedAt: '', targetHeaders: ['name'], mappings: [{ target: 'name' }] };
    expect(validateRecipe(recipe).name).toBe('x');
    expect(() => validateRecipe({ ...recipe, version: 2 })).toThrow(/not a Cleanroom v1/);
    expect(() => validateRecipe({ ...recipe, targetHeaders: ['other'] })).toThrow(/incomplete/);
  });
});
