import { describe, expect, it } from 'vitest';
import { cleanRut, formatRut, getRutCheckDigit, isValidRut } from '../src';

describe('cleanRut', () => {
  it('removes dots and dashes', () => {
    expect(cleanRut('18.972.631-7')).toBe('189726317');
  });

  it('removes spaces', () => {
    expect(cleanRut('18 972 631 7')).toBe('189726317');
  });

  it('converts to uppercase', () => {
    expect(cleanRut('12.345.678-k')).toBe('12345678K');
  });

  it('handles already clean RUT', () => {
    expect(cleanRut('189726317')).toBe('189726317');
  });

  it('handles empty string', () => {
    expect(cleanRut('')).toBe('');
  });
});

describe('getRutCheckDigit', () => {
  it('calculates correct digit for 18972631', () => {
    expect(getRutCheckDigit('18972631')).toBe('7');
  });

  it('calculates correct digit for 12345678', () => {
    expect(getRutCheckDigit('12345678')).toBe('5');
  });

  it('calculates K digit', () => {
    expect(getRutCheckDigit('11111111')).toBe('1');
  });

  it('handles formatted input', () => {
    expect(getRutCheckDigit('18.972.631')).toBe('7');
  });

  it('returns empty for invalid input', () => {
    expect(getRutCheckDigit('abc')).toBe('');
    expect(getRutCheckDigit('')).toBe('');
  });

  it('calculates 0 as check digit', () => {
    expect(getRutCheckDigit('12131415')).toBe('0');
  });

  it('calculates K as check digit', () => {
    expect(getRutCheckDigit('6')).toBe('K');
    expect(getRutCheckDigit('33333335')).toBe('K');
  });
});

describe('isValidRut', () => {
  it('validates correct RUT with dots and dash', () => {
    expect(isValidRut('18.972.631-7')).toBe(true);
  });

  it('validates correct RUT without formatting', () => {
    expect(isValidRut('189726317')).toBe(true);
  });

  it('validates RUT with K check digit', () => {
    expect(isValidRut('6-K')).toBe(true);
    expect(isValidRut('6-k')).toBe(true);
    expect(isValidRut('33.333.335-K')).toBe(true);
  });

  it('validates RUT with 0 check digit', () => {
    expect(isValidRut('12.131.415-0')).toBe(true);
  });

  it('rejects RUT with wrong check digit', () => {
    expect(isValidRut('18.972.631-0')).toBe(false);
    expect(isValidRut('189726310')).toBe(false);
  });

  it('rejects malformed RUT', () => {
    expect(isValidRut('abc')).toBe(false);
    expect(isValidRut('')).toBe(false);
    expect(isValidRut('1')).toBe(false);
  });

  it('rejects RUT with invalid characters', () => {
    expect(isValidRut('18.972.631-X')).toBe(false);
  });

  it('rejects too long RUT', () => {
    expect(isValidRut('123456789012')).toBe(false);
  });
});

describe('formatRut', () => {
  it('formats clean RUT', () => {
    expect(formatRut('189726317')).toBe('18.972.631-7');
  });

  it('formats already formatted RUT', () => {
    expect(formatRut('18.972.631-7')).toBe('18.972.631-7');
  });

  it('formats short RUT', () => {
    expect(formatRut('1234567')).toBe('123.456-7');
  });

  it('formats RUT with K', () => {
    expect(formatRut('17779355K')).toBe('17.779.355-K');
    expect(formatRut('17779355k')).toBe('17.779.355-K');
  });

  it('handles single digit body', () => {
    expect(formatRut('1-9')).toBe('1-9');
  });

  it('handles empty string', () => {
    expect(formatRut('')).toBe('');
  });

  it('handles single character', () => {
    expect(formatRut('1')).toBe('1');
  });
});
