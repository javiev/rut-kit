# Express & Hono

Validación de RUTs en APIs backend. Ambos frameworks siguen patrones similares.

## Express

Valida el body de la request usando el schema de Zod. Los errores se retornan con status 400.

```typescript
import express from "express"
import { z } from "zod"
import { rutSchema } from "rut-kit/zod"

const app = express()
app.use(express.json())

const schema = z.object({
  rut: rutSchema
})

app.post("/api/users", (req, res) => {
  const result = schema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() })
  }

  // result.data.rut ya viene validado: "18972631-7"
  res.json({ success: true })
})
```

## Hono

Hono tiene un validador oficial para Zod que simplifica el código. La validación ocurre automáticamente antes de llegar al handler.

```typescript
import { Hono } from "hono"
import { z } from "zod"
import { rutSchema } from "rut-kit/zod"
import { zValidator } from "@hono/zod-validator"

const app = new Hono()

const schema = z.object({
  rut: rutSchema
})

app.post("/api/users", zValidator("json", schema), (c) => {
  const data = c.req.valid("json")
  // data.rut → "18972631-7"
  return c.json({ success: true })
})
```

Si la validación falla, Hono retorna automáticamente un error 400 con los detalles.

## Sin Zod

Si prefieres no usar Zod, puedes validar directamente con las funciones core:

```typescript
import { validateRut } from "rut-kit"

app.post("/api/users", (req, res) => {
  const result = validateRut(req.body.rut)

  if (!result.valid) {
    return res.status(400).json({ error: result.error })
  }

  // result.rut → "189726317"
  res.json({ success: true })
})
```

En este caso, `result.error` contiene el tipo de error (`"invalidChars"`, `"invalidFormat"`, o `"invalidCheckDigit"`) que puedes usar para construir tu propia respuesta.
