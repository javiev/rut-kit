import { describe, expect, it } from 'vitest';
import { createRutSchema, rutSchema } from '../src';

describe('rutSchema', () => {
  it('validates and formats correct RUT', () => {
    const result = rutSchema.safeParse('189726317');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('18.972.631-7');
    }
  });

  it('validates formatted RUT', () => {
    const result = rutSchema.safeParse('18.972.631-7');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('18.972.631-7');
    }
  });

  it('validates RUT with K', () => {
    const result = rutSchema.safeParse('33333335-k');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('33.333.335-K');
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
      required: 'Debes ingresar tu RUT',
      invalidChars: 'El RUT contiene caracteres inválidos',
      invalidFormat: 'El formato del RUT es incorrecto',
      invalidCheckDigit: 'El dígito verificador no coincide',
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
      required: 'Custom required message',
    });

    const invalidCharsResult = partialSchema.safeParse('abc');
    expect(invalidCharsResult.success).toBe(false);
    if (!invalidCharsResult.success) {
      expect(invalidCharsResult.error.issues[0].message).toBe('RUT contiene caracteres inválidos');
    }
  });
});
