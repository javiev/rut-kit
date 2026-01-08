# rut-kit 🇨🇱

Validación de RUT chileno con errores descriptivos para JavaScript y TypeScript. Rápido, liviano, con soporte para Zod.

```ts
import { validateRut } from 'rut-kit'

validateRut('18.972.631-7')
// { valid: true, rut: '189726317' }

validateRut('18.972.631-0')
// { valid: false, error: 'invalidCheckDigit' }
```

## Instalación

```bash
npm install rut-kit
# o
pnpm add rut-kit
# o
bun add rut-kit
```

Con Zod:

```bash
npm install rut-kit zod
# o
pnpm add rut-kit zod
# o
bun add rut-kit zod
```

## Características

- **Errores Descriptivos** 🎯 - Indica qué está mal: caracteres inválidos, formato incorrecto o dígito verificador erróneo.
- **Ultraliviano** ⚡ - 960 bytes gzipped. Sin dependencias. Solo lo esencial.
- **Multi-runtime** 🌍 - Funciona en Node.js, Bun, Edge y el navegador.
- **TypeScript Nativo** 🔷 - Escrito en TypeScript. Tipos incluidos. Autocompletado completo.
- **Integración Zod** 🛡️ - Schema listo para formularios y APIs. Valida, transforma y formatea en un paso.

## Uso

### Validación Simple

```ts
import { isValidRut } from 'rut-kit'

isValidRut('18.972.631-7')  // true
isValidRut('18.972.631-0')  // false
```

### Validación con Detalles

```ts
import { validateRut } from 'rut-kit'

const result = validateRut('18.972.631-0')
// { valid: false, error: 'invalidCheckDigit' }
```

Errores posibles: `invalidFormat` | `invalidCheckDigit`

### Formateo

```ts
import { formatRut } from 'rut-kit'

formatRut('189726317')              // '18972631-7'
formatRut('189726317', 'formatted') // '18.972.631-7'
formatRut('189726317', 'clean')     // '189726317'
```

### Con Zod

```ts
import { rutSchema, createRutSchema } from 'rut-kit/zod'

// Schema por defecto
rutSchema.parse('18.972.631-7')
// '18972631-7'

// Schema personalizado
const schema = createRutSchema({
  messages: { required: 'Ingresa tu RUT' },
  outputFormat: 'formatted'
})
```

## Documentación

Visita la [documentación completa](https://javiev.github.io/rut-kit/) para guías detalladas e integraciones con React, Next.js, Express y más.