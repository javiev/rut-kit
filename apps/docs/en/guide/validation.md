# Validation

rut-kit offers two ways to validate RUTs depending on what you need to know.

## Just need to know if it's valid?

Use `isValidRut`:

```typescript
import { isValidRut } from 'rut-kit'

if (isValidRut(input)) {
  // Valid RUT
}
```

## Need to know what failed?

Use `validateRut` + `getErrorMessage`:

```typescript
import { validateRut, getErrorMessage } from 'rut-kit'

const result = validateRut(input)

if (result.valid) {
  console.log(result.rut) // Clean RUT: '189726317'
} else {
  console.log(getErrorMessage(result.error))
  // 'Invalid RUT format' or 'Invalid check digit'
}
```

## Have data with unusual separators?

If you receive RUTs from Excel, PDFs, or other sources with commas or asterisks, clean first:

```typescript
import { cleanRut, validateRut } from 'rut-kit'

const dirty = '18,972,631-7'
const clean = cleanRut(dirty)  // '189726317'
validateRut(clean)             // { valid: true, rut: '189726317' }
```

::: tip Permissive vs Strict
- `cleanRut()` is **permissive**: accepts any separator
- `validateRut()` is **strict**: only valid Chilean formats

Recommended flow for dirty data: `cleanRut()` -> `validateRut()`
:::

## Custom Messages

You can change the error messages:

```typescript
getErrorMessage(result.error, {
  invalidFormat: 'Check the RUT format',
  invalidCheckDigit: 'The RUT is not valid'
})
```

---

See full reference at [API rut-kit](/en/api/rut-kit)