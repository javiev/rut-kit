import { z } from 'zod';
import { cleanRut, formatRut, getRutCheckDigit } from './core';
import { defaultErrorMessages, type RutErrorMessages, type RutOutputFormat } from './shared';

export type RutMessages = RutErrorMessages;

export interface RutSchemaOptions {
  messages?: RutMessages;
  outputFormat?: RutOutputFormat;
}

/**
 * Creates a customizable Zod schema for validating Chilean RUTs.
 *
 * Validates format (strict), structure, and check digit. Returns the RUT in the specified format.
 *
 * @param options - Configuration options
 * @param options.messages - Custom error messages for validation errors
 * @param options.outputFormat - Output format: 'formatted' (XX.XXX.XXX-X), 'clean' (XXXXXXXXX), or default (XXXXXXXX-X)
 * @returns A Zod schema that validates and formats RUTs
 *
 * @example
 * // Default schema
 * const schema = createRutSchema()
 * schema.parse('189726317')  // "18972631-7"
 *
 * @example
 * // With custom messages
 * const schema = createRutSchema({
 *   messages: {
 *     required: 'RUT es obligatorio',
 *     invalidFormat: 'Formato de RUT incorrecto'
 *   }
 * })
 *
 * @example
 * // With custom output format
 * const schema = createRutSchema({ outputFormat: 'formatted' })
 * schema.parse('189726317')  // "18.972.631-7"
 */
export function createRutSchema(options: RutSchemaOptions = {}) {
  const { messages = {}, outputFormat } = options;
  const msgs = { ...defaultErrorMessages, ...messages };

  return z
    .string({ error: msgs.required })
    .min(1, { error: msgs.required })
    .check((ctx) => {
      const val = ctx.value;

      // Allows max 1 leading zero: either 0X (e.g., "01.234.567-8") or 1-2 digits without leading zero
      const withDotsRegex = /^(?:0\d|\d{1,2})\.\d{3}\.\d{3}-[\dkK]$/;
      const withDashRegex = /^0{0,2}\d{7,8}-[\dkK]$/;
      const cleanRegex = /^0{0,2}\d{7,8}[\dkK]$/;

      if (!withDotsRegex.test(val) && !withDashRegex.test(val) && !cleanRegex.test(val)) {
        ctx.issues.push({
          code: 'custom',
          message: msgs.invalidFormat,
          input: val,
        });
        return;
      }
    })
    .transform((val) => cleanRut(val))
    .check((ctx) => {
      const val = ctx.value;

      if (!/^[1-9]\d{6,7}[\dkK]$/.test(val)) {
        ctx.issues.push({
          code: 'custom',
          message: msgs.invalidFormat,
          input: val,
        });
        return;
      }

      const body = val.slice(0, -1);
      const checkDigit = val.slice(-1).toUpperCase();

      if (getRutCheckDigit(body) !== checkDigit) {
        ctx.issues.push({
          code: 'custom',
          message: msgs.invalidCheckDigit,
          input: val,
        });
      }
    })
    .transform((val) => formatRut(val, outputFormat));
}

export const rutSchema = createRutSchema();
