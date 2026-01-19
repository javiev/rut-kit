import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'
import pkg from '../../../packages/rut-kit/package.json'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "rut-kit 🇨🇱",
  description: "Chilean RUT validation with descriptive errors for JavaScript and TypeScript",

  vite: {
    plugins: [
      llmstxt({
        ignoreFiles: [
          'index.md',
          'guide/**',
          'api/**',
          'integrations/**',
          'README.md',
          'en/index.md'
        ],
        customLLMsTxtTemplate: `# rut-kit

> Chilean RUT validation with descriptive errors for JavaScript and TypeScript

Fast, lightweight, with Zod support.

## Documentation

{toc}`
      })
    ]
  },

  locales: {
    root: {
      label: 'Español',
      lang: 'es',
      title: "rut-kit 🇨🇱",
      description: "Validación de RUT chileno con errores detallados para JavaScript y TypeScript",
      themeConfig: {
        nav: [
          { text: 'Inicio', link: '/' },
          { text: 'Guía', link: '/guide/getting-started' },
          { text: 'Integraciones', link: '/integrations/react' },
          { text: 'API', link: '/api/rut-kit' },
          { text: `v${pkg.version}`, link: 'https://github.com/javiev/rut-kit/releases' }
        ],
        sidebar: {
          '/guide/': [
            {
              text: 'Guía',
              items: [
                { text: 'Inicio Rápido', link: '/guide/getting-started' },
                { text: 'Validación', link: '/guide/validation' },
                { text: 'Formateo', link: '/guide/formatting' },
                { text: 'Zod', link: '/guide/zod' },
                { text: 'LLMs', link: '/guide/llms' }
              ]
            }
          ],
          '/api/': [
            {
              text: 'Referencia API',
              items: [
                { text: 'rut-kit', link: '/api/rut-kit' },
                { text: 'rut-kit/zod', link: '/api/rut-kit-zod' }
              ]
            }
          ],
          '/integrations/': [
            {
              text: 'Integraciones',
              items: [
                { text: 'React', link: '/integrations/react' },
                { text: 'React Hook Form + Zod', link: '/integrations/react-hook-form' },
                { text: 'Next.js (App Router)', link: '/integrations/nextjs' },
                { text: 'Express & Hono', link: '/integrations/backend' }
              ]
            }
          ]
        },
        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: 'Buscar', buttonAriaLabel: 'Buscar' },
              modal: {
                noResultsText: 'No se encontraron resultados',
                resetButtonTitle: 'Limpiar búsqueda',
                footer: { selectText: 'seleccionar', navigateText: 'navegar', closeText: 'cerrar' }
              }
            }
          }
        },
        docFooter: {
          prev: 'Anterior',
          next: 'Siguiente'
        },
        outline: {
          label: 'En esta página'
        },
        lastUpdated: {
          text: 'Actualizado el'
        },
        returnToTopLabel: 'Volver arriba',
        darkModeSwitchLabel: 'Apariencia',
        sidebarMenuLabel: 'Menú',
        footer: {
          message: 'Liberado bajo <a href="https://github.com/javiev/rut-kit/blob/main/LICENSE">Licencia MIT</a>',
          copyright: 'Copyright © 2026'
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      title: "rut-kit 🇨🇱",
      description: "Chilean RUT validation with descriptive errors for JavaScript and TypeScript",
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/guide/getting-started' },
          { text: 'Integrations', link: '/en/integrations/react' },
          { text: 'API', link: '/en/api/rut-kit' },
          { text: `v${pkg.version}`, link: 'https://github.com/javiev/rut-kit/releases' }
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Guide',
              items: [
                { text: 'Getting Started', link: '/en/guide/getting-started' },
                { text: 'Validation', link: '/en/guide/validation' },
                { text: 'Formatting', link: '/en/guide/formatting' },
                { text: 'Zod', link: '/en/guide/zod' },
                { text: 'LLMs', link: '/en/guide/llms' }
              ]
            }
          ],
          '/en/api/': [
            {
              text: 'API Reference',
              items: [
                { text: 'rut-kit', link: '/en/api/rut-kit' },
                { text: 'rut-kit/zod', link: '/en/api/rut-kit-zod' }
              ]
            }
          ],
          '/en/integrations/': [
            {
              text: 'Integrations',
              items: [
                { text: 'React', link: '/en/integrations/react' },
                { text: 'React Hook Form + Zod', link: '/en/integrations/react-hook-form' },
                { text: 'Next.js (App Router)', link: '/en/integrations/nextjs' },
                { text: 'Express & Hono', link: '/en/integrations/backend' }
              ]
            }
          ]
        },
        docFooter: {
          prev: 'Previous',
          next: 'Next'
        },
        outline: {
          label: 'On this page'
        },
        lastUpdated: {
          text: 'Last updated'
        },
        returnToTopLabel: 'Back to top',
        darkModeSwitchLabel: 'Appearance',
        sidebarMenuLabel: 'Menu',
        footer: {
          message: 'Released under the <a href="https://github.com/javiev/rut-kit/blob/main/LICENSE">MIT License</a>',
          copyright: 'Copyright © 2026'
        }
      }
    }
  },

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/javiev/rut-kit' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/rut-kit' }
    ],

    search: {
      provider: 'local'
    }
  },

  head: [
    ['link', { rel: 'icon', href: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🇨🇱</text></svg>' }]
  ]
})
