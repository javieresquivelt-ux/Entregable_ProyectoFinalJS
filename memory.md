# MEMORY: Registro Histórico y Decisiones Técnicas

## Bitácora de Sesión - Registro de Fases

### 1. Entorno y Configuración
- **Compilador y Empaquetador:** Vite v8.3.0 y Sass v1.104.1.
- **Repositorio remoto:** `https://github.com/javieresquivelt-ux/Entregable_ProyectoFinalJS.git` (rama `main`).

---

### 2. Fases 1–4 (Completadas)
- **Fase 1:** Sass limpio, paleta temática, maquetación semántica HTML5.
- **Fase 2:** `api.js` con intercepción del 404, `CharacterCard.js`, `StateFeedback.js`.
- **Fase 3:** `debounce.js` (closures + timers), filtros reactivos en `main.js`.
- **Fase 4:** Paginación con guarda anti-concurrencia, scroll suave, tests de límites.

---

### 5. Fase 5: Modal de Detalle y Episodios (Completada)

**Módulos creados/modificados:**
- `src/js/services/api.js` → `fetchEpisodesByUrls(urls)`
- `src/js/components/Modal.js` → `openModal`, `closeModal`, `renderModalContent`, `initModalListeners`
- `src/main.js` → Event Delegation sobre `#characters-grid` + llamada a `openModal`

**Decisiones técnicas documentadas:**

1. **`<dialog>` nativo de HTML5:**
   - `showModal()` captura el foco automáticamente y aplica `aria-modal="true"` sin código adicional.
   - El cierre con tecla `Escape` es nativo; solo nos suscribimos al evento `'close'` del `<dialog>` para limpiar `body.overflow`.
   - Clic en el backdrop: el `<dialog>` cubre toda la pantalla; si `event.target === dialogEl` (en lugar de su hijo `.modal__content`), el clic fue en el área oscura → cerramos.

2. **`Promise.all()` para episodios paralelos:**
   - Rick Sanchez tiene 51 episodios. Limitamos a los primeros 20 con `.slice(0, 20)`.
   - Test: 51 URLs de Rick → 20 episodios cargados, de S01E01 a S02E09. ✅
   - Las respuestas fallidas se descartan silenciosamente con `.filter(res => res.ok)`.

3. **Patrón de Event Delegation:**
   - Un único listener en `#characters-grid` captura todos los clics en tarjetas mediante event bubbling.
   - `event.target.closest('[data-action="view-details"]')` identifica el botón exacto aunque el clic sea en un elemento hijo.
   - El personaje se busca en `state.characters` (memoria local) → sin petición adicional a la API.
   - `fetchEpisodesByUrls` se inyecta como dependencia en `openModal()`, facilitando la separación de responsabilidades.

4. **Inversión de Dependencias aplicada:**
   - `Modal.js` no importa directamente el servicio API; recibe `fetchEpisodes` como parámetro en `openModal()`. Esto permite reemplazar la función de carga de episodios sin modificar el componente del modal.

**Resultados de pruebas:**
- `fetchEpisodesByUrls` con 3 URLs reales → S01E01, S01E02, S01E03 cargados en paralelo. ✅
- Rick Sanchez (51 episodios) → limitado a 20 episodios correctamente. ✅
- Build limpio: 10 módulos transformados, 0 errores, 0 warnings. ✅
- **Commit:** `1a2e2c8` sincronizado en GitHub.

---

---

### 6. Fase 6: Sistema de Favoritos con `localStorage` (Completada)

**Decisiones técnicas aplicadas:**

1. **Estructura de Datos en `localStorage`:**
   - Clave: `rmx_favorites`
   - Se guardan los objetos de los personajes completos (`character[]`) y al cargar en memoria se convierten a un `Map<id, character>` para operaciones $O(1)$.
   - Si el JSON almacenado está corrupto, se descarta para evitar bloqueos (`try/catch`).

