import type { RutErrorMessages } from './types';

/**
 * Default error messages in Spanish.
 */
export const defaultErrorMessages: Required<RutErrorMessages> = {
  required: 'RUT es requerido',
  invalidFormat: 'Formato de RUT inválido',
  invalidCheckDigit: 'Dígito verificador incorrecto',
};
