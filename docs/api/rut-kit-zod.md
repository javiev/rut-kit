# rut-kit/zod

Schema de Zod para validar RUTs en formularios y APIs. Valida, transforma y formatea en un solo paso.

## Instalación

Requiere Zod como peer dependency:

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

## Importación

```typescript
import { rutSchema, createRutSchema } from "rut-kit/zod"
```

## `rutSchema`

Schema preconfigurado listo para usar. Acepta cualquier formato de entrada, valida el RUT completo, y retorna el formato normalizado.

```typescript
rutSchema.parse("18.972.631-7")
// "18972631-7"

rutSchema.parse("189726317")
// "18972631-7"
```

Si el RUT es inválido, lanza un `ZodError` con el mensaje correspondiente en español:

```typescript
rutSchema.safeParse("18.972.631-0")
// { success: false, error: ZodError }
// error.issues[0].message → "Dígito verificador incorrecto"
```

El schema valida en este orden:
1. Que no esté vacío
2. Que solo contenga números, puntos, guiones y la letra K
3. Que tenga el formato correcto (1-8 dígitos + dígito verificador)
4. Que el dígito verificador sea válido

## `createRutSchema()`

Crea un schema personalizado cuando necesitas cambiar los mensajes de error o el formato de salida.

### Mensajes Personalizados

Útil para adaptar los mensajes a tu aplicación o idioma:

```typescript
const schema = createRutSchema({
  messages: {
    required: "Ingresa tu RUT",
    invalidFormat: "Formato incorrecto",
    invalidCheckDigit: "Dígito incorrecto"
  }
})
```

Solo necesitas incluir los mensajes que quieras cambiar. Los demás usan el valor por defecto.

### Formato de Salida

Por defecto, el schema retorna el formato `18972631-7` (sin puntos, con guión). Puedes cambiarlo:

```typescript
// Para mostrar al usuario
const displaySchema = createRutSchema({ outputFormat: "formatted" })
displaySchema.parse("189726317")
// "18.972.631-7"

// Para APIs que requieren solo números
const apiSchema = createRutSchema({ outputFormat: "clean" })
apiSchema.parse("18.972.631-7")
// "189726317"
```

### Combinando Opciones

Puedes usar ambas opciones juntas:

```typescript
const schema = createRutSchema({
  messages: { required: "RUT requerido" },
  outputFormat: "formatted"
})
```

## Opciones

| Opción | Tipo | Descripción |
|--------|------|-------------|
| `messages` | `object` | Mensajes de error personalizados |
| `outputFormat` | `"formatted"` \| `"clean"` | Formato del RUT retornado |

**Mensajes disponibles:**

| Key | Default |
|-----|---------|
| `required` | "RUT es requerido" |
| `invalidFormat` | "Formato de RUT inválido" |
| `invalidCheckDigit` | "Dígito verificador incorrecto" |
