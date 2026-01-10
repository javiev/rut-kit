# Next.js

Validación de RUTs en Server Actions y API Routes usando el App Router.

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

Los Server Actions permiten validar formularios directamente en el servidor. El schema de Zod valida y formatea el RUT antes de procesarlo.

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

  // result.data.rut ya viene validado y formateado
  // '18972631-7'
}
```

Usa `safeParse` para manejar errores sin lanzar excepciones. El método `flatten()` convierte los errores de Zod en un formato más fácil de consumir en el cliente.

## API Route

Para endpoints REST, el patrón es similar. Valida el body de la request y retorna errores con el status code apropiado.

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

El RUT en `result.data.rut` ya está validado y formateado, listo para guardar en base de datos.
