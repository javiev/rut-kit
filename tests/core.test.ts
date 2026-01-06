import { describe, expect, it } from 'vitest';
import {
  cleanRut,
  formatRut,
  getErrorMessage,
  getRutCheckDigit,
  isValidRut,
  validateRut,
} from '../src';

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
  describe('default format (no dots, with dash)', () => {
    it('formats clean RUT', () => {
      expect(formatRut('189726317')).toBe('18972631-7');
    });

    it('formats already formatted RUT', () => {
      expect(formatRut('18.972.631-7')).toBe('18972631-7');
    });

    it('formats short RUT', () => {
      expect(formatRut('1234567')).toBe('123456-7');
    });

    it('formats RUT with K', () => {
      expect(formatRut('17779355K')).toBe('17779355-K');
      expect(formatRut('17779355k')).toBe('17779355-K');
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

  describe('clean format', () => {
    it('formats to clean RUT without dots or dash', () => {
      expect(formatRut('18.972.631-7', 'clean')).toBe('189726317');
    });

    it('formats already clean RUT', () => {
      expect(formatRut('189726317', 'clean')).toBe('189726317');
    });

    it('formats RUT with K', () => {
      expect(formatRut('17.779.355-K', 'clean')).toBe('17779355K');
      expect(formatRut('17779355k', 'clean')).toBe('17779355K');
    });

    it('handles empty string', () => {
      expect(formatRut('', 'clean')).toBe('');
    });
  });

  describe('formatted format', () => {
    it('formats to formatted RUT with dots and dash', () => {
      expect(formatRut('189726317', 'formatted')).toBe('18.972.631-7');
    });

    it('formats already formatted RUT', () => {
      expect(formatRut('18.972.631-7', 'formatted')).toBe('18.972.631-7');
    });

    it('formats short RUT', () => {
      expect(formatRut('1234567', 'formatted')).toBe('123.456-7');
    });

    it('formats RUT with K', () => {
      expect(formatRut('17779355K', 'formatted')).toBe('17.779.355-K');
      expect(formatRut('17779355k', 'formatted')).toBe('17.779.355-K');
    });

    it('handles single digit body', () => {
      expect(formatRut('1-9', 'formatted')).toBe('1-9');
    });
  });
});

describe('validateRut', () => {
  it('returns valid result for correct RUT', () => {
    const result = validateRut('18.972.631-7');
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.rut).toBe('189726317');
    }
  });

  it('returns valid result for RUT without formatting', () => {
    const result = validateRut('189726317');
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.rut).toBe('189726317');
    }
  });

  it('returns valid result for RUT with K check digit', () => {
    const result = validateRut('6-K');
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.rut).toBe('6K');
    }
  });

  it('returns invalidChars error for invalid characters', () => {
    const result = validateRut('18.972.631-X');
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('invalidChars');
    }
  });

  it('returns invalidFormat error for malformed RUT', () => {
    const result = validateRut('1');
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('invalidFormat');
    }
  });

  it('returns invalidFormat error for too long RUT', () => {
    const result = validateRut('123456789012');
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('invalidFormat');
    }
  });

  it('returns invalidCheckDigit error for wrong check digit', () => {
    const result = validateRut('18.972.631-0');
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('invalidCheckDigit');
    }
  });

  it('returns invalidChars error for letters in body', () => {
    const result = validateRut('abc123');
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('invalidChars');
    }
  });

  it('returns invalidChars error for empty string', () => {
    const result = validateRut('');
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('invalidChars');
    }
  });
});

describe('getErrorMessage', () => {
  it('returns default message for invalidChars', () => {
    const message = getErrorMessage('invalidChars');
    expect(message).toBe('RUT contiene caracteres inválidos');
  });

  it('returns default message for invalidFormat', () => {
    const message = getErrorMessage('invalidFormat');
    expect(message).toBe('Formato de RUT inválido');
  });

  it('returns default message for invalidCheckDigit', () => {
    const message = getErrorMessage('invalidCheckDigit');
    expect(message).toBe('Dígito verificador incorrecto');
  });

  it('returns custom message when provided', () => {
    const message = getErrorMessage('invalidChars', {
      invalidChars: 'Invalid characters in RUT',
    });
    expect(message).toBe('Invalid characters in RUT');
  });

  it('merges custom messages with defaults', () => {
    const customMessages = {
      invalidChars: 'Custom chars message',
    };
    expect(getErrorMessage('invalidChars', customMessages)).toBe('Custom chars message');
    expect(getErrorMessage('invalidFormat', customMessages)).toBe('Formato de RUT inválido');
  });

  it('works with validateRut result', () => {
    const result = validateRut('invalid-rut');
    if (!result.valid) {
      const message = getErrorMessage(result.error, {
        invalidChars: 'Invalid characters detected',
      });
      expect(message).toBe('Invalid characters detected');
    }
  });
});
