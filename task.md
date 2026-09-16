# TASK: Plan de Trabajo por Fases - Rick and Morty Explorer

## Estado General del Proyecto
- **Proyecto:** Rick and Morty Explorer (Propuesta 4 - Conquer Blocks Proyecto Final JS)
- **Fase Actual:** **Fase 3 - Búsqueda Reactiva y Filtros Combinados**
- **Estado de Aprobación:** 🟡 **Esperando confirmación explícita del usuario para iniciar la Fase 3**

---

## Detalle Específico de la Fase Actual (Fase 3)

### Objetivo
Dotar de interactividad en tiempo real al panel de controles, permitiendo al usuario buscar personajes por nombre utilizando un patrón de optimización *debounce* para no saturar la red, y combinar dicha búsqueda con los selectores de **Estado** (*Vivo, Muerto, Desconocido*) y **Género** (*Femenino, Masculino, Sin género, Desconocido*). Cada cambio de filtro reiniciará de manera consistente la navegación a la página 1.

### Subtareas de la Fase 3
- [ ] **3.1. Módulo de Utilidad Debounce (`src/js/utils/debounce.js`):**
  - Implementar la función de orden superior `debounce(callback, delay = 350)` con explicaciones pedagógicas exhaustivas sobre *closures* y temporizadores (`setTimeout` y `clearTimeout`).
  - Garantizar la preservación del contexto `this` y los argumentos originales de la llamada.
- [ ] **3.2. Sincronización de Controles en `src/main.js`:**
  - Cachear referencias en el objeto `DOM` para `#search-input`, `#status-filter` y `#gender-filter`.
  - Vincular el evento `input` del buscador a una función `handleSearch` optimizada con debounce (350ms).
  - Vincular el evento `change` en los desplegables de estado y género a una función `handleFilterChange`.
  - Actualizar el estado central (`state.filters.name`, `state.filters.status`, `state.filters.gender`).
  - Reiniciar automáticamente `state.currentPage = 1` y ejecutar `loadCharacters(1)`.
- [ ] **3.3. Experiencia de Usuario y Manejo de Casos Extremos:**
  - Si el usuario borra todo el texto del buscador, reconsultar automáticamente el listado sin filtro de nombre.
  - Si una combinación no arroja personajes (código 404 capturado en el servicio API), renderizar el componente temático `renderEmpty` indicando el término que provocó el resultado vacío.
  - Mantener deshabilitados los botones de paginación durante las búsquedas vacías (`state.totalPages = 0`).
- [ ] **3.4. Verificación y Sincronización:**
  - Comprobar combinaciones de filtros múltiples (ejemplo: buscar "Rick", estado "Dead", género "Male").
  - Validar build limpio (`npm run build`).
  - Sincronizar avances mediante commit y push al repositorio de GitHub.

---

## Roadmap Completo de Fases

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

### [ ] Fase 3: Búsqueda Reactiva y Filtros Combinados
*(En espera de confirmación para ejecución)*

### [ ] Fase 4: Navegación y Paginación
- [ ] Conectar los botones Anterior/Siguiente para avanzar y retroceder entre páginas manteniendo los filtros activos.

### [ ] Fase 5: Modal de Detalle Extendido y Episodios
- [ ] Diálogo modal accesible con fetch de episodios y datos adicionales al hacer clic en "Ver detalles".

### [ ] Fase 6: Sistema de Favoritos con Persistencia (`localStorage`)
- [ ] Persistencia de favoritos en `localStorage` y filtro exclusivo en pestaña Favoritos.

### [ ] Fase 7: Pulido Final, Documentación Didáctica y Despliegue
- [ ] Revisión exhaustiva de comentarios pedagógicos y checklist de GitHub Pages.
