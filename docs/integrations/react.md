# React + React Hook Form

Integración con React Hook Form usando el schema de Zod para validación automática.

::: code-group
```bash [npm]
npm install rut-kit zod react-hook-form @hookform/resolvers
```
```bash [pnpm]
pnpm add rut-kit zod react-hook-form @hookform/resolvers
```
```bash [bun]
bun add rut-kit zod react-hook-form @hookform/resolvers
```
:::

## Con Zod

La forma más simple de integrar rut-kit con React Hook Form es usando el resolver de Zod. El schema valida automáticamente y los mensajes de error aparecen en `errors`.

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { rutSchema } from "rut-kit/zod"

const schema = z.object({
  rut: rutSchema
})

function Form() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register("rut")} />
      {errors.rut && <span>{errors.rut.message}</span>}
      <button type="submit">Enviar</button>
    </form>
  )
}
```

Cuando el formulario se envía exitosamente, `data.rut` ya viene formateado y validado.

## Sin Zod

Si prefieres no usar Zod, puedes validar manualmente con las funciones core. Útil para formularios simples o cuando ya tienes otra lógica de validación.

```tsx
import { useState } from "react"
import { validateRut, getErrorMessage } from "rut-kit"

function Form() {
  const [error, setError] = useState<string | null>(null)

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const result = validateRut(e.target.value)
    setError(result.valid ? null : getErrorMessage(result.error))
  }

  return (
    <div>
      <input onBlur={handleBlur} />
      {error && <span>{error}</span>}
    </div>
  )
}
```

En este caso, validas en `onBlur` para dar feedback inmediato sin interrumpir mientras el usuario escribe.
