export type TransformId = 'copy' | 'trim' | 'date-iso' | 'currency' | 'integer' | 'id-upper' | 'lowercase';
export type ValidationId = 'none' | 'required' | 'email' | 'iso-date' | 'number' | 'whole-number';

export interface CsvData {
  name: string;
  headers: string[];
  rows: string[][];
  warnings: string[];
}

export interface FieldMapping {
  target: string;
  source: string;
  transform: TransformId;
  validation: ValidationId;
  required: boolean;
  defaultValue: string;
}

export interface Recipe {
  kind: 'csv-import-cleanroom-recipe';
  version: 1;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  targetHeaders: string[];
  mappings: FieldMapping[];
}

export interface RowResult {
  sourceRow: number;
  values: string[];
  errors: string[];
  lossy: string[];
  formulaFields: string[];
}

export interface RunResult {
  accepted: RowResult[];
  rejected: RowResult[];
  all: RowResult[];
  lossyCount: number;
  formulaCount: number;
}
