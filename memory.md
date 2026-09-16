# MEMORY: Registro Histórico y Decisiones Técnicas

## Bitácora de Sesión - Registro de Fases

### 1. Diagnóstico del Entorno Actual y Código Heredado
- **Compilador y Empaquetador:** Vite v8.3.0 y Sass v1.104.1.
- **Configuración de Despliegue y Control de Versiones:**
  - `base: './'` en `vite.config.js` para rutas relativas en GitHub Pages.
  - Repositorio remoto: `https://github.com/javieresquivelt-ux/Entregable_ProyectoFinalJS.git` (rama `main`).

---

### 2. Fase 1: Cimientos y Maquetación Base (Completada)
- Estructura Sass modular con tokens de diseño temático y maquetación semántica. Build sin warnings.

### 3. Fase 2: Servicio API y Renderizado Inicial (Completada)
- Módulo `api.js` con intercepción del 404, componentes `CharacterCard.js` y `StateFeedback.js`. Pruebas aprobadas.

### 4. Fase 3: Búsqueda Reactiva y Filtros Combinados (Completada)
- `debounce.js` con prueba automática (3 llamadas → 1 ejecución). Filtros `status` y `gender` vinculados reactivamente en `main.js`.

---

### 5. Fase 4: Navegación y Paginación Dinámica (Completada)
- **Decisiones técnicas aplicadas:**
  - **Guarda Anti-Concurrencia:** Se añadió `if (state.isLoading) return;` al inicio de `loadCharacters()` para bloquear completamente nuevas peticiones mientras hay una pendiente, evitando el problema de _Race Conditions_ en paginación rápida.
  - **Validación Doble de Límites:** La lógica de los botones de paginación aplica dos capas de seguridad: el atributo `disabled` del DOM (previene clics del usuario) y una guarda JavaScript (`if (nextPage <= state.totalPages)`) en el handler del evento, resistente a activaciones programáticas.
  - **Scroll Ergonómico:** La función `scrollToGrid()` usa `getBoundingClientRect()` para calcular la posición real del grid en el documento y aplica un offset de 24px de margen superior antes de ejecutar `window.scrollTo({ behavior: 'smooth' })`.
- **Resultados de las pruebas:**
  - Página 1 (alive): 20 personajes, 22 páginas totales. ✅
  - Página 2 (alive): 20 personajes diferentes (0 IDs solapados con Página 1). ✅
  - Límite inferior (Página 1): `info.prev === null`. ✅
  - Límite superior (Página 42): `info.next === null`. ✅
- **Commit:** `9717b9c` sincronizado en GitHub.

---

### 6. Razonamiento Técnico y Pedagógico para la Fase 5: Modal y Episodios

#### A. El Elemento `<dialog>` Nativo de HTML5
- La API del elemento `<dialog>` ofrece comportamientos de accesibilidad gratuitos que son muy difíciles de replicar manualmente:
  - `dialogElement.showModal()`: Abre el diálogo como modal bloqueante, captura el foco automáticamente y gestiona el atributo ARIA `aria-modal="true"`.
  - `dialogElement.close()`: Cierra y limpia el estado automáticamente.
  - El pseudoelemento `::backdrop` permite estilizar el fondo oscuro nativo.
  - La tecla `Escape` cierra el diálogo de forma nativa sin código JavaScript adicional.
- **Por qué es pedagógicamente valioso:** Demuestra cómo las APIs nativas del navegador pueden reemplazar librerías pesadas de modales manteniendo plena accesibilidad.

#### B. `Promise.all()` para Peticiones de Episodios en Paralelo
- Cada personaje tiene un array de URLs de episodios (ej. Rick Sanchez tiene 51 episodios).
- Si se consultaran en serie (`for...of` con `await`), 51 peticiones secuenciales tomarían muchos segundos.
- **Solución técnica:** `Promise.all(urls.map(url => fetch(url)))` lanza todas las peticiones en paralelo y resuelve cuando todas completan, reduciendo el tiempo de espera al de la petición más lenta.
- **Limitación aplicada:** Para no saturar la API pública, se procesarán como máximo las primeras 20 URLs del array de episodios con `.slice(0, 20)`.

#### C. Patrón de Event Delegation para el Grid de Personajes
- En lugar de asignar un listener individual a cada botón "Ver detalles" de las tarjetas (que pueden ser hasta 20 por página y se recrean en cada carga), se asigna **un único listener** al contenedor padre `#characters-grid`.
- Al hacer clic dentro del grid, el evento "burbujea" (*event bubbling*) hasta el contenedor. Ahí verificamos `event.target.closest('[data-action="view-details"]')` para identificar el botón exacto y extraer el `data-id` del personaje.
- **Ventaja pedagógica:** Menor uso de memoria, menor riesgo de listeners duplicados y código más simple al reemplazar el contenido del grid.

---

### 7. Estado Actual
- **Fase 4 completada y sincronizada en GitHub.**
- **Plan de la Fase 5 detallado en `task.md`.**
- **En pausa a la espera de la confirmación explícita del usuario para iniciar la Fase 5.**