2. **Actualización Quirúrgica (Sin Re-render Total):**
   - Event Delegation en `#characters-grid`.
   - Cuando se da click en ⭐, solo se togglea la clase `.is-favorite` y el atributo `aria-label` en *ese* botón específico, previniendo así un parpadeo (reflow) y pérdida de scroll que habría causado rehacer `grid.innerHTML`.
   - En la vista de favoritos, las tarjetas desmarcadas hacen una pequeña transición (scale y opacity) antes de eliminarse del DOM usando `setTimeout`.

3. **Arquitectura de Pestañas (Tabs):**
   - Una única fuente de verdad en `state.activeTab` ('all' o 'favs').
   - `renderFavoritesView()` toma los datos directamente de `localStorage` sin llamar a la API de Rick and Morty.
   - Si se busca un personaje o se cambia un filtro desde la pestaña "Favoritos", el sistema hace auto-switch a "Todos" para buscar de nuevo en la API, protegiendo la usabilidad.

**Resultados de Pruebas:**
- El contador se actualiza en tiempo real en la pestaña.
- Persistencia demostrada. Build exitoso (`npm run build` en 340ms).

---

### 7. Fase 7: Pulido Final, Documentación Didáctica y Despliegue (Completada)

**Acciones y Decisiones Técnicas Aplicadas:**

1. **Accesibilidad de Teclado y Contraste (WCAG 2.4.7):**
   - Incorporado estilo global `:focus-visible` en `_reset.scss` utilizando el cian temático de alto contraste (`outline: 2px solid $color-portal-cyan; outline-offset: 3px`).
   - Todos los elementos interactivos (botones de navegación, selector de pestañas, inputs de búsqueda y filtros, botón de cierre del modal y tarjetas) ofrecen una respuesta visual clara al navegar mediante `Tab` y `Shift+Tab`.
   - Elementos semánticos auditados: `aria-live="polite"`, `role="tablist"`, `role="tab"`, `aria-selected`, `aria-label` descriptivos dinámicos en los botones de favoritos ("Agregar a [Nombre] a favoritos" vs "Quitar a [Nombre] de favoritos").

2. **Documentación Didáctica de Código:**
   - Verificado que cada módulo contenga JSDoc exhaustivo y comentarios pedagógicos sobre patrones de diseño:
     - `debounce.js`: Closures, timers de Web API y preservación de contexto (`callback.apply(this, args)`).
     - `api.js`: Promesas paralelas con `Promise.all()`, defensiva ante HTTP 404 y `URLSearchParams`.
     - `favorites.js`: Encapsulamiento del almacenamiento en navegador, estructura de datos `Map` para búsqueda $O(1)$, serialización JSON a prueba de excepciones.
     - `Modal.js`: API nativa HTML5 `<dialog>` con `showModal()`, focus trapping y cierre por backdrop. Inversión de dependencias con `fetchEpisodes`.
     - `CharacterCard.js`: Funciones puras para renderizado, `data-action` y `data-id` para Event Delegation.
     - `main.js`: Single Source of Truth (`state`), actualización quirúrgica del DOM sin reflow general de grilla, y control de pestañas reactivo.
   - Creación de `README.md` exhaustivo de nivel portafolio con arquitectura de directorios, instrucciones de instalación local y guía de despliegue.

3. **Configuración y Optimización para Producción:**
   - `vite.config.js` confirmado con `base: './'`, lo que garantiza que todos los assets en `dist/index.html` se vinculen de forma relativa (`./assets/...`), evitando problemas de rutas 404 al desplegar en GitHub Pages.
   - Flujo de GitHub Actions `.github/workflows/deploy.yml` agregado para automatizar la integración y despliegue continuo (CI/CD) directo a GitHub Pages tras cada push a la rama `main`.
   - Ejecución de `npm run build`: 11 módulos transformados, 0 errores, 0 advertencias, tiempo de compilación óptimo (~344ms).

---

### 8. Estado Actual del Proyecto
- 🟢 **Proyecto finalizado al 100% (Fases 1 a 7 completadas y verificadas).**
- Todos los cambios documentados en `task.md` y `memory.md`.
- Repositorio y rama `main` listos para entrega y revisión.
