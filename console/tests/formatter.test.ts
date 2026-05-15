import { describe, it, expect } from 'vitest';
import {
  formatScale,
  formatNumber,
  formatMoney,
  formatDate,
  highlightText,
  truncateText,
  parseFoundedYear,
  calculateCompanyAge,
  extractDomain,
} from '../src/utils/formatter';

describe('formatScale', () => {
  it('returns mapped label for known scales', () => {
    expect(formatScale('10000+人')).toBe('大型企业 (10000+人)');
    expect(formatScale('<100人')).toBe('微型企业 (<100人)');
  });

  it('returns original string for unknown scales', () => {
    expect(formatScale('自定义')).toBe('自定义');
  });

  it('returns 未知 for empty input', () => {
    expect(formatScale('')).toBe('未知');
  });
});

describe('formatNumber', () => {
  it('formats with thousand separators', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('returns - for null/undefined', () => {
    expect(formatNumber(null as unknown as number)).toBe('-');
    expect(formatNumber(undefined as unknown as number)).toBe('-');
  });
});

describe('formatMoney', () => {
  it('formats亿 for large amounts', () => {
    expect(formatMoney(150000000)).toBe('1.50亿元');
  });

  it('formats万 for medium amounts', () => {
    expect(formatMoney(50000)).toBe('5.00万元');
  });

  it('returns original for small amounts', () => {
    expect(formatMoney(100)).toBe('100元');
  });

  it('returns - for null/undefined', () => {
    expect(formatMoney(null as unknown as number)).toBe('-');
  });
});

describe('formatDate', () => {
  it('formats Date object', () => {
    const result = formatDate(new Date('2024-01-15'));
    expect(result).toMatch(/2024/);
  });

  it('formats date string', () => {
    const result = formatDate('2024-01-15');
    expect(result).toMatch(/2024/);
  });

  it('returns - for empty input', () => {
    expect(formatDate('')).toBe('-');
  });
});

describe('highlightText', () => {
  it('wraps keyword in mark tag', () => {
    expect(highlightText('Hello World', 'world')).toBe('Hello <mark>World</mark>');
  });

  it('is case-insensitive', () => {
    expect(highlightText('Test TEST', 'test')).toBe('<mark>Test</mark> <mark>TEST</mark>');
  });

  it('returns original text when no keyword', () => {
    expect(highlightText('Hello', '')).toBe('Hello');
  });
});

describe('truncateText', () => {
  it('truncates long text', () => {
    expect(truncateText('Hello World', 5)).toBe('Hello...');
  });

  it('returns original text if within limit', () => {
    expect(truncateText('Hi', 10)).toBe('Hi');
  });
});

describe('parseFoundedYear', () => {
  it('extracts 4-digit year', () => {
    expect(parseFoundedYear('成立于2010年')).toBe(2010);
  });

  it('returns 0 for empty string', () => {
    expect(parseFoundedYear('')).toBe(0);
  });

  it('returns 0 when no year found', () => {
    expect(parseFoundedYear('未知')).toBe(0);
  });
});

describe('calculateCompanyAge', () => {
  it('calculates age from founded year', () => {
    const currentYear = new Date().getFullYear();
    expect(calculateCompanyAge('2010年')).toBe(currentYear - 2010);
  });

  it('returns 0 for invalid year', () => {
    expect(calculateCompanyAge('')).toBe(0);
  });
});

describe('extractDomain', () => {
  it('extracts domain from https URL', () => {
    expect(extractDomain('https://www.example.com/path')).toBe('example.com');
  });

  it('extracts domain from URL without protocol', () => {
    expect(extractDomain('www.example.com')).toBe('example.com');
  });

  it('returns original string for invalid URL', () => {
    expect(extractDomain('not-a-url')).toBe('not-a-url');
  });

  it('returns empty string for empty input', () => {
    expect(extractDomain('')).toBe('');
  });
});
