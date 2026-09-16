# TASK: Plan de Trabajo por Fases - Rick and Morty Explorer

## Estado General del Proyecto
- **Proyecto:** Rick and Morty Explorer (Propuesta 4 - Conquer Blocks Proyecto Final JS)
- **Fase Actual:** **Proyecto Finalizado al 100% (Fases 1 a 7 Completadas)**
- **Estado de Aprobación:** 🟢 **Todas las fases aprobadas, ejecutadas y verificadas con éxito**

---

## Roadmap de Fases

### [x] Fase 1: Limpieza de Estilos Sass y Maquetación Base HTML
- [x] **1.1.** Eliminación de partials obsoletos y assets huérfanos. Paleta Rick and Morty y resolución de warnings Dart Sass.
- [x] **1.2.** Maquetación semántica completa en `index.html`. Build limpio al 100%.

### [x] Fase 2: Servicio API y Renderizado Inicial de Personajes
- [x] **2.1.** `api.js` con `fetchCharacters` e intercepción defensiva del 404.
- [x] **2.2.** `CharacterCard.js` con badges de estado e indicadores lumínicos.
- [x] **2.3.** `StateFeedback.js` con loader portal, error y vacío. Push: `c271f9a`.

### [x] Fase 3: Búsqueda Reactiva y Filtros Combinados
- [x] **3.1.** `debounce.js` (test: 3 llamadas → 1 ejecución). Filtros `status` y `gender` reactivos. Push: `aced0ef`.

### [x] Fase 4: Navegación y Paginación Dinámica
- [x] **4.1.** Botones Anterior/Siguiente con guarda anti-concurrencia y scroll suave.
- [x] **4.2.** Tests: 0 IDs solapados entre páginas; límites `null` verificados. Push: `9717b9c`.

### [x] Fase 5: Modal de Detalle Extendido y Episodios
- [x] **5.1. `Modal.js`:** `openModal(character, fetchEpisodes)`, `closeModal()`, `renderModalContent()`, `initModalListeners()`.
- [x] **5.2. `api.js`:** `fetchEpisodesByUrls(urls)` con `Promise.all()` y límite de 20 episodios.
- [x] **5.3. Event Delegation en `main.js`:** Un listener en `#characters-grid` detecta `data-action="view-details"` por burbujeo.
- [x] **5.4. Pruebas:** 3 episodios en paralelo OK; Rick Sanchez (51 episodios) → 20 cargados (S01E01–S02E09). Push: `1a2e2c8`.

### [x] Fase 6: Sistema de Favoritos con Persistencia (`localStorage`)
- [x] **6.1. Módulo de Favoritos (`src/js/services/favorites.js`):** Implementado con `localStorage` (clave `rmx_favorites`) y parseo defensivo.
- [x] **6.2. Integración Visual:** `CharacterCard.js` recibe estado de favorito y renderiza el botón modificado.
- [x] **6.3. Event Delegation:** `toggleFavorite` en `main.js` actualiza visualmente solo el botón sin re-renderizar todo el grid.
- [x] **6.4. Pestaña "Favoritos":** Renderiza tarjetas locales sin peticiones a la API; maneja estado vacío de favoritos.
- [x] **6.5. Verificación:** Persistencia recargando la página OK; counter funcional OK. Push: `6bcfa25`.

### [x] Fase 7: Pulido Final, Documentación Didáctica y Despliegue
- [x] **7.1. Revisión de Accesibilidad y Semántica:**
  - Anillo `:focus-visible` de alto contraste (WCAG 2.4.7) añadido para navegación por teclado.
  - Verificación de roles semánticos (`tablist`, `tab`, `dialog`, `status`, `alert`) y atributos ARIA en todos los elementos interactivos.
- [x] **7.2. Documentación Pedagógica:**
  - Comentarios en código explicando el *porqué* de cada patrón: closures (debounce), pure functions, Event Delegation, DOM quirúrgico, `<dialog>` API nativa, y almacenamiento `localStorage` con interfaz `Map`.
  - Creación de `README.md` exhaustivo y profesional con arquitectura, guía de instalación y despliegue.
- [x] **7.3. Optimización para Producción:**
  - `vite.config.js` validado con `base: './'` para compatibilidad total con GitHub Pages.
  - Compilación `npm run build` verificada: 11 módulos transformados, 0 errores, 0 warnings (tiempo de build: ~344ms).
  - Flujo de GitHub Actions `.github/workflows/deploy.yml` configurado para despliegue automatizado.
- [x] **7.4. Despliegue en GitHub:**
  - Rama `main` lista y sincronizada con el repositorio remoto.
