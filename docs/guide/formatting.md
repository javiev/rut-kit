# Formateo

Los RUTs chilenos se escriben de varias formas. rut-kit te permite normalizar cualquier entrada al formato que necesites.

## ¿Qué formato usar?

| Formato | Ejemplo | Cuándo usarlo |
|---------|---------|---------------|
| Default | `18972631-7` | Guardar en base de datos |
| Formatted | `18.972.631-7` | Mostrar al usuario |
| Clean | `189726317` | Comparaciones, APIs externas |

## Formatear para mostrar

```typescript
import { formatRut } from 'rut-kit'

const rut = '189726317'
formatRut(rut, 'formatted') // '18.972.631-7'
```

## Formatear para guardar

```typescript
formatRut('18.972.631-7') // '18972631-7' (default)
```

## Limpiar datos sucios

Si tienes RUTs de Excel, PDFs u otras fuentes con separadores raros:

```typescript
import { cleanRut } from 'rut-kit'

cleanRut('18,972,631-7')  // '189726317'
cleanRut('18*972*631*7')  // '189726317'
cleanRut('33.333.335-k')  // '33333335K'
```

::: tip
`cleanRut()` es permisivo: elimina cualquier carácter que no sea dígito o K. Ideal para normalizar datos antes de validar.
:::

## Calcular dígito verificador

Para generar RUTs en tests:

```typescript
import { getRutCheckDigit } from 'rut-kit'

getRutCheckDigit('18972631') // '7'
getRutCheckDigit('33333335') // 'K'
```

---

→ Ver referencia completa en [API rut-kit](/api/rut-kit)
