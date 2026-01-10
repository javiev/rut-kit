# Validación

rut-kit ofrece dos formas de validar RUTs según lo que necesites saber.

## ¿Solo necesitas saber si es válido?

Usa `isValidRut`:

```typescript
import { isValidRut } from 'rut-kit'

if (isValidRut(input)) {
  // RUT válido
}
```

## ¿Necesitas saber qué falló?

Usa `validateRut` + `getErrorMessage`:

```typescript
import { validateRut, getErrorMessage } from 'rut-kit'

const result = validateRut(input)

if (result.valid) {
  console.log(result.rut) // RUT limpio: '189726317'
} else {
  console.log(getErrorMessage(result.error))
  // 'Formato de RUT inválido' o 'Dígito verificador incorrecto'
}
```

## ¿Tienes datos con separadores raros?

Si recibes RUTs de Excel, PDFs u otras fuentes con comas o asteriscos, limpia primero:

```typescript
import { cleanRut, validateRut } from 'rut-kit'

const dirty = '18,972,631-7'
const clean = cleanRut(dirty)  // '189726317'
validateRut(clean)             // { valid: true, rut: '189726317' }
```

::: tip Permisivo vs Estricto
- `cleanRut()` es **permisivo**: acepta cualquier separador
- `validateRut()` es **estricto**: solo formatos chilenos válidos

Flujo recomendado para datos sucios: `cleanRut()` → `validateRut()`
:::

## Mensajes personalizados

Puedes cambiar los mensajes de error:

```typescript
getErrorMessage(result.error, {
  invalidFormat: 'Revisa el formato del RUT',
  invalidCheckDigit: 'El RUT no es válido'
})
```

---

→ Ver referencia completa en [API rut-kit](/api/rut-kit)
