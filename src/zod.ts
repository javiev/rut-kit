import { z } from 'zod';
import { cleanRut, formatRut, getRutCheckDigit } from './core';
import { defaultErrorMessages, type RutErrorMessages, type RutOutputFormat } from './shared';

export type RutMessages = RutErrorMessages;

export interface RutSchemaOptions {
  messages?: RutMessages;
  outputFormat?: RutOutputFormat;
}

export function createRutSchema(options: RutSchemaOptions = {}) {
  const { messages = {}, outputFormat } = options;
  const msgs = { ...defaultErrorMessages, ...messages };

  return z
    .string({ error: msgs.required })
    .min(1, { error: msgs.required })
    .transform((val) => cleanRut(val))
    .check((ctx) => {
      const val = ctx.value;

      if (!/^[\dkK]+$/.test(val)) {
        ctx.issues.push({
          code: 'custom',
          message: msgs.invalidChars,
          input: val,
        });
        return;
      }

      if (!/^\d{1,8}[\dkK]$/.test(val)) {
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
