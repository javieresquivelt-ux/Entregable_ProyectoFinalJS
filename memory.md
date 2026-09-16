# MEMORY: Registro Histórico y Decisiones Técnicas

## Bitácora de Sesión - Registro de Fases

### 1. Diagnóstico del Entorno Actual y Código Heredado
- **Compilador y Empaquetador:** Vite v8.3.0 y Sass v1.104.1.
- **Configuración de Despliegue y Control de Versiones:**
  - `base: './'` en `vite.config.js` para rutas relativas en GitHub Pages.
  - Repositorio remoto sincronizado: `https://github.com/javieresquivelt-ux/Entregable_ProyectoFinalJS.git` (rama `main`).

---

### 2. Fase 1: Cimientos y Maquetación Base (Completada)
- Estructura Sass modular con tokens de diseño temático.
- Maquetación semántica en `index.html`.
- Build validado con 0 errores y 0 warnings.

---

### 3. Fase 2: Servicio API y Renderizado Inicial (Completada)
- Módulo `src/js/services/api.js` con `fetchCharacters` e intercepción defensiva del 404.
- Componentes `CharacterCard.js` y `StateFeedback.js`.
- Carga de la página 1 en `DOMContentLoaded`.
- Pruebas unitarias aprobadas y sincronización en GitHub.

---

### 4. Fase 3: Búsqueda Reactiva y Filtros Combinados (Completada)
- **Módulo `src/js/utils/debounce.js`:**
  - Implementación educativa del patrón debounce utilizando *closures* y temporizadores de la Web API (`setTimeout`/`clearTimeout`).
  - Prueba automatizada: se lanzaron 3 invocaciones seguidas y se verificó que solo 1 llamada se ejecutó tras expirar el retraso de 50ms.
- **Orquestación en `src/main.js`:**
  - Vinculación del evento `input` en `#search-input` mediante debounce de 350ms.
  - Vinculación del evento `change` en selectores `#status-filter` y `#gender-filter`.
  - Prueba de consumo combinada: búsqueda "Rick" + estado "alive" + género "male" devolvió 20 personajes coincidentes en vivo desde la API oficial.
- **Sincronización:** Commit y push completado hacia GitHub (`aced0ef`).

---

### 5. Razonamiento Técnico y Pedagógico para la Fase 4: Navegación y Paginación

#### A. Mantenimiento del Estado Compuesto
- En aplicaciones interactivas, la paginación no puede existir de forma aislada a los filtros.
- Si el usuario busca "Morty" con estado "alive", al hacer clic en "Página siguiente", la petición HTTP resultante debe preservar dichos parámetros:
  `?page=2&name=Morty&status=alive`
- Gracias a la arquitectura centralizada en el objeto `state` (`state.currentPage`, `state.filters`), la función `loadCharacters(page)` reutiliza siempre los valores activos de los filtros, garantizando consistencia absoluta sin necesidad de almacenar variables dispersas en el DOM.

#### B. Prevención de Concurrencia y Doble Envío
- Durante el tiempo que toma resolver la petición a la red (`state.isLoading === true`), los botones `#prev-page-btn` y `#next-page-btn` deben deshabilitarse (`disabled = true`) para evitar que clics repetidos o accidentales lancen peticiones redundantes.
- Los botones también deben deshabilitarse automáticamente en los límites extremos:
  - Botón "Anterior" deshabilitado si `currentPage <= 1`.
  - Botón "Siguiente" deshabilitado si `currentPage >= totalPages`.

#### C. Usabilidad y Scroll Restaurado
- Al cambiar de página, el usuario usualmente se encuentra al final de la página (cerca de los controles de paginación). Para mejorar la ergonomía de navegación, la vista se desplazará suavemente hacia el inicio del grid de personajes.

---

### 6. Estado Actual
- **Fase 3 completada y sincronizada en GitHub.**
- **Plan de la Fase 4 detallado en `task.md`.**
- **Razonamiento documentado en `memory.md`.**
- **En pausa a la espera de la confirmación explícita del usuario para iniciar la ejecución de la Fase 4.**
