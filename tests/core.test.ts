import { describe, expect, it } from 'vitest';
import {
  cleanRut,
  formatRut,
  getErrorMessage,
  getRutCheckDigit,
  isValidRut,
  validateRut,
} from '../src';
import { defaultErrorMessages } from '../src/shared/messages';

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

  it('removes leading zeros', () => {
    expect(cleanRut('00123456789')).toBe('123456789');
    expect(cleanRut('0012213359-1')).toBe('122133591');
  });

  it('removes commas', () => {
    expect(cleanRut(',0.0077262111-6')).toBe('772621116');
  });

  it('removes asterisks', () => {
    expect(cleanRut('12*345*678*k')).toBe('12345678K');
  });

  it('removes any non-alphanumeric characters', () => {
    expect(cleanRut('18,972,631-7')).toBe('189726317');
    expect(cleanRut('18*972*631*7')).toBe('189726317');
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
    expect(isValidRut('33.333.335-K')).toBe(true);
    expect(isValidRut('33333335k')).toBe(true);
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

  it('rejects too short RUT', () => {
    expect(isValidRut('123')).toBe(false);
    expect(isValidRut('6-K')).toBe(false);
  });

  it('rejects RUT with only zeros', () => {
    expect(isValidRut('000')).toBe(false);
    expect(isValidRut('0-0')).toBe(false);
  });

  it('rejects RUT with commas instead of dots', () => {
    expect(isValidRut('18,972,631-7')).toBe(false);
  });

  it('rejects RUT with asterisks as separators', () => {
    expect(isValidRut('18*972*631-7')).toBe(false);
  });

  it('rejects RUT with multiple dashes', () => {
    expect(isValidRut('18-972-631-7')).toBe(false);
  });

  it('rejects RUT with additional text', () => {
    expect(isValidRut('error18.972.631-7')).toBe(false);
  });

  describe('RUT starting with zeros', () => {
    it('strips leading zeros and validates', () => {
      // 0012213359-1 -> 122133591 (8 digits + verifier, valid)
      expect(isValidRut('0012213359-1')).toBe(true);
      // 012.213.359-1 -> 122133591 (same RUT with valid formatting)
      expect(isValidRut('012.213.359-1')).toBe(true);
    });

    it('rejects RUT with leading zeros if check digit is wrong', () => {
      expect(isValidRut('0012213359-0')).toBe(false);
    });
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

    it('formats RUT with asterisks as separators (permissive)', () => {
      expect(formatRut('18*972*631*7', 'formatted')).toBe('18.972.631-7');
    });

    it('formats RUT with commas (permissive)', () => {
      expect(formatRut('18,972,631-7', 'formatted')).toBe('18.972.631-7');
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
    const result = validateRut('33.333.335-K');
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.rut).toBe('33333335K');
    }
  });

  it('returns invalidFormat error for too short RUT', () => {
    const result = validateRut('123');
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('invalidFormat');
    }
  });

  it('returns invalidFormat error for RUT with only zeros', () => {
    const result = validateRut('000');
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('invalidFormat');
    }
  });

  it('returns invalidFormat error for invalid characters', () => {
    const result = validateRut('18.972.631-X');
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('invalidFormat');
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

  it('returns invalidFormat error for letters in body', () => {
    const result = validateRut('abc123');
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('invalidFormat');
    }
  });

  it('returns invalidFormat error for empty string', () => {
    const result = validateRut('');
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('invalidFormat');
    }
  });

  it('strips leading zeros and validates', () => {
    const result = validateRut('0012213359-1');
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.rut).toBe('122133591');
    }
  });
});

describe('getErrorMessage', () => {
  it('returns default message for invalidFormat', () => {
    const message = getErrorMessage('invalidFormat');
    expect(message).toBe(defaultErrorMessages.invalidFormat);
  });

  it('returns default message for invalidCheckDigit', () => {
    const message = getErrorMessage('invalidCheckDigit');
    expect(message).toBe(defaultErrorMessages.invalidCheckDigit);
  });

  it('returns custom message when provided', () => {
    const message = getErrorMessage('invalidFormat', {
      invalidFormat: 'Invalid format in RUT',
    });
    expect(message).toBe('Invalid format in RUT');
  });

  it('merges custom messages with defaults', () => {
    const customMessages = {
      invalidFormat: 'Custom format message',
    };
    expect(getErrorMessage('invalidFormat', customMessages)).toBe('Custom format message');
    expect(getErrorMessage('invalidCheckDigit', customMessages)).toBe(
      defaultErrorMessages.invalidCheckDigit
    );
  });

  it('works with validateRut result', () => {
    const result = validateRut('invalid-rut');
    if (!result.valid) {
      const message = getErrorMessage(result.error, {
        invalidFormat: 'Invalid format detected',
      });
      expect(message).toBe('Invalid format detected');
    }
  });
});
