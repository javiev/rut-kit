import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "rut-kit 🇨🇱",
  description: "Validación de RUT chileno con errores detallados para JavaScript y TypeScript",
  lang: 'es',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Guía', link: '/guide/getting-started' },
      { text: 'API', link: '/api/rut-kit' },
      { text: 'Integraciones', link: '/integrations/react' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guía',
          items: [
            { text: 'Inicio Rápido', link: '/guide/getting-started' },
            { text: 'Validación', link: '/guide/validation' },
            { text: 'Formateo', link: '/guide/formatting' },
            { text: 'Zod', link: '/guide/zod' }
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
            { text: 'React + React Hook Form', link: '/integrations/react' },
            { text: 'Next.js (App Router)', link: '/integrations/nextjs' },
            { text: 'Express & Hono', link: '/integrations/backend' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/javiev/rut-kit' }
    ],

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

    // editLink: {
    //   pattern: 'https://github.com/javiev/rut-kit/edit/main/docs/:path',
    //   text: 'Editar esta página en GitHub'
    // },

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
      message: 'Liberado bajo licencia ¿?',
      copyright: 'Copyright © 2026-presente'
    }
  },

  head: [
    ['link', { rel: 'icon', href: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🇨🇱</text></svg>' }]
  ]
})
