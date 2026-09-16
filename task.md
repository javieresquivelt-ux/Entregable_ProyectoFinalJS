# TASK: Plan de Trabajo por Fases - Rick and Morty Explorer

## Estado General del Proyecto
- **Proyecto:** Rick and Morty Explorer (Propuesta 4 - Conquer Blocks Proyecto Final JS)
- **Fase Actual:** **Fase 3 - Búsqueda Reactiva y Filtros Combinados**
- **Estado de Aprobación:** 🟡 **Fase 2 completada. Esperando confirmación explícita del usuario para iniciar la Fase 3**

---

## Roadmap de Fases

### [x] Fase 1: Limpieza de Estilos Sass y Maquetación Base HTML
- [x] **1.1. Limpieza de Sass:** Eliminación de archivos y referencias rotas a assets inexistentes (`/ellipse1.svg`, `/ellipse2.svg`, `_categories.scss`, `_hero.scss`).
- [x] **1.2. Sistema de Diseño:** Configuración de tokens en `_variables.scss` (Verde Portal `#97ce4c`, Cian `#00b5cc`, fondos oscuros `#0f111a`/`#202433`) y corrección de advertencias de Dart Sass.
- [x] **1.3. Maquetación Semántica:** Creación de `index.html` con Header, Barra de búsqueda, selectores de estado y género, pestañas de navegación (Todos vs Favoritos), Grid para personajes, controles de paginación y diálogo `<dialog>` accesible.
- [x] **1.4. Verificación de Compilación:** Validación con `npm run build` (0 errores, 0 advertencias).

### [x] Fase 2: Servicio API y Renderizado Inicial de Personajes
- [x] **2.1. Módulo del Servicio API (`src/js/services/api.js`):** Implementado `fetchCharacters` con `fetch` nativo, `async/await`, soporte para query params y manejo defensivo del 404 (transformado en un array vacío seguro).
- [x] **2.2. Componente de Tarjeta (`src/js/components/CharacterCard.js`):** Función pura `renderCharacterCard` con badges de estado dinámicos (Vivo, Muerto, Desconocido), imagen lazy-loading, origen y botones de acción.
- [x] **2.3. Componente de Estados Visuales (`src/js/components/StateFeedback.js`):** Generador del loader de portal animado, mensaje de error y mensaje de búsqueda sin vida detectada.
- [x] **2.4. Orquestación Inicial en `src/main.js`:** Carga automática de la página 1 en `DOMContentLoaded`, inyección en el grid y actualización de la paginación base.
- [x] **2.5. Verificación y Sincronización:** Pruebas unitarias de consumo y push al repositorio GitHub.

---

## Detalle Específico de la Próxima Fase (Fase 3)

### Objetivo
Dotar de interactividad y dinamismo a la interfaz permitiendo a los usuarios buscar personajes por nombre en tiempo real mediante un patrón de optimización *debounce*, y filtrar simultáneamente por Estado (*Alive, Dead, Unknown*) y Género (*Female, Male, Genderless, Unknown*), reseteando la paginación a la página 1 en cada nueva búsqueda.

### Subtareas de la Fase 3
- [ ] **3.1. Utilidad Debounce (`src/js/utils/debounce.js`):**
  - Implementar una función debounce pura y educativa con explicaciones claras sobre timers (`setTimeout`/`clearTimeout`) para evitar ráfagas de peticiones mientras el usuario escribe.
- [ ] **3.2. Conexión de Eventos en `src/main.js`:**
  - Escuchar el evento `input` en `#search-input` envuelto con `debounce` (350ms).
  - Escuchar el evento `change` en `#status-filter` y `#gender-filter`.
  - Actualizar el objeto reactivo `state.filters` y disparar `loadCharacters(1)` (reiniciando siempre a la página 1).
- [ ] **3.3. Experiencia de Usuario y Feedback:**
  - Mostrar el loader animado mientras se resuelven las búsquedas.
  - Renderizar el estado "Sin vida detectada" personalizado con el término buscado si no hay resultados.
- [ ] **3.4. Verificación y Despliegue:**
  - Validar build limpio y sincronizar con el repositorio en GitHub.

---

### [ ] Fase 4: Navegación y Paginación
- [ ] Conectar los botones Anterior/Siguiente para avanzar y retroceder entre páginas manteniendo los filtros activos.

### [ ] Fase 5: Modal de Detalle Extendido y Episodios
- [ ] Diálogo modal accesible con fetch de episodios y datos adicionales al hacer clic en "Ver detalles".

### [ ] Fase 6: Sistema de Favoritos con Persistencia (`localStorage`)
- [ ] Persistencia de favoritos en `localStorage` y filtro exclusivo en pestaña Favoritos.

### [ ] Fase 7: Pulido Final, Documentación Didáctica y Despliegue
- [ ] Revisión exhaustiva de comentarios pedagógicos y checklist de GitHub Pages.
