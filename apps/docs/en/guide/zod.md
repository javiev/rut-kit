# Zod

rut-kit includes a ready-to-use Zod schema for forms and APIs.

## Installation

```bash
npm install rut-kit zod
```

## Basic Usage

```typescript
import { rutSchema } from 'rut-kit/zod'

rutSchema.parse('18.972.631-7')
// '18972631-7'
```

The schema validates format and check digit, and returns the normalized RUT.

## In Forms

```typescript
import { z } from 'zod'
import { rutSchema } from 'rut-kit/zod'

const formSchema = z.object({
  name: z.string().min(1),
  rut: rutSchema,
  email: z.string().email()
})
```

## Handle Errors

```typescript
const result = rutSchema.safeParse(input)

if (!result.success) {
  console.log(result.error.issues[0].message)
  // 'Invalid RUT format' or 'Invalid check digit'
}
```

## Custom Messages

```typescript
import { createRutSchema } from 'rut-kit/zod'

const schema = createRutSchema({
  messages: {
    required: 'Enter your RUT',
    invalidFormat: 'Incorrect format',
    invalidCheckDigit: 'Invalid RUT'
  }
})
```

## Change Output Format

```typescript
// For user display
const displaySchema = createRutSchema({ outputFormat: 'formatted' })
displaySchema.parse('189726317')
// '18.972.631-7'

// For APIs that require only numbers
const apiSchema = createRutSchema({ outputFormat: 'clean' })
apiSchema.parse('18.972.631-7')
// '189726317'
```

---

→ See full reference at [API rut-kit/zod](/en/api/rut-kit-zod)