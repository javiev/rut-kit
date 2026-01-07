# Validación

rut-kit ofrece dos formas de validar RUTs: una simple que retorna `true/false`, y una detallada que indica el tipo de error.

## Validación Simple

Usa `isValidRut` cuando solo necesitas saber si el RUT es válido:

```typescript
import { isValidRut } from "rut-kit"

isValidRut("18.972.631-7")  // true
isValidRut("18.972.631-0")  // false
isValidRut("18.abc.631-7")  // false
```

Acepta cualquier formato de entrada: con puntos, sin puntos, con guión, sin guión.

::: tip Limpieza automática
Se eliminan puntos, guiones, espacios, comas y ceros iniciales. Ideal para datos copiados desde otras fuentes.
:::

## Validación Detallada

Usa `validateRut` cuando necesitas saber *por qué* un RUT es inválido:

```typescript
import { validateRut } from "rut-kit"

validateRut("18.972.631-7")
// { valid: true, rut: "189726317" }

validateRut("18.972.631-0")
// { valid: false, error: "invalidCheckDigit" }

validateRut("18.abc.631-7")
// { valid: false, error: "invalidChars" }

validateRut("123")
// { valid: false, error: "invalidFormat" }
```

Cuando el RUT es válido, retorna el RUT limpio (sin puntos ni guiones). Cuando es inválido, indica el tipo de error.

## Tipos de Error

| Error | Significado |
|-------|-------------|
| `invalidChars` | Contiene letras (excepto K) u otros caracteres |
| `invalidFormat` | Largo incorrecto o estructura inválida |
| `invalidCheckDigit` | El dígito verificador no coincide |

## Mensajes de Error

Usa `getErrorMessage` para convertir el tipo de error a un mensaje legible. Los mensajes por defecto están en español.

```typescript
import { validateRut, getErrorMessage } from "rut-kit"

const result = validateRut("18.972.631-0")

if (!result.valid) {
  getErrorMessage(result.error)
  // "Dígito verificador incorrecto"
}
```

### Mensajes Personalizados

Puedes personalizar los mensajes pasando un objeto. Solo incluye los que quieras cambiar:

```typescript
const messages = {
  invalidChars: "Solo se permiten números y la letra K",
  invalidFormat: "El formato del RUT es incorrecto",
  invalidCheckDigit: "El RUT ingresado no es válido"
}

getErrorMessage(result.error, messages)
```

### Mensajes por Defecto

| Error | Mensaje |
|-------|---------|
| `invalidChars` | "RUT contiene caracteres inválidos" |
| `invalidFormat` | "Formato de RUT inválido" |
| `invalidCheckDigit` | "Dígito verificador incorrecto" |
