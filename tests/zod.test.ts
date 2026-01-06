import { describe, expect, it } from 'vitest';
import { createRutSchema, rutSchema } from '../src';

describe('rutSchema', () => {
  it('validates and formats correct RUT (default: no dots, with dash)', () => {
    const result = rutSchema.safeParse('189726317');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('18972631-7');
    }
  });

  it('validates formatted RUT', () => {
    const result = rutSchema.safeParse('18.972.631-7');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('18972631-7');
    }
  });

  it('validates RUT with K', () => {
    const result = rutSchema.safeParse('33333335-k');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('33333335-K');
    }
  });

  it('rejects empty string', () => {
    const result = rutSchema.safeParse('');
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].message).toBe('RUT es requerido');
    }
  });

  it('rejects invalid characters', () => {
    const result = rutSchema.safeParse('18.972.abc-7');
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].message).toBe('RUT contiene caracteres inválidos');
    }
  });

  it('rejects invalid format', () => {
    const result = rutSchema.safeParse('1234567890123');
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].message).toBe('Formato de RUT inválido');
    }
  });

  it('rejects wrong check digit', () => {
    const result = rutSchema.safeParse('18.972.631-0');
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].message).toBe('Dígito verificador incorrecto');
    }
  });
});

describe('createRutSchema', () => {
  it('uses custom messages', () => {
    const customSchema = createRutSchema({
      messages: {
        required: 'Debes ingresar tu RUT',
        invalidChars: 'El RUT contiene caracteres inválidos',
        invalidFormat: 'El formato del RUT es incorrecto',
        invalidCheckDigit: 'El dígito verificador no coincide',
      },
    });

    const emptyResult = customSchema.safeParse('');
    expect(emptyResult.success).toBe(false);
    if (!emptyResult.success) {
      expect(emptyResult.error.issues[0].message).toBe('Debes ingresar tu RUT');
    }

    const invalidCharsResult = customSchema.safeParse('abc');
    expect(invalidCharsResult.success).toBe(false);
    if (!invalidCharsResult.success) {
      expect(invalidCharsResult.error.issues[0].message).toBe(
        'El RUT contiene caracteres inválidos'
      );
    }

    const invalidFormatResult = customSchema.safeParse('1234567890123');
    expect(invalidFormatResult.success).toBe(false);
    if (!invalidFormatResult.success) {
      expect(invalidFormatResult.error.issues[0].message).toBe('El formato del RUT es incorrecto');
    }

    const invalidCheckDigitResult = customSchema.safeParse('18.972.631-0');
    expect(invalidCheckDigitResult.success).toBe(false);
    if (!invalidCheckDigitResult.success) {
      expect(invalidCheckDigitResult.error.issues[0].message).toBe(
        'El dígito verificador no coincide'
      );
    }
  });

  it('uses default messages for undefined custom messages', () => {
    const partialSchema = createRutSchema({
      messages: {
        required: 'Custom required message',
      },
    });

    const invalidCharsResult = partialSchema.safeParse('abc');
    expect(invalidCharsResult.success).toBe(false);
    if (!invalidCharsResult.success) {
      expect(invalidCharsResult.error.issues[0].message).toBe('RUT contiene caracteres inválidos');
    }
  });

  describe('output formats', () => {
    it('default format (no dots, with dash)', () => {
      const result = rutSchema.safeParse('18.972.631-7');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('18972631-7');
      }
    });

    it('outputs clean format (no dots, no dash)', () => {
      const cleanSchema = createRutSchema({ outputFormat: 'clean' });
      const result = cleanSchema.safeParse('18.972.631-7');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('189726317');
      }
    });

    it('outputs formatted format (with dots and dash)', () => {
      const formattedSchema = createRutSchema({ outputFormat: 'formatted' });
      const result = formattedSchema.safeParse('189726317');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('18.972.631-7');
      }
    });

    it('handles K with different formats', () => {
      const defaultSchema = createRutSchema();
      const cleanSchema = createRutSchema({ outputFormat: 'clean' });
      const formattedSchema = createRutSchema({ outputFormat: 'formatted' });

      const input = '33.333.335-k';

      const defaultResult = defaultSchema.safeParse(input);
      expect(defaultResult.success).toBe(true);
      if (defaultResult.success) {
        expect(defaultResult.data).toBe('33333335-K');
      }

      const cleanResult = cleanSchema.safeParse(input);
      expect(cleanResult.success).toBe(true);
      if (cleanResult.success) {
        expect(cleanResult.data).toBe('33333335K');
      }

      const formattedResult = formattedSchema.safeParse(input);
      expect(formattedResult.success).toBe(true);
      if (formattedResult.success) {
        expect(formattedResult.data).toBe('33.333.335-K');
      }
    });

    it('combines custom messages with output format', () => {
      const customSchema = createRutSchema({
        messages: {
          invalidCheckDigit: 'Custom error message',
        },
        outputFormat: 'clean',
      });

      const validResult = customSchema.safeParse('18.972.631-7');
      expect(validResult.success).toBe(true);
      if (validResult.success) {
        expect(validResult.data).toBe('189726317');
      }

      const invalidResult = customSchema.safeParse('18.972.631-0');
      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success) {
        expect(invalidResult.error.issues[0].message).toBe('Custom error message');
      }
    });
  });
});
