import { describe, expect, it } from 'vitest';
import { formatBRL, formatMes } from './faturamento';

describe('formatMes', () => {
  it('writes the month in full, in pt-BR', () => {
    expect(formatMes('2026-11')).toBe('novembro de 2026');
    expect(formatMes('2026-01')).toBe('janeiro de 2026');
  });
});

describe('formatBRL', () => {
  it('formats reais with comma decimals', () => {
    expect(formatBRL(1234.5)).toBe('R$ 1.234,50');
  });
});
