# TASK: Plan de Trabajo por Fases - Rick and Morty Explorer

## Estado General del Proyecto
- **Proyecto:** Rick and Morty Explorer (Propuesta 4 - Conquer Blocks Proyecto Final JS)
- **Fase Actual:** **Fase 7 - Pulido Final, Documentación Didáctica y Despliegue**
- **Estado de Aprobación:** 🟡 **Fase 6 completada. Esperando confirmación explícita del usuario para iniciar la Fase 7**

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

### [x] Fase 6: Sistema de Favoritos con Persistencia (`localStorage`)
- [x] **6.1. Módulo de Favoritos (`src/js/services/favorites.js`):** Implementado con `localStorage` (clave `rmx_favorites`) y parseo defensivo.
- [x] **6.2. Integración Visual:** `CharacterCard.js` recibe estado de favorito y renderiza el botón modificado.
- [x] **6.3. Event Delegation:** `toggleFavorite` en `main.js` actualiza visualmente solo el botón sin re-renderizar todo el grid.
- [x] **6.4. Pestaña "Favoritos":** Renderiza tarjetas locales sin peticiones a la API; maneja estado vacío de favoritos.
- [x] **6.5. Verificación:** Persistencia recargando la página OK; counter funcional OK.

---

## Detalle Específico de la Próxima Fase (Fase 7)

### Objetivo
Realizar el pulido final de la aplicación, asegurar que los comentarios pedagógicos son de alta calidad, y configurar lo necesario para un despliegue exitoso (como comprobar rutas relativas para GitHub Pages).

### Subtareas de la Fase 7
- [ ] **7.1. Revisión de Accesibilidad y Semántica:**
  - Comprobar contrastes de color, focus states y uso correcto de etiquetas ARIA y semánticas.
- [ ] **7.2. Documentación Pedagógica:**
  - Asegurar que los comentarios en el código explican el *porqué* de las decisiones (patrones puros, debounce, event delegation, web APIs nativas, local storage).
- [ ] **7.3. Optimización para Producción:**
  - Validar `vite.config.js` (`base: './'`).
  - Correr `npm run build` y asegurar que no hay warnings o errores.
- [ ] **7.4. Despliegue en GitHub:**
  - Confirmar que la rama main está lista.
  - Asegurar que se puede usar en GitHub Pages.
