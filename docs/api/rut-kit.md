# rut-kit

Referencia de la API core para validar, formatear y trabajar con RUTs chilenos.

```typescript
import { isValidRut, validateRut, formatRut, cleanRut, getRutCheckDigit, getErrorMessage } from 'rut-kit'
```

## isValidRut

Valida si un RUT chileno es válido.

```typescript
function isValidRut(rut: string): boolean
```

### Parámetros

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `rut` | `string` | RUT a validar |

### Retorno

`boolean` — `true` si el RUT es válido, `false` en caso contrario.

### Formatos aceptados

- Con puntos y guión: `18.972.631-7`
- Solo guión: `18972631-7`
- Sin formato: `189726317`

::: warning
Solo acepta formatos chilenos válidos. Otros separadores (comas, asteriscos) son rechazados. RUT mínimo: 1.000.000.
:::

### Ejemplo

```typescript
isValidRut('18.972.631-7')  // true
isValidRut('18.972.631-0')  // false
isValidRut('18,972,631-7')  // false
```

---

## validateRut

Valida un RUT y retorna información detallada del resultado.

```typescript
function validateRut(rut: string): RutValidationResult
```

### Parámetros

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `rut` | `string` | RUT a validar |

### Retorno

`RutValidationResult` — Objeto con el resultado de la validación:

```typescript
// Si es válido
{ valid: true, rut: string }

// Si es inválido
{ valid: false, error: RutValidationError }
```

### Tipos de error

| Error | Descripción |
|-------|-------------|
| `invalidFormat` | Formato no válido, largo incorrecto, o caracteres no permitidos |
| `invalidCheckDigit` | El dígito verificador no coincide |

### Ejemplo

```typescript
validateRut('18.972.631-7')
// { valid: true, rut: '189726317' }

validateRut('18.972.631-0')
// { valid: false, error: 'invalidCheckDigit' }

validateRut('18,972,631-7')
// { valid: false, error: 'invalidFormat' }
```

---

## formatRut

Formatea un RUT al formato especificado.

```typescript
function formatRut(rut: string, format?: RutOutputFormat): string
```

### Parámetros

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `rut` | `string` | RUT a formatear |
| `format` | `RutOutputFormat` | Formato de salida (opcional) |

### Formatos de salida

| Formato | Resultado | Uso recomendado |
|---------|-----------|-----------------|
| `undefined` (default) | `18972631-7` | Almacenamiento |
| `'formatted'` | `18.972.631-7` | Mostrar al usuario |
| `'clean'` | `189726317` | Comparaciones, APIs |

### Retorno

`string` — RUT formateado.

### Ejemplo

```typescript
formatRut('189726317')              // '18972631-7'
formatRut('189726317', 'formatted') // '18.972.631-7'
formatRut('189726317', 'clean')     // '189726317'
```

::: tip
Esta función es permisiva: acepta cualquier separador de entrada. Usa `cleanRut()` internamente.
:::

---

## cleanRut

Extrae solo los dígitos y la letra K de un RUT, removiendo cualquier otro carácter.

```typescript
function cleanRut(rut: string): string
```

### Parámetros

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `rut` | `string` | RUT a limpiar |

### Retorno

`string` — RUT limpio (solo dígitos y K en mayúscula). Elimina ceros iniciales.

### Ejemplo

```typescript
cleanRut('18.972.631-7')  // '189726317'
cleanRut('33.333.335-k')  // '33333335K'
cleanRut('18,972,631-7')  // '189726317'
cleanRut('18*972*631*7')  // '189726317'
```

::: tip
Función permisiva. Útil para limpiar datos de Excel, PDFs u otras fuentes con separadores no estándar.
:::

---

## getRutCheckDigit

Calcula el dígito verificador de un RUT usando el algoritmo módulo 11.

```typescript
function getRutCheckDigit(rut: string): string
```

### Parámetros

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `rut` | `string` | Cuerpo del RUT (sin dígito verificador) |

### Retorno

`string` — Dígito verificador calculado (`'0'`-`'9'` o `'K'`).

### Ejemplo

```typescript
getRutCheckDigit('18972631')  // '7'
getRutCheckDigit('33333335')  // 'K'
getRutCheckDigit('11111111')  // '1'
```

---

## getErrorMessage

Convierte un tipo de error a un mensaje legible.

```typescript
function getErrorMessage(error: RutValidationError, messages?: RutErrorMessages): string
```

### Parámetros

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `error` | `RutValidationError` | Tipo de error a convertir |
| `messages` | `RutErrorMessages` | Mensajes personalizados (opcional) |

### Retorno

`string` — Mensaje de error legible.

### Mensajes por defecto

| Error | Mensaje |
|-------|---------|
| `invalidFormat` | `'Formato de RUT inválido'` |
| `invalidCheckDigit` | `'Dígito verificador incorrecto'` |

### Ejemplo

```typescript
const result = validateRut('18.972.631-0')

if (!result.valid) {
  getErrorMessage(result.error)
  // 'Dígito verificador incorrecto'

  getErrorMessage(result.error, {
    invalidCheckDigit: 'RUT no válido'
  })
  // 'RUT no válido'
}
```

