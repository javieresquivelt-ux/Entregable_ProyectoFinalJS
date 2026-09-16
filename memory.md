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

### 6. Razonamiento Técnico para la Fase 6: Favoritos con `localStorage`

#### A. Estructura de Datos en `localStorage`
- **Clave de almacenamiento:** `rmx_favorites` (prefijo `rmx` para evitar colisiones con otras apps).
- **Formato:** JSON serializado de un arreglo de objetos de personaje completos `character[]`.
  - Ventaja: Al mostrar la vista de favoritos, no necesitamos hacer peticiones adicionales a la API; los datos ya están disponibles localmente.
  - Desventaja a considerar: Los datos del personaje pueden desactualizarse si la API los modifica (es aceptable para este proyecto educativo).
- **Estructura interna del servicio:** Trabajamos con un `Map<id, character>` en memoria para operaciones O(1) de búsqueda/existencia, y serializamos a array solo al guardar en localStorage.

#### B. Actualización Quirúrgica de la UI (sin re-render total)
- Al hacer clic en el botón ⭐ de una tarjeta, NO volvemos a renderizar todo el grid (lo cual provocaría pérdida de posición de scroll y parpadeos).
- En cambio, actualizamos únicamente el botón afectado en el DOM:
  ```javascript
  const btn = document.querySelector(`[data-action="toggle-favorite"][data-id="${id}"]`);
  btn.classList.toggle('is-favorite', isFavorite(id));
  ```
- El contador de la pestaña (`#fav-count`) también se actualiza de forma puntual.

#### C. Vista Exclusiva de Favoritos
- La pestaña "Favoritos" no realiza peticiones a la API; lee directamente el `localStorage` y renderiza las tarjetas con `renderCharacterCard(character, true)`.
- Si el usuario no tiene favoritos guardados, se muestra el componente `renderEmpty` con un mensaje temático.
- Al volver a la pestaña "Todos", se restaura la última búsqueda con `loadCharacters(state.currentPage)`.

---

### 7. Estado Actual
- **Fase 5 completada y sincronizada en GitHub.**
- **Plan de la Fase 6 detallado en `task.md`.**
- **En pausa a la espera de la confirmación explícita del usuario para iniciar la Fase 6.**
