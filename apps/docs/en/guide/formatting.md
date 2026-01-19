# Formatting

Chilean RUTs are written in various ways. rut-kit lets you normalize any input to the format you need.

## Which format to use?

| Format | Example | When to use |
|--------|---------|-------------|
| Default | `18972631-7` | Store in database |
| Formatted | `18.972.631-7` | Display to user |
| Clean | `189726317` | Comparisons, external APIs |

## Format for display

```typescript
import { formatRut } from 'rut-kit'

const rut = '189726317'
formatRut(rut, 'formatted') // '18.972.631-7'
```

## Format for storage

```typescript
formatRut('18.972.631-7') // '18972631-7' (default)
```

## Clean dirty data

If you have RUTs from Excel, PDFs, or other sources with unusual separators:

```typescript
import { cleanRut } from 'rut-kit'

cleanRut('18,972,631-7')  // '189726317'
cleanRut('18*972*631*7')  // '189726317'
cleanRut('33.333.335-k')  // '33333335K'
```

::: tip
`cleanRut()` is permissive: it removes any character that isn't a digit or K. Ideal for normalizing data before validation.
:::

## Calculate check digit

For generating RUTs in tests:

```typescript
import { getRutCheckDigit } from 'rut-kit'

getRutCheckDigit('18972631') // '7'
getRutCheckDigit('33333335') // 'K'
```

---

→ See full reference at [API rut-kit](/en/api/rut-kit)