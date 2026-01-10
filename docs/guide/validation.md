# Validación

rut-kit ofrece dos formas de validar RUTs: una simple que retorna `true/false`, y una detallada que indica el tipo de error.

## Validación Simple

Usa `isValidRut` cuando solo necesitas saber si el RUT es válido:

```typescript
import { isValidRut } from 'rut-kit'

isValidRut('18.972.631-7')  // true
isValidRut('18972631-7')    // true
isValidRut('189726317')     // true

isValidRut('18.972.631-0')  // false (dígito verificador incorrecto)
isValidRut('18.abc.631-7')  // false (formato inválido)
isValidRut('18,972,631-7')  // false (comas no permitidas)
```

::: warning Validación Estricta
La validación **solo acepta formatos válidos chilenos**:
- Con puntos: `18.972.631-7`
- Con guión: `18972631-7`
- Sin formato: `189726317`

Otros separadores (comas, asteriscos, etc.) son rechazados. Para limpiar y formatear datos permisivamente, usa `cleanRut()` o `formatRut()` antes de validar.
:::

::: tip RUT Mínimo
Solo se aceptan RUTs desde **1.000.000** (7 dígitos + verificador). RUTs más cortos son rechazados.
:::

## Validación Detallada

Usa `validateRut` cuando necesitas saber *por qué* un RUT es inválido:

```typescript
import { validateRut } from 'rut-kit'

validateRut('18.972.631-7')
// { valid: true, rut: '189726317' }

validateRut('18.972.631-0')
// { valid: false, error: 'invalidCheckDigit' }

validateRut('18,972,631-7')
// { valid: false, error: 'invalidFormat' }

validateRut('123')
// { valid: false, error: 'invalidFormat' }
```

Cuando el RUT es válido, retorna el RUT limpio (sin puntos ni guiones). Cuando es inválido, indica el tipo de error.

::: tip Limpieza de Datos
Si recibes RUTs con separadores no estándar (comas, asteriscos, etc.), usa `cleanRut()` primero:

```typescript
const dirty = '18,972,631-7'
const clean = cleanRut(dirty)  // '189726317'
validateRut(clean)             // { valid: true, rut: '189726317' }
```
:::

## Tipos de Error

| Error | Cuándo ocurre |
|-------|---------------|
| `invalidFormat` | Formato no válido, largo incorrecto, o caracteres no permitidos |
| `invalidCheckDigit` | El dígito verificador no coincide |

## Mensajes de Error

Usa `getErrorMessage` para convertir el tipo de error a un mensaje legible. Los mensajes por defecto están en español.

```typescript
import { validateRut, getErrorMessage } from 'rut-kit'

const result = validateRut('18.972.631-0')

if (!result.valid) {
  getErrorMessage(result.error)
  // 'Dígito verificador incorrecto'
}
```

### Mensajes Personalizados

Puedes personalizar los mensajes pasando un objeto. Solo incluye los que quieras cambiar:

```typescript
const messages = {
  invalidFormat: 'El formato del RUT es incorrecto',
  invalidCheckDigit: 'El RUT ingresado no es válido'
}

getErrorMessage(result.error, messages)
```

### Mensajes por Defecto

| Error | Mensaje |
|-------|---------|
| `invalidFormat` | 'Formato de RUT inválido' |
| `invalidCheckDigit` | 'Dígito verificador incorrecto' |
