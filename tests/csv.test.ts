import { describe, expect, it } from 'vitest';
import { parseCsv, safeCell, serializeCsv } from '../src/csv';

describe('CSV parser', () => {
  it('handles quoted commas, newlines, escaped quotes, and CRLF', () => {
    const parsed = parseCsv('name,note\r\n"Ada, A.","line 1\nline 2"\r\nSam,"said ""hello"""\r\n');
    expect(parsed.headers).toEqual(['name', 'note']);
    expect(parsed.rows).toEqual([['Ada, A.', 'line 1\nline 2'], ['Sam', 'said "hello"']]);
  });

  it('rejects malformed and duplicate headers', () => {
    expect(() => parseCsv('name,name\na,b')).toThrow(/more than once/);
    expect(() => parseCsv('name,\na,b')).toThrow(/needs a name/);
    expect(() => parseCsv('name\n"unfinished')).toThrow(/not closed/);
  });

  it('neutralizes spreadsheet formulas on CSV export', () => {
    for (const value of ['=1+1', '+cmd', '-10+20', '@SUM(A1)', '  =hidden']) expect(safeCell(value)).toBe(`'${value}`);
    expect(safeCell('-1240.50')).toBe('-1240.50');
    expect(serializeCsv(['value'], [['=1+1'], ['plain']])).toBe("value\r\n'=1+1\r\nplain");
  });
});
