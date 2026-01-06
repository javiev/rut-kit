/**
 * Removes all formatting characters from a RUT (dots, dashes, spaces).
 * @param rut - The RUT string to clean
 * @returns The cleaned RUT string (only digits and K)
 */
export function cleanRut(rut: string): string {
  return rut.replace(/[.\-\s]/g, '').toUpperCase();
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
 * Validates a complete Chilean RUT (including check digit).
 * @param rut - The RUT to validate, can be formatted or clean
 * @returns true if the RUT is valid, false otherwise
 */
export function isValidRut(rut: string): boolean {
  const cleaned = cleanRut(rut);

  if (!/^\d{1,8}[\dkK]$/.test(cleaned)) {
    return false;
  }

  const body = cleaned.slice(0, -1);
  const checkDigit = cleaned.slice(-1).toUpperCase();

  return getRutCheckDigit(body) === checkDigit;
}

/**
 * Formats a RUT to the standard Chilean format (XX.XXX.XXX-X).
 * @param rut - The RUT to format
 * @returns The formatted RUT string
 */
export function formatRut(rut: string): string {
  const cleaned = cleanRut(rut);

  if (cleaned.length < 2) {
    return cleaned;
  }

  const body = cleaned.slice(0, -1);
  const checkDigit = cleaned.slice(-1);

  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${formattedBody}-${checkDigit}`;
}
