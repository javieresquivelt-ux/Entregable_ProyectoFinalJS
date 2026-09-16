# MEMORY: Registro Histórico y Decisiones Técnicas

## Bitácora de Sesión - Registro de Fases

### 1. Diagnóstico del Entorno Actual y Código Heredado
- **Compilador y Empaquetador:** Vite v8.3.0 y Sass v1.104.1.
- **Configuración de Despliegue y Control de Versiones:**
  - `base: './'` en `vite.config.js` para rutas relativas compatibles con GitHub Pages.
  - Repositorio remoto: `https://github.com/javieresquivelt-ux/Entregable_ProyectoFinalJS.git` (rama `main`).

---

### 2. Fase 1: Cimientos y Maquetación Base (Completada)
- Estructura Sass limpia y modular con paleta Rick and Morty.
- Maquetación semántica en `index.html` con `<header>`, `<section>`, `<main>`, `<dialog>` y `<nav>`.
- Build verificado sin advertencias.

---

### 3. Fase 2: Servicio API y Renderizado Inicial (Completada)
- Módulo `src/js/services/api.js` con `fetchCharacters` y manejo defensivo del 404 (transformado en un array seguro `[]`).
- Componentes `CharacterCard.js` y `StateFeedback.js` con soporte para badges e indicadores luminosos.
- Carga de la página 1 en `DOMContentLoaded`.
- Pruebas verificadas: 20 personajes recibidos, 42 páginas totales. Sincronizado en GitHub.

---

### 4. Razonamiento Técnico y Pedagógico para la Fase 3: Búsqueda y Filtros Combinados

#### A. El Patrón Debounce y el Event Loop de JavaScript
- **Problema de Rendimiento y Experiencia:**
  - Cuando un usuario escribe en un campo de texto, el evento `input` se dispara con cada pulsación de tecla.
  - Si el usuario escribe la palabra "Morty" (5 letras), sin optimización se lanzarían 5 peticiones HTTP casi consecutivas:
    `name=M` ➔ `name=Mo` ➔ `name=Mor` ➔ `name=Mort` ➔ `name=Morty`.
  - Esto causa sobrecarga innecesaria en la API pública, consumo excesivo de datos móviles y el clásico problema de *Race Conditions* (Condición de Carrera): una petición anterior lenta podría resolverse después de la última y sobrescribir la pantalla con resultados desactualizados.
- **Solución Pedagógica (Debounce):**
  - Se implementa una función de orden superior (*Higher-Order Function*) que aprovecha los **Closures** (clausuras) de JavaScript.
  - Guarda una variable interna `timeoutId`. Cada vez que el usuario presiona una tecla, cancela el temporizador anterior con `clearTimeout(timeoutId)` y crea uno nuevo con `setTimeout`.
  - Solo cuando el usuario deja de tipear durante 350 milisegundos, la función de búsqueda se ejecuta efectivamente.

#### B. Gestión Centralizada del Estado (Single Source of Truth)
- En lugar de leer directamente los valores del DOM en cada función dispersa, el objeto `state.filters` almacena el estado unificado:
  ```javascript
  state.filters = {
    name: 'Rick',
    status: 'dead',
    gender: 'male'
  };
  ```
- Cualquier cambio en cualquiera de los tres controles actualiza esta estructura y llama a `loadCharacters(1)`, garantizando que todos los filtros activos se envíen simultáneamente al endpoint de la API.

#### C. Reseteo de Paginación en Búsquedas
- Si un usuario se encuentra en la página 15 del catálogo general y luego escribe "Summer", la búsqueda no debe consultar la página 15 de los resultados filtrados (la cual probablemente ni siquiera exista).
- **Regla inquebrantable:** Toda nueva búsqueda o cambio de filtro debe reiniciar siempre el puntero de página a `1` (`state.currentPage = 1`).

---

### 5. Estado Actual
- **Plan de la Fase 3 detallado en `task.md`.**
- **Razonamiento documentado en `memory.md`.**
- **En pausa a la espera de la confirmación explícita del usuario para iniciar la ejecución de la Fase 3.**
