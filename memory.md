# MEMORY: Registro Histórico y Decisiones Técnicas

## Bitácora de Sesión - Registro de Fases

### 1. Diagnóstico del Entorno Actual y Código Heredado
- **Compilador y Empaquetador:** Vite v8.3.0 y Sass v1.104.1.
- **Configuración de Despliegue y Control de Versiones:**
  - Se confirmó `base: './'` en `vite.config.js` para rutas relativas adecuadas en GitHub Pages.
  - Repositorio remoto sincronizado: `https://github.com/javieresquivelt-ux/Entregable_ProyectoFinalJS.git` en la rama `main`.

---

### 2. Fase 1: Cimientos y Maquetación Base (Completada)
- Estructura Sass modular (`abstracts`, `base`, `components`, `layout`) con paleta Rick and Morty.
- Maquetación semántica en `index.html` con `<header>`, `<section>`, `<main>`, `<dialog>` y `<nav>`.
- Build verificado sin advertencias.

---

### 3. Fase 2: Servicio API y Renderizado Inicial (Completada)
- **Módulo `src/js/services/api.js`:**
  - Implementación con `fetch` nativo y `async/await`.
  - Construcción dinámica de queries con `URLSearchParams`.
  - **Decisión técnica:** La API de Rick and Morty devuelve `404` con `{ error: "There is nothing here" }` cuando no hay coincidencias para una búsqueda o filtro. Dicho código `404` se intercepta defensivamente retornando `{ info: { count: 0, pages: 0, next: null, prev: null }, results: [], isEmpty: true }`, garantizando estabilidad absoluta y evitando errores de consola no capturados.
- **Componentes `CharacterCard.js` y `StateFeedback.js`:**
  - Generación de tarjetas semánticas enriquecidas con atributos `data-id` y badges dinámicos con traducciones en español (*Vivo, Muerto, Desconocido*).
  - Loader con animación portal CSS rotativa y estado de error/reintento.
- **Orquestador `src/main.js`:**
  - Carga inicial reactiva de los primeros 20 personajes al disparar `DOMContentLoaded`.
- **Verificación:**
  - Pruebas directas de consumo ejecutadas con éxito: `Fetched characters: 20, Total pages: 42`.
  - Prueba del manejo del 404: `Empty response handled: true, Results: 0`.
  - Commit y push completado hacia GitHub (`c271f9a`).

---

### 4. Razonamiento Técnico para la Fase 3: Búsqueda Reactiva y Filtros Combinados
- **Patrón Debounce:**
  - Al escribir en un `input[type="search"]`, el evento `input` se dispara con cada pulsación de tecla. Si se ejecutaran peticiones directas, una búsqueda de 5 caracteres generaría 5 llamadas simultáneas a la API, provocando sobrecarga de red y problemas de *race conditions* (donde una petición anterior puede responder después de la última).
  - **Solución técnica:** Implementar una utilidad `debounce(fn, delay)` que reinicie un temporizador (`clearTimeout`) y solo invoque la búsqueda cuando el usuario se detenga durante al menos 350 milisegundos.
- **Sincronización de Filtros:**
  - Al modificar el buscador, el select de Estado o el select de Género, se actualiza el objeto central `state.filters` y se reinicia `state.currentPage = 1`.
  - Si una combinación no produce resultados, se presenta el componente `renderEmpty(query)`.

---

### 5. Estado Actual
- **Fase 2 completada y sincronizada en GitHub.**
- **En pausa a la espera de la confirmación explícita del usuario para iniciar la Fase 3.**
