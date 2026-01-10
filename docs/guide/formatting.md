# Formateo

Los RUTs chilenos se escriben de varias formas: con puntos, sin puntos, con guión, sin guión. rut-kit acepta cualquier formato de entrada y te permite elegir el formato de salida.

::: tip Permisivo vs Estricto
Las funciones de **formateo** (`cleanRut`, `formatRut`) son **permisivas**: aceptan cualquier separador (puntos, comas, asteriscos, etc.).

Las funciones de **validación** (`isValidRut`, `validateRut`) son **estrictas**: solo aceptan formatos válidos chilenos.
:::

## Formatos Disponibles

| Formato | Ejemplo | Uso recomendado |
|---------|---------|-----------------|
| Default | `18972631-7` | Almacenamiento en base de datos |
| Formatted | `18.972.631-7` | Mostrar al usuario |
| Clean | `189726317` | Comparaciones, APIs externas |

## formatRut

Convierte un RUT al formato especificado:

```typescript
import { formatRut } from 'rut-kit'

formatRut('189726317')              // '18972631-7' (default)
formatRut('189726317', 'formatted') // '18.972.631-7'
formatRut('189726317', 'clean')     // '189726317'
```

Acepta cualquier entrada (usa `cleanRut()` internamente):

```typescript
formatRut('18.972.631-7')            // '18972631-7'
formatRut('18972631-7', 'formatted') // '18.972.631-7'

// También acepta separadores no estándar
formatRut('18,972,631-7', 'formatted') // '18.972.631-7'
formatRut('18*972*631*7', 'clean')     // '189726317'
```

El formato default (sin puntos, con guión) es una buena opción para almacenar en base de datos: es compacto pero mantiene la separación visual del dígito verificador.

## cleanRut

Remueve **cualquier** carácter no alfanumérico. La K se convierte a mayúscula. También elimina ceros iniciales.

```typescript
import { cleanRut } from 'rut-kit'

cleanRut('18.972.631-7')  // '189726317'
cleanRut('18972631-7')    // '189726317'
cleanRut('33.333.335-k')  // '33333335K'

// Acepta separadores no estándar
cleanRut('18,972,631-7')  // '189726317'
cleanRut('18*972*631*7')  // '189726317'
cleanRut('00.12.213.359-1')  // '122133591' (elimina ceros iniciales)
```

Ideal para limpiar datos copiados de Excel, PDFs u otras fuentes que pueden usar separadores no estándar.

## getRutCheckDigit

Calcula el dígito verificador para un número de RUT. Útil para generar RUTs válidos en tests o validar manualmente.

```typescript
import { getRutCheckDigit } from 'rut-kit'

getRutCheckDigit('18972631')  // '7'
getRutCheckDigit('33333335')  // 'K'
getRutCheckDigit('11111111')  // '1'
```

El dígito verificador se calcula usando el algoritmo módulo 11, estándar en Chile.
