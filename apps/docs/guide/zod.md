# Zod

rut-kit incluye un schema de Zod listo para usar en formularios y APIs.

## Instalación

```bash
npm install rut-kit zod
```

## Uso básico

```typescript
import { rutSchema } from 'rut-kit/zod'

rutSchema.parse('18.972.631-7')
// '18972631-7'
```

El schema valida formato y dígito verificador, y retorna el RUT normalizado.

## En formularios

```typescript
import { z } from 'zod'
import { rutSchema } from 'rut-kit/zod'

const formSchema = z.object({
  nombre: z.string().min(1),
  rut: rutSchema,
  email: z.string().email()
})
```

## Manejar errores

```typescript
const result = rutSchema.safeParse(input)

if (!result.success) {
  console.log(result.error.issues[0].message)
  // 'Formato de RUT inválido' o 'Dígito verificador incorrecto'
}
```

## Personalizar mensajes

```typescript
import { createRutSchema } from 'rut-kit/zod'

const schema = createRutSchema({
  messages: {
    required: 'Ingresa tu RUT',
    invalidFormat: 'Formato incorrecto',
    invalidCheckDigit: 'RUT no válido'
  }
})
```

## Cambiar formato de salida

```typescript
// Para mostrar al usuario
const displaySchema = createRutSchema({ outputFormat: 'formatted' })
displaySchema.parse('189726317')
// '18.972.631-7'

// Para APIs que requieren solo números
const apiSchema = createRutSchema({ outputFormat: 'clean' })
apiSchema.parse('18.972.631-7')
// '189726317'
```

---

→ Ver referencia completa en [API rut-kit/zod](/api/rut-kit-zod)
