# React

::: warning Framework Agnostic
**rut-kit** works with any JavaScript framework. These examples are for frameworks we've tested, but you can use it with Vue, Svelte, Angular, etc. in the same way.
:::

RUT validation in React using rut-kit's core functions. Ideal for simple forms without needing additional validation libraries.

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

## Validation with onBlur

Validates when the user leaves the field, without interrupting while typing:

```tsx
import { useState } from 'react'
import { getErrorMessage, validateRut } from 'rut-kit'

function Form() {
  const [rut, setRut] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const result = validateRut(e.target.value)
    setError(result.valid ? null : getErrorMessage(result.error))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = validateRut(rut)

    if (result.valid) {
      console.log({ rut: result.rut })
    } else {
      setError(getErrorMessage(result.error))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={rut}
        onChange={(e) => {
          setRut(e.target.value)
          setError(null)
        }}
        onBlur={handleBlur}
      />
      {error && <span>{error}</span>}
      <button type='submit'>Submit</button>
    </form>
  )
}
```

**Features:**
- Validates when user leaves the field
- Doesn't interrupt while user is typing
- Better UX for simple forms
- Uses `validateRut()` and `getErrorMessage()`

## Auto Formatting

Formats the RUT in real-time as the user types:

```tsx
import { useState } from 'react'
import { formatRut, getErrorMessage, validateRut } from 'rut-kit'

function Form() {
  const [rut, setRut] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value, 'formatted')
    setRut(formatted)
    setError(null)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = validateRut(rut)

    if (result.valid) {
      console.log({ rut })
    } else {
      setError(getErrorMessage(result.error))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={rut} onChange={handleChange} />
      {error && <span>{error}</span>}
      <button type='submit'>Submit</button>
    </form>
  )
}
```

**Features:**
- Real-time formatting with `formatRut()`
- Immediate visual feedback
- Validates on submit
- Always consistent format

::: tip
Auto formatting improves user experience by showing the correct format as they type, but only validates on submit to not interrupt the typing flow.
:::

## When to use React without libraries?

- Simple forms that don't need React Hook Form
- When you want full control over the validation flow
- Projects that don't require complex validation schemas
- For real-time validation (onChange, onBlur)

::: info
If you need more complex form validation, consider using [React Hook Form + Zod](/en/integrations/react-hook-form).
:::