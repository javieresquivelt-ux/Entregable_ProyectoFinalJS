# TASK: Plan de Trabajo por Fases - Rick and Morty Explorer

## Estado General del Proyecto
- **Proyecto:** Rick and Morty Explorer (Propuesta 4 - Conquer Blocks Proyecto Final JS)
- **Fase Actual:** **Fase 4 - Navegación y Paginación Dinámica**
- **Estado de Aprobación:** 🟡 **Fase 3 completada. Esperando confirmación explícita del usuario para iniciar la Fase 4**

---

## Roadmap de Fases

### [x] Fase 1: Limpieza de Estilos Sass y Maquetación Base HTML
- [x] **1.1. Limpieza de Sass:** Eliminación de partials obsoletos (`_categories.scss`, `_hero.scss`) y assets huérfanos (`ellipse1.svg`/`ellipse2.svg`).
- [x] **1.2. Sistema de Diseño:** Paleta Rick and Morty (Verde Portal, Cian, Fondos Cósmicos) y resolución de warnings en Dart Sass.
- [x] **1.3. Maquetación Semántica:** Creación de `index.html` con `<header>`, sección de controles, `<main>`, `<nav>` y `<dialog>`.
- [x] **1.4. Verificación de Compilación:** Build limpio al 100%.

### [x] Fase 2: Servicio API y Renderizado Inicial de Personajes
- [x] **2.1. Módulo API (`src/js/services/api.js`):** `fetchCharacters` con manejo defensivo del 404.
- [x] **2.2. Componente Tarjeta (`src/js/components/CharacterCard.js`):** Función pura `renderCharacterCard` con badges e indicadores lumínicos.
- [x] **2.3. Componentes Visuales (`src/js/components/StateFeedback.js`):** Loader portal animado y vistas de error/vacío.
- [x] **2.4. Orquestación Inicial (`src/main.js`):** Carga inicial reactiva de 20 personajes al cargar el DOM.
- [x] **2.5. Verificación y Git:** Pruebas aprobadas y push a GitHub (`c271f9a`).

### [x] Fase 3: Búsqueda Reactiva y Filtros Combinados
- [x] **3.1. Utilidad Debounce (`src/js/utils/debounce.js`):** Implementada función pura con temporizadores y preservación de contexto `this` y argumentos.
- [x] **3.2. Sincronización de Controles (`src/main.js`):** Vinculados eventos `input` y `change`, actualizando `state.filters` y reiniciando siempre a página 1.
- [x] **3.3. Experiencia de Usuario y Feedback:** Loader activo durante la búsqueda y mensaje "Sin vida detectada" si no hay coincidencias.
- [x] **3.4. Verificación y Sincronización:** Pruebas unitarias de debounce y filtros combinados aprobadas; cambios sincronizados en GitHub (`aced0ef`).

---

## Detalle Específico de la Próxima Fase (Fase 4)

### Objetivo
Completar la navegación y paginación reactiva para recorrer las múltiples páginas de resultados de la API de Rick and Morty, asegurando que los filtros y el término de búsqueda actual se conserven intactos al navegar, previniendo dobles clics y desplazando la vista suavemente al inicio de los resultados (*Scroll to Top*).

### Subtareas de la Fase 4
- [ ] **4.1. Lógica de Paginación en `src/main.js`:**
  - Vincular eventos de clic a los botones `#prev-page-btn` y `#next-page-btn`.
  - Incrementar o decrementar `state.currentPage` validando los límites (`1 <= page <= totalPages`).
  - Invocar `loadCharacters(nuevaPagina)`.
- [ ] **4.2. Preservación del Estado de Búsqueda:**
  - Garantizar que si el usuario buscó "Rick" con filtro "Alive", al pulsar "Siguiente" se consulte `page=2&name=Rick&status=alive`.
- [ ] **4.3. Experiencia de Usuario y Scroll Suave:**
  - Al completar la carga de una nueva página, desplazar suavemente la ventana hacia la parte superior del grid de personajes (`window.scrollTo({ top: ..., behavior: 'smooth' })`).
  - Prevenir múltiples solicitudes concurrentes deshabilitando los botones mientras `state.isLoading === true`.
- [ ] **4.4. Verificación y Despliegue:**
  - Probar navegación hacia adelante, hacia atrás y en los límites (página 1 y última página).
  - Validar build limpio (`npm run build`) y sincronizar en GitHub.

---

### [ ] Fase 5: Modal de Detalle Extendido y Episodios
- [ ] Diálogo modal accesible con fetch de episodios y datos adicionales al hacer clic en "Ver detalles".

### [ ] Fase 6: Sistema de Favoritos con Persistencia (`localStorage`)
- [ ] Persistencia de favoritos en `localStorage` y filtro exclusivo en pestaña Favoritos.

### [ ] Fase 7: Pulido Final, Documentación Didáctica y Despliegue
- [ ] Revisión exhaustiva de comentarios pedagógicos y checklist de GitHub Pages.
