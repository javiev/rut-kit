/**
 * Error types that can occur during RUT validation.
 */
export type RutValidationError = 'invalidChars' | 'invalidFormat' | 'invalidCheckDigit';

/**
 * Result of RUT validation with detailed error information.
 */
export type RutValidationResult =
  | { valid: true; rut: string }
  | { valid: false; error: RutValidationError };

/**
 * Custom error messages for RUT validation.
 */
export type RutErrorMessages = {
  required?: string;
  invalidChars?: string;
  invalidFormat?: string;
  invalidCheckDigit?: string;
};

/**
 * Default error messages in Spanish.
 */
export const defaultErrorMessages: Required<RutErrorMessages> = {
  required: 'RUT es requerido',
  invalidChars: 'RUT contiene caracteres inválidos',
  invalidFormat: 'Formato de RUT inválido',
  invalidCheckDigit: 'Dígito verificador incorrecto',
};
