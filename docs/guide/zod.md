# Zod

rut-kit incluye un schema de Zod listo para usar en formularios y APIs. Valida, transforma y formatea en un solo paso.

## Instalación

Zod es una peer dependency opcional:

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

## Schema por Defecto

Importa `rutSchema` para usar el schema preconfigurado:

```typescript
import { rutSchema } from "rut-kit/zod"

rutSchema.parse("18.972.631-7")
// "18972631-7"

rutSchema.parse("189726317")
// "18972631-7"
```

El schema:
1. Acepta cualquier formato de entrada
2. Valida caracteres, formato y dígito verificador
3. Retorna el RUT normalizado (sin puntos, con guión)
4. Usa mensajes de error en español

## Manejo de Errores

Usa `safeParse` para manejar errores sin excepciones:

```typescript
const result = rutSchema.safeParse("18.972.631-0")

if (!result.success) {
  console.log(result.error.issues[0].message)
  // "Dígito verificador incorrecto"
}
```

## Schema Personalizado

Usa `createRutSchema` para personalizar mensajes o formato de salida:

```typescript
import { createRutSchema } from "rut-kit/zod"

const schema = createRutSchema({
  messages: {
    required: "Debes ingresar tu RUT",
    invalidFormat: "Formato incorrecto",
    invalidCheckDigit: "Dígito incorrecto"
  },
  outputFormat: "formatted"
})

schema.parse("189726317")
// "18.972.631-7"
```

### Opciones

| Opción | Tipo | Descripción |
|--------|------|-------------|
| `messages` | `object` | Mensajes de error personalizados |
| `outputFormat` | `"formatted"` \| `"clean"` | Formato del RUT retornado |

Solo necesitas incluir los mensajes que quieras cambiar. Los demás usan el valor por defecto.

### Formatos de Salida

```typescript
// Default (sin puntos, con guión)
rutSchema.parse("189726317")
// "18972631-7"

// Formatted (con puntos y guión)
createRutSchema({ outputFormat: "formatted" }).parse("189726317")
// "18.972.631-7"

// Clean (solo números y K)
createRutSchema({ outputFormat: "clean" }).parse("18.972.631-7")
// "189726317"
```

## Uso con Zod Objects

Combina el schema de RUT con otros campos:

```typescript
import { z } from "zod"
import { rutSchema } from "rut-kit/zod"

const userSchema = z.object({
  name: z.string().min(1),
  rut: rutSchema,
  email: z.string().email()
})

userSchema.parse({
  name: "Juan",
  rut: "18.972.631-7",
  email: "juan@ejemplo.cl"
})
// { name: "Juan", rut: "18972631-7", email: "juan@ejemplo.cl" }
```
