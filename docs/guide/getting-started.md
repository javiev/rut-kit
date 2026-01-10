# Inicio Rápido

rut-kit valida RUTs chilenos con errores descriptivos. En lugar de solo `true/false`, te dice exactamente qué ajustar: caracteres inválidos, formato incorrecto o dígito verificador erróneo.

## Instalación

::: code-group
```bash [npm]
npm install rut-kit
```
```bash [pnpm]
pnpm add rut-kit
```
```bash [bun]
bun add rut-kit
```
:::

Requiere Node.js >= 18.13 (o Bun, Edge, navegador).

## Uso Básico

```typescript
import { validateRut } from 'rut-kit'

validateRut('18.972.631-7')
// { valid: true, rut: '189726317' }

validateRut('18.972.631-0')
// { valid: false, error: 'invalidCheckDigit' }
```

El error indica exactamente qué falló, permitiendo mostrar mensajes claros al usuario.

## Con Zod

Si usas Zod, instala ambas dependencias:

::: code-group
```bash [npm]
npm install rut-kit zod
```
```bash [pnpm]
pnpm add rut-kit zod
```
```bash [bun]
bun add rut-kit zod
```
:::

```typescript
import { rutSchema } from 'rut-kit/zod'

rutSchema.parse('18.972.631-7')
// '18972631-7'
```

## Siguiente Paso

- [Validación](/guide/validation) - `isValidRut`, `validateRut`, `getErrorMessage`
- [Formateo](/guide/formatting) - `formatRut`, `cleanRut`, `getRutCheckDigit`
- [Zod](/guide/zod) - Schema para formularios y APIs
