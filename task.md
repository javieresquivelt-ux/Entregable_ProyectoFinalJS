# TASK: Plan de Trabajo por Fases - Rick and Morty Explorer

## Estado General del Proyecto
- **Proyecto:** Rick and Morty Explorer (Propuesta 4 - Conquer Blocks Proyecto Final JS)
- **Fase Actual:** **Fase 6 - Sistema de Favoritos con Persistencia (`localStorage`)**
- **Estado de Aprobación:** 🟡 **Fase 5 completada. Esperando confirmación explícita del usuario para iniciar la Fase 6**

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

---

## Detalle Específico de la Próxima Fase (Fase 6)

### Objetivo
Implementar un sistema completo de favoritos que permita al usuario marcar y desmarcar personajes desde la tarjeta y desde el modal de detalle, con persistencia en `localStorage`, y visualizar exclusivamente los personajes marcados al activar la pestaña "Favoritos".

### Subtareas de la Fase 6
- [ ] **6.1. Módulo de Favoritos (`src/js/services/favorites.js`):**
  - `getFavorites()` → Lee y parsea el JSON del localStorage (clave: `rmx_favorites`). Retorna `Map<id, character>`.
  - `toggleFavorite(character)` → Añade o elimina el personaje del Map y guarda de vuelta en localStorage.
  - `isFavorite(id)` → Retorna `true/false` sin efectos secundarios.
  - `getFavoritesCount()` → Retorna el número de favoritos para actualizar el contador en la pestaña.
- [ ] **6.2. Integración Visual en `CharacterCard.js`:**
  - Actualizar `renderCharacterCard(character, isFavorite)` para que el botón ⭐ reciba la clase `is-favorite` cuando corresponda.
- [ ] **6.3. Event Delegation para el Botón de Favorito:**
  - Detectar clics en `[data-action="toggle-favorite"]` dentro del grid mediante el listener ya existente en `#characters-grid`.
  - Llamar a `toggleFavorite()`, actualizar visualmente solo el botón afectado (sin re-renderizar todo el grid) y actualizar el contador de la pestaña.
- [ ] **6.4. Pestaña "Favoritos" en `main.js`:**
  - Vincular eventos de clic en `#tab-all` y `#tab-favs`.
  - En modo "Favoritos": renderizar las tarjetas guardadas en localStorage sin petición a la API, con mensaje de estado vacío si no hay ninguno.
  - En modo "Todos": restaurar la vista de personajes paginados con los filtros actuales.
- [ ] **6.5. Verificación y Despliegue:**
  - Probar persistencia al recargar la página.
  - Validar counter de favoritos en la pestaña.
  - Build limpio y push a GitHub.

---

### [ ] Fase 7: Pulido Final, Documentación Didáctica y Despliegue
- [ ] Revisión exhaustiva de comentarios pedagógicos y checklist de GitHub Pages.
