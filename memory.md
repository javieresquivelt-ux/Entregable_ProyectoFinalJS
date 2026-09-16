# MEMORY: Registro Histórico y Decisiones Técnicas

## Bitácora de Sesión - Registro de Fases

### 1. Diagnóstico del Entorno Actual y Código Heredado
- **Compilador y Empaquetador:** Se cuenta con Vite v8.3.0 y Sass v1.104.1.
- **Detección de Anomalías en Sass:**
  - Al ejecutar una compilación de prueba (`npm run build`), Vite advirtió:
    ```
    /ellipse1.svg referenced in /ellipse1.svg didn't resolve at build time...
    /ellipse2.svg referenced in /ellipse2.svg didn't resolve at build time...
    ```
  - **Causa raíz:** Los archivos Sass heredados en `src/scss/layout/_header.scss` y `_hero.scss` hacían referencia a assets decorativos de un proyecto previo que no existían en este repositorio.
  - **Solución técnica ejecutada:** Se eliminaron los partials obsoletos (`_categories.scss`, `_hero.scss`), se creó la nueva arquitectura de layout (`_container.scss`, `_header.scss`, `_controls.scss`, `_grid.scss`), y se reemplazó la función deprecada `lighten()` por el color hex directo. Compilación limpia al 100% sin warnings.
- **Configuración de Despliegue (GitHub Pages):**
  - Se confirmó `base: './'` en `vite.config.js` para rutas relativas adecuadas.

---

### 2. Fase 1: Ejecutada y Verificada (Cimientos y Maquetación Base)
- **Estructura Sass modular completada:**
  - `src/scss/abstracts/`: Tokens de diseño temático Rick and Morty (verde portal `#97ce4c`, cian espacial `#00b5cc`, fondo cósmico `#0f111a`, sombras fluorescentes).
  - `src/scss/base/`: Reset limpio, tipografías Google Fonts (Inter + Orbitron), scrollbar temática y prevención de overflow horizontal.
  - `src/scss/components/`: Estilos para botones (`_buttons.scss`), tarjetas (`_cards.scss`), loader temático con animación de portal (`_loader.scss`), modal accesible (`_modal.scss`) y paginador (`_pagination.scss`).
  - `src/scss/layout/`: Contenedor fluido, header con badge, barra de controles responsive y grid adaptable (`auto-fill`, `minmax`).
- **Maquetación Semántica en `index.html`:**
  - Estructuración con elementos HTML5: `<header>`, `<section class="controls-section">`, `<main>`, `<div id="characters-grid">`, `<nav class="pagination-section">` y `<dialog id="character-modal">`.
  - Inclusión de metadatos SEO y accesibilidad (roles, `aria-label`, `aria-live="polite"`).
- **Resultado de Compilación:** `npm run build` genera el bundle en `dist/` en 330ms sin advertencias.

---

### 3. Razonamiento Técnico para la Fase 2: Servicio API y Renderizado Inicial
- **API Endpoint:** `https://rickandmortyapi.com/api/character`.
- **Comportamiento clave de la Rick and Morty API:**
  - Cuando una consulta con filtros no encuentra personajes, la API no devuelve una lista vacía `[]`, sino un código `HTTP 404` con `{ error: "There is nothing here" }`.
  - **Decisión técnica:** En `api.js`, debemos interceptar este `404` específico y transformarlo en un objeto seguro `{ info: { count: 0, pages: 0, next: null, prev: null }, results: [] }` para que el flujo de la aplicación no se quiebre con excepciones no controladas.
- **Manejo del Loader (UX):**
  - Al iniciar cualquier petición a la red, se inyecta en `#characters-grid` el portal giratorio verde con la clase `.portal-loader`.
  - Una vez resuelta la promesa, se sustituye por las tarjetas o por el mensaje de estado correspondiente.
- **Componente Puro de Tarjeta (`CharacterCard.js`):**
  - Para seguir las mejores prácticas de mantenibilidad y pruebas, cada tarjeta se generará a través de una función que toma el objeto del personaje y su estado de favorito, devolviendo un template string HTML enriquecido con datos semánticos.

---

### 4. Estado Actual
- **Fase 1 completada con éxito.**
- **En pausa a la espera de la confirmación explícita del usuario para iniciar la Fase 2.**
