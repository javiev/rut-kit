# rut-kit/zod

Referencia de la API de Zod para validar RUTs en formularios y APIs.

```typescript
import { rutSchema, createRutSchema } from 'rut-kit/zod'
```

::: info Requisito
Requiere `zod` como peer dependency: `npm install rut-kit zod`
:::

## rutSchema

Schema de Zod preconfigurado para validar RUTs chilenos.

```typescript
const rutSchema: ZodEffects<ZodString, string, string>
```

### Comportamiento

1. Valida que no esté vacío
2. Valida formato chileno válido (`18.972.631-7`, `18972631-7`, `189726317`)
3. Valida el dígito verificador
4. Retorna el RUT normalizado (sin puntos, con guión)

### Ejemplo

```typescript
rutSchema.parse('18.972.631-7')
// '18972631-7'

rutSchema.parse('189726317')
// '18972631-7'

rutSchema.safeParse('18.972.631-0')
// { success: false, error: ZodError }
// error.issues[0].message → 'Dígito verificador incorrecto'
```

### Mensajes de error

| Caso | Mensaje |
|------|---------|
| Vacío | `'RUT es requerido'` |
| Formato inválido | `'Formato de RUT inválido'` |
| Dígito verificador incorrecto | `'Dígito verificador incorrecto'` |

---

## createRutSchema

Crea un schema personalizado con mensajes o formato de salida custom.

```typescript
function createRutSchema(options?: RutSchemaOptions): ZodEffects<ZodString, string, string>
```

### Parámetros

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `options` | `RutSchemaOptions` | Opciones de configuración (opcional) |

### RutSchemaOptions

| Opción | Tipo | Descripción |
|--------|------|-------------|
| `messages` | `RutErrorMessages` | Mensajes de error personalizados |
| `outputFormat` | `'formatted'` \| `'clean'` | Formato del RUT retornado |

### Formatos de salida

| Formato | Resultado |
|---------|-----------|
| `undefined` (default) | `18972631-7` |
| `'formatted'` | `18.972.631-7` |
| `'clean'` | `189726317` |

### Ejemplo

```typescript
// Mensajes personalizados
const schema = createRutSchema({
  messages: {
    required: 'Ingresa tu RUT',
    invalidFormat: 'Formato incorrecto',
    invalidCheckDigit: 'Dígito incorrecto'
  }
})

// Formato de salida
const displaySchema = createRutSchema({ outputFormat: 'formatted' })
displaySchema.parse('189726317')
// '18.972.631-7'

// Combinando opciones
const customSchema = createRutSchema({
  messages: { required: 'RUT requerido' },
  outputFormat: 'formatted'
})
```

---

## Uso con Zod Objects

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
  email: 'juan@ejemplo.cl'
})
// { name: 'Juan', rut: '18972631-7', email: 'juan@ejemplo.cl' }
```

