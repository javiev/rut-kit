# React

::: warning Librería Agnóstica
**rut-kit** funciona con cualquier framework de JavaScript. Estos ejemplos son para los frameworks que hemos probado, pero puedes usarla en Vue, Svelte, Angular, etc. de la misma forma.
:::

Validación de RUT en React usando las funciones core de rut-kit. Ideal para formularios simples sin necesidad de librerías de validación adicionales.

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

## Validación con onBlur

Valida cuando el usuario sale del campo, sin interrumpir mientras escribe:

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
      <button type='submit'>Enviar</button>
    </form>
  )
}
```

**Características:**
- Valida cuando el usuario sale del campo
- No interrumpe mientras el usuario escribe
- Mejor UX para formularios simples
- Usa `validateRut()` y `getErrorMessage()`

## Formateo Automático

Formatea el RUT en tiempo real mientras el usuario escribe:

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
      <button type='submit'>Enviar</button>
    </form>
  )
}
```

**Características:**
- Formatea en tiempo real con `formatRut()`
- Feedback visual inmediato
- Valida al hacer submit
- Formato siempre consistente

::: tip
El formateo automático mejora la experiencia del usuario al mostrar el formato correcto mientras escribe, pero valida solo al enviar para no interrumpir el flujo de escritura.
:::

## ¿Cuándo usar React sin librerías?

- Formularios simples que no necesitan React Hook Form
- Cuando quieres control total sobre el flujo de validación
- Proyectos que no requieren schemas de validación complejos
- Para validación en tiempo real (onChange, onBlur)

::: info
Si necesitas validación de formularios más compleja, considera usar [React Hook Form + Zod](/integrations/react-hook-form).
:::