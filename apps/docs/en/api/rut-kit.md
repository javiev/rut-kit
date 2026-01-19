# rut-kit

Core API reference for validating, formatting, and working with Chilean RUTs.

```typescript
import { isValidRut, validateRut, formatRut, cleanRut, getRutCheckDigit, getErrorMessage } from 'rut-kit'
```

## isValidRut

Validates if a Chilean RUT is valid.

```typescript
function isValidRut(rut: string): boolean
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `rut` | `string` | RUT to validate |

### Return

`boolean` - `true` if the RUT is valid, `false` otherwise.

### Accepted Formats

- With dots and dash: `18.972.631-7`
- Dash only: `18972631-7`
- No formatting: `189726317`

::: warning
Only accepts valid Chilean formats. Other separators (commas, asterisks) are rejected. Minimum RUT: 1.000.000.
:::

### Example

```typescript
isValidRut('18.972.631-7')  // true
isValidRut('18.972.631-0')  // false
isValidRut('18,972,631-7')  // false
```

---

## validateRut

Validates a RUT and returns detailed information about the result.

```typescript
function validateRut(rut: string): RutValidationResult
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `rut` | `string` | RUT to validate |

### Return

`RutValidationResult` - Object with the validation result:

```typescript
// If valid
{ valid: true, rut: string }

// If invalid
{ valid: false, error: RutValidationError }
```

### Error Types

| Error | Description |
|-------|-------------|
| `invalidFormat` | Invalid format, incorrect length, or disallowed characters |
| `invalidCheckDigit` | The check digit doesn't match |

### Example

```typescript
validateRut('18.972.631-7')
// { valid: true, rut: '189726317' }

validateRut('18.972.631-0')
// { valid: false, error: 'invalidCheckDigit' }

validateRut('18,972,631-7')
// { valid: false, error: 'invalidFormat' }
```

---

## formatRut

Formats a RUT to the specified format.

```typescript
function formatRut(rut: string, format?: RutOutputFormat): string
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `rut` | `string` | RUT to format |
| `format` | `RutOutputFormat` | Output format (optional) |

### Output Formats

| Format | Result | Recommended Use |
|--------|--------|-----------------|
| `undefined` (default) | `18972631-7` | Storage |
| `'formatted'` | `18.972.631-7` | Display to user |
| `'clean'` | `189726317` | Comparisons, APIs |

### Return

`string` - Formatted RUT.

### Example

```typescript
formatRut('189726317')              // '18972631-7'
formatRut('189726317', 'formatted') // '18.972.631-7'
formatRut('189726317', 'clean')     // '189726317'
```

::: tip
This function is permissive: it accepts any input separator. It uses `cleanRut()` internally.
:::

---

## cleanRut

Extracts only digits and the letter K from a RUT, removing any other character.

```typescript
function cleanRut(rut: string): string
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `rut` | `string` | RUT to clean |

### Return

`string` - Clean RUT (only digits and uppercase K). Removes leading zeros.

### Example

```typescript
cleanRut('18.972.631-7')  // '189726317'
cleanRut('33.333.335-k')  // '33333335K'
cleanRut('18,972,631-7')  // '189726317'
cleanRut('18*972*631*7')  // '189726317'
```

::: tip
Permissive function. Useful for cleaning data from Excel, PDFs, or other sources with non-standard separators.
:::

---

## getRutCheckDigit

Calculates the check digit of a RUT using the modulo 11 algorithm.

```typescript
function getRutCheckDigit(rut: string): string
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `rut` | `string` | RUT body (without check digit) |

### Return

`string` - Calculated check digit (`'0'`-`'9'` or `'K'`).

### Example

```typescript
getRutCheckDigit('18972631')  // '7'
getRutCheckDigit('33333335')  // 'K'
getRutCheckDigit('11111111')  // '1'
```

---

## getErrorMessage

Converts an error type to a human-readable message.

```typescript
function getErrorMessage(error: RutValidationError, messages?: RutErrorMessages): string
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `error` | `RutValidationError` | Error type to convert |
| `messages` | `RutErrorMessages` | Custom messages (optional) |

### Return

`string` - Human-readable error message.

### Default Messages

| Error | Message |
|-------|---------|
| `invalidFormat` | `'Invalid RUT format'` |
| `invalidCheckDigit` | `'Invalid check digit'` |

### Example

```typescript
const result = validateRut('18.972.631-0')

if (!result.valid) {
  getErrorMessage(result.error)
  // 'Invalid check digit'

  getErrorMessage(result.error, {
    invalidCheckDigit: 'RUT is not valid'
  })
  // 'RUT is not valid'
}
```