# Next.js

RUT validation in Server Actions and API Routes using the App Router.

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

## Server Action

Server Actions allow you to validate forms directly on the server. The Zod schema validates and formats the RUT before processing.

```typescript
'use server'

import { z } from 'zod'
import { rutSchema } from 'rut-kit/zod'

const schema = z.object({
  rut: rutSchema
})

export async function action(formData: FormData) {
  const result = schema.safeParse({
    rut: formData.get('rut')
  })

  if (!result.success) {
    return { error: result.error.flatten() }
  }

  // result.data.rut is already validated and formatted
  // '18972631-7'
}
```

Use `safeParse` to handle errors without throwing exceptions. The `flatten()` method converts Zod errors into a format that's easier to consume on the client.

## API Route

For REST endpoints, the pattern is similar. Validate the request body and return errors with the appropriate status code.

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rutSchema } from 'rut-kit/zod'

const schema = z.object({
  rut: rutSchema
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const result = schema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 }
    )
  }

  // result.data.rut → '18972631-7'
  return NextResponse.json({ success: true })
}
```

The RUT in `result.data.rut` is already validated and formatted, ready to save to the database.