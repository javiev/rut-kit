# rut-kit

Funciones core para validar, formatear y trabajar con RUTs chilenos. Sin dependencias.

## Instalación

::: code-group
```bash [npm]
npm install rut-kit
```
```bash [pnpm]
pnpm add rut-kit
```
```bash [bun]
bun add rut-kit
```
:::

## Importación

Importa solo las funciones que necesites:

```typescript
import { isValidRut, validateRut, formatRut } from "rut-kit"
```

O todas las funciones disponibles:

```typescript
import {
  isValidRut,
  validateRut,
  formatRut,
  cleanRut,
  getRutCheckDigit,
  getErrorMessage
} from "rut-kit"
```

---

## `isValidRut()`

Retorna `true` si el RUT es válido, `false` si no. Útil para validaciones simples donde no necesitas saber el tipo de error.

```typescript
isValidRut("18.972.631-7")  // true
isValidRut("18.972.631-0")  // false
isValidRut("18.abc.631-7")  // false
```

Acepta cualquier formato de entrada: con puntos, sin puntos, con guión, sin guión.

---

## `validateRut()`

Valida un RUT y retorna información detallada. Si es válido, incluye el RUT limpio. Si es inválido, indica el tipo de error.

```typescript
validateRut("18.972.631-7")
// { valid: true, rut: "189726317" }

validateRut("18.972.631-0")
// { valid: false, error: "invalidCheckDigit" }

validateRut("18.abc.631-7")
// { valid: false, error: "invalidChars" }

validateRut("123")
// { valid: false, error: "invalidFormat" }
```

**Tipos de error:**
| Error | Cuándo ocurre |
|-------|---------------|
| `invalidChars` | Contiene caracteres no permitidos |
| `invalidFormat` | Estructura o largo incorrecto |
| `invalidCheckDigit` | Dígito verificador no coincide |

---

## `formatRut()`

Convierte un RUT al formato especificado. Útil para normalizar RUTs antes de guardar o mostrar.

```typescript
formatRut("189726317")              // "18972631-7" (default)
formatRut("189726317", "formatted") // "18.972.631-7"
formatRut("189726317", "clean")     // "189726317"
```

El formato default (sin puntos, con guión) es recomendado para almacenamiento.

---

## `cleanRut()`

Remueve puntos, guiones, espacios y comas de un RUT. La K se convierte a mayúscula. También elimina ceros iniciales.

```typescript
cleanRut("18.972.631-7")  // "189726317"
cleanRut("18972631-7")    // "189726317"
cleanRut("33.333.335-k")  // "33333335K"
```

---

## `getRutCheckDigit()`

Calcula el dígito verificador para un número de RUT (sin el dígito). Útil para generar RUTs válidos en tests.

```typescript
getRutCheckDigit("18972631")  // "7"
getRutCheckDigit("33333335")  // "K"
```

---

## `getErrorMessage()`

Convierte un tipo de error a un mensaje legible. Los mensajes por defecto están en español.

```typescript
const result = validateRut("18.972.631-0")

if (!result.valid) {
  getErrorMessage(result.error)
  // "Dígito verificador incorrecto"
}
```

Puedes personalizar los mensajes. Solo incluye los que quieras cambiar:

```typescript
getErrorMessage(result.error, {
  invalidCheckDigit: "El RUT ingresado no es válido"
})
```

**Mensajes por defecto:**

| Error | Mensaje |
|-------|---------|
| `invalidChars` | "RUT contiene caracteres inválidos" |
| `invalidFormat` | "Formato de RUT inválido" |
| `invalidCheckDigit` | "Dígito verificador incorrecto" |
