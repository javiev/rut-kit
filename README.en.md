# rut-kit 🇨🇱

[![Español](https://img.shields.io/badge/lang-Español-red)](README.md)

Chilean RUT validation with descriptive errors for JavaScript and TypeScript. Fast, lightweight, with Zod support.

```ts
import { validateRut } from 'rut-kit'

validateRut('18.972.631-7')
// { valid: true, rut: '189726317' }

validateRut('18.972.631-0')
// { valid: false, error: 'invalidCheckDigit' }
```

## Installation

```bash
npm install rut-kit
# or
pnpm add rut-kit
# or
bun add rut-kit
```

With Zod:

```bash
npm install rut-kit zod
# or
pnpm add rut-kit zod
# or
bun add rut-kit zod
```

## Features

- **Descriptive Errors** 🎯 - Tells you what's wrong: invalid format or incorrect check digit.
- **[Ultra-lightweight](https://bundlephobia.com/package/rut-kit)** ⚡ - 960 bytes gzipped. No dependencies. Just the essentials.
- **Multi-runtime** 🌍 - Works in Node.js, Bun, Edge, and the browser.
- **Agnostic** 🔌 - Works with any framework: React, Vue, Svelte, Angular, etc.
- **Native TypeScript** 🔷 - Written in TypeScript. Types included. Full autocomplete.
- **Zod Integration** 🛡️ - Ready-to-use schema for forms and APIs. Validate, transform, and format in one step.

## Usage

### Simple Validation

```ts
import { isValidRut } from 'rut-kit'

isValidRut('18.972.631-7')  // true
isValidRut('18.972.631-0')  // false
```

### Validation with Details

```ts
import { validateRut } from 'rut-kit'

const result = validateRut('18.972.631-0')
// { valid: false, error: 'invalidCheckDigit' }
```

Possible errors: `invalidFormat` | `invalidCheckDigit`

### Formatting

```ts
import { formatRut } from 'rut-kit'

formatRut('189726317')              // '18972631-7'
formatRut('189726317', 'formatted') // '18.972.631-7'
formatRut('189726317', 'clean')     // '189726317'
```

### With Zod

```ts
import { rutSchema, createRutSchema } from 'rut-kit/zod'

// Default schema
rutSchema.parse('18.972.631-7')
// '18972631-7'

// Custom schema
const schema = createRutSchema({
  messages: { required: 'Enter your RUT' },
  outputFormat: 'formatted'
})
```

## Documentation

Visit the [full documentation](https://rut-kit.pages.dev/en/) for detailed guides and integrations with React, Next.js, Express, and more.

## License

MIT