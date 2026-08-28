import type { CsvData } from './types';

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_ROWS = 50_000;

export function parseCsv(text: string, name = 'Untitled.csv'): CsvData {
  const input = text.replace(/^\uFEFF/, '');
  const records: string[][] = [];
  let record: string[] = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (quoted) {
      if (char === '"' && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"' && field === '') quoted = true;
    else if (char === ',') {
      record.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && input[index + 1] === '\n') index += 1;
      record.push(field);
      records.push(record);
      record = [];
      field = '';
    } else field += char;
  }
  if (quoted) throw new Error('A quoted field is not closed. Check the final rows of the file.');
  if (field !== '' || record.length > 0) {
    record.push(field);
    records.push(record);
  }
  while (records.length > 0 && records.at(-1)?.every(value => value === '')) records.pop();
  if (records.length === 0) throw new Error('This file is empty. Choose a CSV with a header row.');

  const headers = records[0]!.map(value => value.trim());
  if (headers.some(header => header === '')) throw new Error('Every target and source column needs a name in the first row.');
  const duplicate = headers.find((header, index) => headers.indexOf(header) !== index);
  if (duplicate) throw new Error(`The header “${duplicate}” appears more than once. Rename duplicate columns first.`);
  const sourceRows = records.slice(1);
  if (sourceRows.length > MAX_ROWS) throw new Error(`This file has ${sourceRows.length.toLocaleString()} rows. The local limit is ${MAX_ROWS.toLocaleString()}.`);
  const warnings: string[] = [];
  const rows = sourceRows.map((row, index) => {
    if (row.length !== headers.length && warnings.length < 3) warnings.push(`Row ${index + 2} has ${row.length} fields; the header has ${headers.length}.`);
    return headers.map((_, column) => row[column] ?? '');
  });
  return { name, headers, rows, warnings };
}

export function guardFile(file: File): void {
  if (file.size > MAX_FILE_BYTES) throw new Error(`“${file.name}” is larger than the 10 MB local limit.`);
  if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') throw new Error('Choose a .csv file. Spreadsheet .xlsx files are not supported.');
}

export function safeCell(value: string): string {
  return isFormulaRisk(value) ? `'${value}` : value;
}

function quoteCell(value: string): string {
  const safe = safeCell(value);
  return /[",\r\n]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
}

export function serializeCsv(headers: string[], rows: string[][]): string {
  return [headers, ...rows].map(row => row.map(quoteCell).join(',')).join('\r\n');
}

export function isFormulaRisk(value: string): boolean {
  const trimmed = value.trimStart();
  if (/^-\d+(?:\.\d+)?$/.test(trimmed)) return false;
  return /^[=+@]/.test(trimmed) || /^-/.test(trimmed);
}
