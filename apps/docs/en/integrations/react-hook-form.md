---
outline: deep
---

# React Hook Form + Zod

Integration with React Hook Form using the Zod schema for automatic validation.

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

## Basic Validation

The simplest way to integrate rut-kit with React Hook Form is using the Zod resolver. The schema validates automatically and error messages appear in `errors`.

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { rutSchema } from 'rut-kit/zod'

const schema = z.object({
  rut: rutSchema
})

function Form() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: { rut: '' }
  })

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register('rut')} />
      {errors.rut && <span>{errors.rut.message}</span>}
      <button type='submit'>Submit</button>
    </form>
  )
}
```

When the form submits successfully, `data.rut` is already formatted and validated.

::: tip
Use `rutSchema` with `reValidateMode: 'onSubmit'` to avoid premature errors while the user is typing. If the field is required, validate it on `onSubmit` or use a wrapper schema.
:::

## Real-Time Validation

If you want the input to show the formatted RUT while the user types, there are two main approaches:

### Destructuring onChange

Extract the `onChange` from `register` and combine it with `formatRut`:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { rutSchema } from 'rut-kit/zod'
import { formatRut } from 'rut-kit'

const schema = z.object({
  rut: rutSchema
})

function Form() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: { rut: '' }
  })

  const { onChange, ...rest } = register('rut')

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input
        {...rest}
        onChange={async (e) => {
          const formatted = formatRut(e.target.value, 'formatted')
          setValue('rut', formatted, { shouldValidate: false })
          await onChange(e)
        }}
      />
      {errors.rut && <span>{errors.rut.message}</span>}
      <button type='submit'>Submit</button>
    </form>
  )
}
```

**Features:**
- More direct with less code
- Perfect for simple transformations
- You must call `onChange(e)` manually to maintain React Hook Form's state

### Controller

Use React Hook Form's `Controller` component for more control:

```tsx
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { rutSchema } from 'rut-kit/zod'
import { formatRut } from 'rut-kit'

const schema = z.object({
  rut: rutSchema
})

function Form() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: { rut: '' }
  })

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <Controller
        name='rut'
        control={control}
        render={({ field }) => (
          <input
            {...field}
            onChange={(e) => {
              const formatted = formatRut(e.target.value, 'formatted')
              field.onChange(formatted)
            }}
          />
        )}
      />
      {errors.rut && <span>{errors.rut.message}</span>}
      <button type='submit'>Submit</button>
    </form>
  )
}
```

**Features:**
- Official React Hook Form approach
- Greater control over field behavior
- Better for integrating with third-party UI libraries (Material UI, Base UI, etc.)
- `field.onChange()` automatically handles internal state

::: tip
Use `formatRut(value, 'formatted')` to show the RUT with dots and dash (`12.345.678-9`) while the user types. The Zod schema will normalize the format when submitting the form.
:::