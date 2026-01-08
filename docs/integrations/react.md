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

## Validación con Zod

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
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: { rut: "" }
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

::: tip
Usa `rutSchema` con `reValidateMode: "onSubmit"` para evitar errores prematuros mientras el usuario escribe. Si el campo es requerido, valídalo en el `onSubmit` o usa un schema wrapper.
:::

### Formateo en Tiempo Real

Si quieres que el input muestre el RUT formateado mientras el usuario escribe, hay dos enfoques principales:

#### Enfoque 1: Destructuring onChange

Extrae el `onChange` de `register` y combínalo con `formatRut`:

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { rutSchema } from "rut-kit/zod"
import { formatRut } from "rut-kit"

const schema = z.object({
  rut: rutSchema
})

function Form() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: { rut: "" }
  })

  const { onChange, ...rest } = register("rut")

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input
        {...rest}
        onChange={async (e) => {
          const formatted = formatRut(e.target.value, "formatted")
          setValue("rut", formatted, { shouldValidate: false })
          await onChange(e)
        }}
      />
      {errors.rut && <span>{errors.rut.message}</span>}
      <button type="submit">Enviar</button>
    </form>
  )
}
```

**Características:**
- Más directo y con menos código
- Perfecto para transformaciones simples
- Debes llamar `onChange(e)` manualmente para mantener el estado de React Hook Form

#### Enfoque 2: Controller

Usa el componente `Controller` de React Hook Form para mayor control:

```tsx
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { rutSchema } from "rut-kit/zod"
import { formatRut } from "rut-kit"

const schema = z.object({
  rut: rutSchema
})

function Form() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: { rut: "" }
  })

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <Controller
        name="rut"
        control={control}
        render={({ field }) => (
          <input
            {...field}
            onChange={(e) => {
              const formatted = formatRut(e.target.value, "formatted")
              field.onChange(formatted)
            }}
          />
        )}
      />
      {errors.rut && <span>{errors.rut.message}</span>}
      <button type="submit">Enviar</button>
    </form>
  )
}
```

**Características:**
- Enfoque oficial de React Hook Form
- Mayor control sobre el comportamiento del campo
- Mejor para integrar con librerías de UI de terceros (Material UI, Chakra, etc.)
- `field.onChange()` maneja automáticamente el estado interno

::: tip
Usa `formatRut(value, "formatted")` para mostrar el RUT con puntos y guión (`12.345.678-9`) mientras el usuario escribe. El schema de Zod normalizará el formato al enviar el formulario.
:::

## Validación sin Zod

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
