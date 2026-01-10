# Inicio Rápido

rut-kit valida RUTs chilenos con errores descriptivos. En lugar de solo `true/false`, te dice exactamente qué falló.

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

## Validar un RUT

```typescript
import { validateRut } from 'rut-kit'

const result = validateRut('18.972.631-7')

if (result.valid) {
  console.log(result.rut) // '189726317'
} else {
  console.log(result.error) // 'invalidFormat' o 'invalidCheckDigit'
}
```

## Formatear un RUT

```typescript
import { formatRut } from 'rut-kit'

formatRut('189726317')              // '18972631-7'
formatRut('189726317', 'formatted') // '18.972.631-7'
```

## Con Zod

Si usas Zod para validación de formularios:

```bash
npm install rut-kit zod
```

```typescript
import { rutSchema } from 'rut-kit/zod'

rutSchema.parse('18.972.631-7')
// '18972631-7'
```

::: warning Librería Agnóstica
**rut-kit** funciona con cualquier framework de JavaScript. Los ejemplos de integración son para los frameworks que hemos probado, pero puedes usarla en Vue, Svelte, Angular, etc. de la misma forma.
:::

## Siguiente paso

- [Validación](/guide/validation) — Cuándo usar `isValidRut` vs `validateRut`
- [Formateo](/guide/formatting) — Formatos de salida y limpieza de datos
- [Zod](/guide/zod) — Schema para formularios y APIs
