# Getting Started

rut-kit validates Chilean RUTs with descriptive errors. Instead of just `true/false`, it tells you exactly what failed.

## Installation

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

## Validate a RUT

```typescript
import { validateRut } from 'rut-kit'

const result = validateRut('18.972.631-7')

if (result.valid) {
  console.log(result.rut) // '189726317'
} else {
  console.log(result.error) // 'invalidFormat' or 'invalidCheckDigit'
}
```

## Format a RUT

```typescript
import { formatRut } from 'rut-kit'

formatRut('189726317')              // '18972631-7'
formatRut('189726317', 'formatted') // '18.972.631-7'
```

## With Zod

If you use Zod for form validation:

```bash
npm install rut-kit zod
```

```typescript
import { rutSchema } from 'rut-kit/zod'

rutSchema.parse('18.972.631-7')
// '18972631-7'
```

::: warning Framework Agnostic
**rut-kit** works with any JavaScript framework. The integration examples are for frameworks we've tested, but you can use it with Vue, Svelte, Angular, etc. in the same way.
:::

## Next Steps

- [Validation](/en/guide/validation) - When to use `isValidRut` vs `validateRut`
- [Formatting](/en/guide/formatting) - Output formats and data cleaning
- [Zod](/en/guide/zod) - Schema for forms and APIs