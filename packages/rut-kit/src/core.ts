import {
  defaultErrorMessages,
  RUT_FORMAT,
  type RutErrorMessages,
  type RutOutputFormat,
  type RutValidationError,
  type RutValidationResult,
} from './shared';

/**
 * Removes all formatting characters from a RUT (dots, dashes, spaces, commas, asterisks, etc).
 * This function is permissive and accepts any separator for cleaning purposes.
 * @param rut - The RUT string to clean
 * @returns The cleaned RUT string (only digits and K)
 */
export function cleanRut(rut: string): string {
  const cleaned = rut.replace(/[^\dkK]/gi, '').toUpperCase();
  return cleaned.replace(/^0+/, '') || cleaned;
}

/**
 * Calculates the check digit (digito verificador) for a RUT using module 11 algorithm.
 * @param rut - The RUT body (without check digit), can be formatted or clean
 * @returns The calculated check digit ("0"-"9" or "K")
 */
export function getRutCheckDigit(rut: string): string {
  const cleaned = cleanRut(rut).replace(/k$/i, '');

  if (!/^\d+$/.test(cleaned)) {
    return '';
  }

  const weights = [2, 3, 4, 5, 6, 7];
  let sum = 0;

  const digits = cleaned.split('').reverse();
  for (let i = 0; i < digits.length; i++) {
    sum += parseInt(digits[i], 10) * weights[i % 6];
  }

  const remainder = 11 - (sum % 11);

  if (remainder === 11) return '0';
  if (remainder === 10) return 'K';
  return remainder.toString();
}

/**
 * Validates if a RUT string has a valid Chilean RUT format.
 * Accepts only these formats:
 * - XX.XXX.XXX-X (with dots and dash) - allows leading zeros
 * - XXXXXXXX-X (without dots, with dash) - allows leading zeros
 * - XXXXXXXXX (no formatting) - allows leading zeros
 * @param rut - The RUT string to validate format
 * @returns true if the format is valid, false otherwise
 */
function isValidRutFormat(rut: string): boolean {
  if (typeof rut !== 'string' || rut.length === 0) {
    return false;
  }

  // Format: XX.XXX.XXX-X or X.XXX.XXX-X (with dots and dash) - allows leading zeros
  const withDotsRegex = /^0*\d{1,2}\.0*\d{3}\.0*\d{3}-[\dkK]$/;
  // Format: XXXXXXXX-X or XXXXXXX-X (without dots, with dash) - allows leading zeros
  const withDashRegex = /^0*\d{7,8}-[\dkK]$/;
  // Format: XXXXXXXXX or XXXXXXXX (no formatting) - allows leading zeros
  const cleanRegex = /^0*\d{7,8}[\dkK]$/;

  return withDotsRegex.test(rut) || withDashRegex.test(rut) || cleanRegex.test(rut);
}

/**
 * Validates a complete Chilean RUT (including check digit).
 * Only accepts valid Chilean RUT formats.
 * @param rut - The RUT to validate, must be in a valid format
 * @returns true if the RUT is valid, false otherwise
 */
export function isValidRut(rut: string): boolean {
  if (!isValidRutFormat(rut)) {
    return false;
  }

  const cleaned = cleanRut(rut);

  if (!/^[1-9]\d{6,7}[\dkK]$/.test(cleaned)) {
    return false;
  }

  const body = cleaned.slice(0, -1);
  const checkDigit = cleaned.slice(-1).toUpperCase();

  return getRutCheckDigit(body) === checkDigit;
}

/**
 * Validates a complete Chilean RUT with detailed error information.
 * Only accepts valid Chilean RUT formats.
 * @param rut - The RUT to validate, must be in a valid format
 * @returns Validation result with cleaned RUT if valid, or error type if invalid
 * @example
 * const result = validateRut('12.345.678-5');
 * if (result.valid) {
 *   console.log(result.rut); // '123456785'
 * } else {
 *   console.log(result.error); // 'invalidCheckDigit'
 * }
 */
export function validateRut(rut: string): RutValidationResult {
  if (!isValidRutFormat(rut)) {
    return { valid: false, error: 'invalidFormat' };
  }

  const cleaned = cleanRut(rut);

  if (!/^[1-9]\d{6,7}[\dkK]$/.test(cleaned)) {
    return { valid: false, error: 'invalidFormat' };
  }

  const body = cleaned.slice(0, -1);
  const checkDigit = cleaned.slice(-1).toUpperCase();

  if (getRutCheckDigit(body) !== checkDigit) {
    return { valid: false, error: 'invalidCheckDigit' };
  }

  return { valid: true, rut: cleaned };
}

/**
 * Gets a custom error message for a validation error.
 * @param error - The validation error type
 * @param messages - Optional custom error messages
 * @returns The error message
 * @example
 * const result = validateRut('invalid');
 * if (!result.valid) {
 *   const message = getErrorMessage(result.error, {
 *     invalidFormat: 'Invalid RUT format'
 *   });
 *   console.log(message);
 * }
 */
export function getErrorMessage(error: RutValidationError, messages?: RutErrorMessages): string {
  const msgs = { ...defaultErrorMessages, ...messages };
  return msgs[error];
}

/**
 * Formats a RUT according to the specified format.
 * @param rut - The RUT to format
 * @param format - The output format: 'clean' or 'formatted'. Default: standard format (no dots, with dash)
 * @returns The formatted RUT string
 * @example
 * formatRut('18.972.631-7') // '18972631-7' (default: no dots, with dash)
 * formatRut('18.972.631-7', 'clean') // '189726317' (no dots, no dash)
 * formatRut('18.972.631-7', 'formatted') // '18.972.631-7' (with dots and dash)
 */
export function formatRut(rut: string, format?: RutOutputFormat): string {
  const cleaned = cleanRut(rut);

  if (cleaned.length < 2) {
    return cleaned;
  }

  const body = cleaned.slice(0, -1);
  const checkDigit = cleaned.slice(-1);

  if (format === RUT_FORMAT.CLEAN) {
    return cleaned;
  }

  if (format === RUT_FORMAT.FORMATTED) {
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedBody}-${checkDigit}`;
  }

  // Default: standard format (no dots, with dash)
  return `${body}-${checkDigit}`;
}
