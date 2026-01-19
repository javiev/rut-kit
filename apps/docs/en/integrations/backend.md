# Express & Hono

RUT validation in backend APIs. Both frameworks follow similar patterns.

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

## Express

Validate the request body using the Zod schema. Errors are returned with status 400.

```typescript
import express from 'express'
import { z } from 'zod'
import { rutSchema } from 'rut-kit/zod'

const app = express()
app.use(express.json())

const schema = z.object({
  rut: rutSchema
})

app.post('/api/users', (req, res) => {
  const result = schema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() })
  }

  // result.data.rut is already validated: '18972631-7'
  res.json({ success: true })
})
```

## Hono

Hono has an official Zod validator that simplifies the code. Validation happens automatically before reaching the handler.

```typescript
import { Hono } from 'hono'
import { z } from 'zod'
import { rutSchema } from 'rut-kit/zod'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

const schema = z.object({
  rut: rutSchema
})

app.post('/api/users', zValidator('json', schema), (c) => {
  const data = c.req.valid('json')
  // data.rut → '18972631-7'
  return c.json({ success: true })
})
```

If validation fails, Hono automatically returns a 400 error with the details.

## Without Zod

If you prefer not to use Zod, you can validate directly with the core functions:

```typescript
import { validateRut } from 'rut-kit'

app.post('/api/users', (req, res) => {
  const result = validateRut(req.body.rut)

  if (!result.valid) {
    return res.status(400).json({ error: result.error })
  }

  // result.rut → '189726317'
  res.json({ success: true })
})
```

In this case, `result.error` contains the error type (`'invalidFormat'` or `'invalidCheckDigit'`) that you can use to build your own response.