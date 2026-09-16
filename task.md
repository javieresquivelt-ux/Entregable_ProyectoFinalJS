# TASK: Plan de Trabajo por Fases - Rick and Morty Explorer

## Estado General del Proyecto
- **Proyecto:** Rick and Morty Explorer (Propuesta 4 - Conquer Blocks Proyecto Final JS)
- **Fase Actual:** **Fase 2 - Servicio API y Renderizado Inicial de Personajes**
- **Estado de Aprobación:** 🟡 **Fase 1 completada. Esperando confirmación explícita del usuario para iniciar la Fase 2**

---

## Roadmap de Fases

### [x] Fase 1: Limpieza de Estilos Sass y Maquetación Base HTML
- [x] **1.1. Limpieza de Sass:** Eliminación de archivos y referencias rotas a assets inexistentes (`/ellipse1.svg`, `/ellipse2.svg`, `_categories.scss`, `_hero.scss`).
- [x] **1.2. Sistema de Diseño:** Configuración de tokens en `_variables.scss` (Verde Portal `#97ce4c`, Cian `#00b5cc`, fondos oscuros `#0f111a`/`#202433`) y corrección de advertencias de Dart Sass.
- [x] **1.3. Maquetación Semántica:** Creación de `index.html` con Header, Barra de búsqueda, selectores de estado y género, pestañas de navegación (Todos vs Favoritos), Grid para personajes, controles de paginación y diálogo `<dialog>` accesible.
- [x] **1.4. Verificación de Compilación:** Validación con `npm run build` (0 errores, 0 advertencias).

---

## Detalle Específico de la Próxima Fase (Fase 2)

### Objetivo
Construir la capa de acceso a datos conectando la API pública de Rick and Morty (`https://rickandmortyapi.com/api/character`), crear el componente visual de tarjeta reutilizable (`CharacterCard.js`) y orquestar el renderizado inicial en `main.js` con estados de carga (Loader Portal) y manejo de errores.

### Subtareas de la Fase 2
- [ ] **2.1. Módulo del Servicio API (`src/js/services/api.js`):**
  - Implementar la función asíncrona `fetchCharacters({ page = 1, name = '', status = '', gender = '' })` utilizando `fetch` nativo y `async/await`.
  - Construir dinámicamente los query params con `URLSearchParams`.
  - Manejo de respuestas HTTP: validar `response.ok`, capturar errores de red y gestionar el caso cuando la API devuelve `404` ("There is nothing here") devolviendo un array vacío en lugar de romper la app.
- [ ] **2.2. Componente de Tarjeta (`src/js/components/CharacterCard.js`):**
  - Crear una función pura `renderCharacterCard(character, isFavorite)` que retorne el string HTML de la tarjeta semántica.
  - Incluir badge de estado con su color correspondiente (*Alive*, *Dead*, *Unknown*).
  - Incluir botón de favorito flotante con `data-id`.
  - Incluir botón "Ver más detalles" con `data-id` para preparar la integración del modal.
- [ ] **2.3. Componente de Estados Visuales (`src/js/components/StateFeedback.js`):**
  - Función para renderizar el loader temático (portal giratorio animado).
  - Función para renderizar mensaje de error amigable con botón de reintentar.
- [ ] **2.4. Orquestación Inicial en `src/main.js`:**
  - Importar estilos y módulos.
  - Invocar `fetchCharacters` al cargar la aplicación.
  - Renderizar las tarjetas en el `#characters-grid`.
  - Actualizar el contador de páginas y habilitar/deshabilitar los botones del paginador según `info.next` e `info.prev`.
- [ ] **2.5. Verificación y Pruebas:**
  - Validar en consola y en el build (`npm run build`) que los datos lleguen correctamente y se muestren sin fallos.

---

### [ ] Fase 3: Búsqueda Reactiva y Filtros Combinados
- [ ] Implementar función debounce en `src/js/utils/debounce.js`.
- [ ] Conectar inputs y selects para filtrar dinámicamente personajes.

### [ ] Fase 4: Navegación y Paginación
- [ ] Manejo interactivo de cambio de página preservando los filtros activos.

### [ ] Fase 5: Modal de Detalle Extendido y Episodios
- [ ] Diálogo modal accesible con fetch de episodios y datos adicionales.

### [ ] Fase 6: Sistema de Favoritos con Persistencia (`localStorage`)
- [ ] Persistencia de favoritos en `localStorage` y filtro exclusivo en pestaña Favoritos.

### [ ] Fase 7: Pulido Final, Documentación Didáctica y Despliegue
- [ ] Revisión exhaustiva de comentarios pedagógicos y checklist de GitHub Pages.
