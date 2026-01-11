/**
 * Error types that can occur during RUT validation.
 */
export type RutValidationError = 'invalidFormat' | 'invalidCheckDigit';

/**
 * Output format for RUT formatting.
 * - clean: No dots, no dash (e.g., "123456789")
 * - formatted: With dots and dash (e.g., "12.345.678-9")
 *
 * Default (when not specified): No dots, with dash (e.g., "12345678-9") - Recommended for storage
 */
export type RutOutputFormat = 'clean' | 'formatted';

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
  invalidFormat?: string;
  invalidCheckDigit?: string;
};
