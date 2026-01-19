---
layout: home

hero:
  name: 'rut-kit 🇨🇱'
  text: 'Validación de RUT chileno'
  tagline: 'Rápido, liviano, con errores descriptivos y soporte para Zod.'
  image:
    src: /new-rut-kit.png
    alt: rut-kit
  actions:
    - theme: brand
      text: Comenzar
      link: /guide/getting-started
    - theme: alt
      text: Ver en GitHub
      link: https://github.com/javiev/rut-kit

features:
  - icon: 🎯
    title: Errores Descriptivos
    details: Te dice exactamente qué falló (formato o dígito verificador) en lugar de solo true/false.

  - icon: ⚡
    title: Ultraliviano
    details: 960 bytes gzipped. Sin dependencias. Solo lo esencial.
    link: https://bundlephobia.com/package/rut-kit

  - icon: 🌍
    title: Multi-runtime
    details: Funciona en Node.js, Bun, Edge y el navegador.

  - icon: 🛡️
    title: Integración Zod
    details: Schema listo para formularios y APIs. Valida, transforma y formatea en un paso.
---
