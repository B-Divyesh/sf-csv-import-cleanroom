import { isFormulaRisk } from './csv';
import type { FieldMapping, Recipe, RowResult, RunResult, TransformId, ValidationId } from './types';

export const TRANSFORMS: { id: TransformId; label: string; lossy: boolean }[] = [
  { id: 'copy', label: 'Copy exactly', lossy: false },
  { id: 'trim', label: 'Trim outer spaces', lossy: true },
  { id: 'date-iso', label: 'Date D/M/Y → YYYY-MM-DD', lossy: true },
  { id: 'currency', label: 'Currency → decimal', lossy: true },
  { id: 'integer', label: 'Round to whole number', lossy: true },
  { id: 'id-upper', label: 'ID: trim + UPPERCASE', lossy: true },
  { id: 'lowercase', label: 'lowercase', lossy: true }
];

export const VALIDATIONS: { id: ValidationId; label: string }[] = [
  { id: 'none', label: 'No format rule' },
  { id: 'required', label: 'Must have a value' },
  { id: 'email', label: 'Email address' },
  { id: 'iso-date', label: 'ISO date (YYYY-MM-DD)' },
  { id: 'number', label: 'Number' },
  { id: 'whole-number', label: 'Whole number' }
];

export function blankMappings(targetHeaders: string[]): FieldMapping[] {
  return targetHeaders.map(target => ({ target, source: '', transform: 'copy', validation: 'none', required: false, defaultValue: '' }));
}

export function applyTransform(value: string, transform: TransformId): string {
  if (value === '') return '';
  switch (transform) {
    case 'copy': return value;
    case 'trim': return value.trim();
    case 'lowercase': return value.trim().toLowerCase();
    case 'id-upper': return value.trim().toUpperCase();
    case 'currency': {
      const negative = /^\s*\(.*\)\s*$/.test(value);
      const cleaned = value.replace(/[,$£€¥\s()]/g, '');
      const number = Number(cleaned);
      return Number.isFinite(number) ? `${negative ? -Math.abs(number) : number}` : value.trim();
    }
    case 'integer': {
      const number = Number(value.replaceAll(',', '').trim());
      return Number.isFinite(number) ? `${Math.round(number)}` : value.trim();
    }
    case 'date-iso': return normalizeDate(value);
  }
}

function normalizeDate(value: string): string {
  const trimmed = value.trim();
  const iso = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(trimmed);
  if (iso) return validDate(Number(iso[1]), Number(iso[2]), Number(iso[3])) ?? trimmed;
  const dayFirst = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/.exec(trimmed);
  if (dayFirst) return validDate(Number(dayFirst[3]), Number(dayFirst[2]), Number(dayFirst[1])) ?? trimmed;
  const timestamp = Date.parse(trimmed);
  if (!Number.isNaN(timestamp) && /[A-Za-z]/.test(trimmed)) return new Date(timestamp).toISOString().slice(0, 10);
  return trimmed;
}

function validDate(year: number, month: number, day: number): string | null {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

function validationError(value: string, rule: ValidationId, required: boolean): string | null {
  if (value === '') return required || rule === 'required' ? 'is required but empty' : null;
  if (rule === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'is not a valid email address';
  if (rule === 'iso-date' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'is not an ISO date (YYYY-MM-DD)';
  if (rule === 'number' && !Number.isFinite(Number(value))) return 'is not a number';
  if (rule === 'whole-number' && !/^-?\d+$/.test(value)) return 'is not a whole number';
  return null;
}

export function runRecipe(headers: string[], rows: string[][], mappings: FieldMapping[]): RunResult {
  const all: RowResult[] = rows.map((row, rowIndex) => {
    const errors: string[] = [];
    const lossy: string[] = [];
    const formulaFields: string[] = [];
    const values = mappings.map(mapping => {
      const sourceIndex = headers.indexOf(mapping.source);
      const original = sourceIndex >= 0 ? row[sourceIndex] ?? '' : '';
      const starting = original === '' ? mapping.defaultValue : original;
      const transformed = applyTransform(starting, mapping.transform);
      if (starting !== transformed) lossy.push(`${mapping.target}: “${starting}” → “${transformed}”`);
      if (isFormulaRisk(transformed)) formulaFields.push(mapping.target);
      if (!mapping.source && !mapping.defaultValue && (mapping.required || mapping.validation === 'required')) errors.push(`${mapping.target} has no source or default value`);
      const invalid = validationError(transformed, mapping.validation, mapping.required);
      if (invalid) errors.push(`${mapping.target} ${invalid}`);
      return transformed;
    });
    return { sourceRow: rowIndex + 2, values, errors: [...new Set(errors)], lossy, formulaFields };
  });
  return {
    all,
    accepted: all.filter(row => row.errors.length === 0),
    rejected: all.filter(row => row.errors.length > 0),
    lossyCount: all.reduce((sum, row) => sum + row.lossy.length, 0),
    formulaCount: all.reduce((sum, row) => sum + row.formulaFields.length, 0)
  };
}

export function makeRecipe(name: string, mappings: FieldMapping[]): Recipe {
  const now = new Date().toISOString();
  return { kind: 'csv-import-cleanroom-recipe', version: 1, id: crypto.randomUUID(), name, createdAt: now, updatedAt: now, targetHeaders: mappings.map(item => item.target), mappings: structuredClone(mappings) };
}

export function validateRecipe(value: unknown): Recipe {
  if (!value || typeof value !== 'object') throw new Error('That JSON file does not contain a recipe.');
  const recipe = value as Partial<Recipe>;
  if (recipe.kind !== 'csv-import-cleanroom-recipe' || recipe.version !== 1 || !Array.isArray(recipe.mappings) || !Array.isArray(recipe.targetHeaders)) throw new Error('This is not a Cleanroom v1 recipe.');
  if (recipe.mappings.length !== recipe.targetHeaders.length || recipe.mappings.some((mapping, index) => !mapping || mapping.target !== recipe.targetHeaders?.[index])) throw new Error('The recipe target columns are incomplete or out of order.');
  return recipe as Recipe;
}
