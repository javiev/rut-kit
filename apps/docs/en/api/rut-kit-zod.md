# rut-kit/zod

Zod API reference for validating RUTs in forms and APIs.

```typescript
import { rutSchema, createRutSchema } from 'rut-kit/zod'
```

::: info Requirement
Requires `zod` as a peer dependency: `npm install rut-kit zod`
:::

## rutSchema

Pre-configured Zod schema for validating Chilean RUTs.

```typescript
const rutSchema: ZodEffects<ZodString, string, string>
```

### Behavior

1. Validates that it's not empty
2. Validates valid Chilean format (`18.972.631-7`, `18972631-7`, `189726317`)
3. Validates the check digit
4. Returns the normalized RUT (no dots, with dash)

### Example

```typescript
rutSchema.parse('18.972.631-7')
// '18972631-7'

rutSchema.parse('189726317')
// '18972631-7'

rutSchema.safeParse('18.972.631-0')
// { success: false, error: ZodError }
// error.issues[0].message → 'Invalid check digit'
```

### Error Messages

| Case | Message |
|------|---------|
| Empty | `'RUT is required'` |
| Invalid format | `'Invalid RUT format'` |
| Invalid check digit | `'Invalid check digit'` |

---

## createRutSchema

Creates a custom schema with custom messages or output format.

```typescript
function createRutSchema(options?: RutSchemaOptions): ZodEffects<ZodString, string, string>
```

### Parameters

| Name | Type | Description |
|------|------|-------------|
| `options` | `RutSchemaOptions` | Configuration options (optional) |

### RutSchemaOptions

| Option | Type | Description |
|--------|------|-------------|
| `messages` | `RutErrorMessages` | Custom error messages |
| `outputFormat` | `'formatted'` \| `'clean'` | Format of the returned RUT |

### Output Formats

| Format | Result |
|--------|--------|
| `undefined` (default) | `18972631-7` |
| `'formatted'` | `18.972.631-7` |
| `'clean'` | `189726317` |

### Example

```typescript
// Custom messages
const schema = createRutSchema({
  messages: {
    required: 'Enter your RUT',
    invalidFormat: 'Incorrect format',
    invalidCheckDigit: 'Invalid digit'
  }
})

// Output format
const displaySchema = createRutSchema({ outputFormat: 'formatted' })
displaySchema.parse('189726317')
// '18.972.631-7'

// Combining options
const customSchema = createRutSchema({
  messages: { required: 'RUT required' },
  outputFormat: 'formatted'
})
```

---

## Usage with Zod Objects

```typescript
import { z } from 'zod'
import { rutSchema } from 'rut-kit/zod'

const userSchema = z.object({
  name: z.string().min(1),
  rut: rutSchema,
  email: z.string().email()
})

userSchema.parse({
  name: 'Juan',
  rut: '18.972.631-7',
  email: 'juan@example.cl'
})
// { name: 'Juan', rut: '18972631-7', email: 'juan@example.cl' }
```