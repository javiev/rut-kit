import { z } from 'zod';
import { cleanRut, formatRut, getRutCheckDigit } from './core';

export type RutMessages = {
  required?: string;
  invalidChars?: string;
  invalidFormat?: string;
  invalidCheckDigit?: string;
};

const defaultMessages: Required<RutMessages> = {
  required: 'RUT es requerido',
  invalidChars: 'RUT contiene caracteres inválidos',
  invalidFormat: 'Formato de RUT inválido',
  invalidCheckDigit: 'Dígito verificador incorrecto',
};

export function createRutSchema(messages: RutMessages = {}) {
  const msgs = { ...defaultMessages, ...messages };

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
    .transform((val) => formatRut(val));
}

export const rutSchema = createRutSchema();
