/**
 * ============================================================================
 * ORQUESTADOR PRINCIPAL: RICK AND MORTY EXPLORER
 * ============================================================================
 * Este archivo es el punto de entrada de la aplicación.
 * Se encarga de:
 * 1. Inicializar los estilos Sass.
 * 2. Gestionar el estado reactivo centralizado (Single Source of Truth).
 * 3. Orquestar la carga de datos desde la API de Rick and Morty.
 * 4. Gestionar la búsqueda reactiva con el patrón Debounce.
 * 5. Gestionar el filtrado combinado por Estado y Género.
 * 6. Navegación dinámica por páginas conservando todos los filtros activos.
 * 7. Actualizar dinámicamente los componentes visuales de la interfaz.
 */

// Importación de los estilos globales (Sass)
import './scss/app.scss';

// Importación de servicios, componentes modulares y utilidades
import { fetchCharacters } from './js/services/api.js';
import { renderCharacterCard } from './js/components/CharacterCard.js';
import { renderLoader, renderError, renderEmpty } from './js/components/StateFeedback.js';
import { debounce } from './js/utils/debounce.js';

/**
 * Estado reactivo centralizado de la aplicación (Single Source of Truth).
 * Centraliza toda la información que describe la vista actual para garantizar
 * que cada petición a la API siempre esté sincronizada con la UI.
 */
const state = {
  currentPage: 1,
  totalPages: 1,
  characters: [],
  isLoading: false,
  filters: {
    name: '',
    status: '',
    gender: ''
  }
};

/**
 * Referencias en caché a los elementos del DOM.
 * Evita búsquedas repetitivas en el árbol del documento (Reflows/Repaints).
 */
const DOM = {
  grid: document.getElementById('characters-grid'),
  pageInfo: document.getElementById('page-info'),
  prevBtn: document.getElementById('prev-page-btn'),
  nextBtn: document.getElementById('next-page-btn'),
  paginationControls: document.getElementById('pagination-controls'),
  searchInput: document.getElementById('search-input'),
  statusFilter: document.getElementById('status-filter'),
  genderFilter: document.getElementById('gender-filter')
};

/**
 * Actualiza la barra de paginación según el estado actual de la consulta.
 * Deshabilita los botones de navegación en los extremos (página 1 y última)
 * o mientras una petición de red está en progreso.
 */
function updatePaginationUI() {
  if (DOM.pageInfo) {
    const total = state.totalPages > 0 ? state.totalPages : 1;
    DOM.pageInfo.innerHTML = `Página <span class="current-page">${state.currentPage}</span> de ${total}`;
  }

  // Deshabilitamos el botón Anterior si estamos en la primera página o cargando
  if (DOM.prevBtn) {
    DOM.prevBtn.disabled = state.currentPage <= 1 || state.isLoading || state.totalPages <= 1;
  }

  // Deshabilitamos el botón Siguiente si estamos en la última página o cargando
  if (DOM.nextBtn) {
    DOM.nextBtn.disabled = state.currentPage >= state.totalPages || state.isLoading || state.totalPages <= 1;
  }
}

/**
 * Desplaza la vista suavemente hacia el inicio del grid de personajes.
 * Se invoca cada vez que se carga una nueva página de resultados, para evitar
 * que el usuario tenga que hacer scroll manual hacia arriba.
 */
function scrollToGrid() {
  if (DOM.grid) {
    const gridTop = DOM.grid.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top: Math.max(0, gridTop), behavior: 'smooth' });
  }
}

/**
 * Consulta la API y renderiza el listado de personajes según el estado y filtros actuales.
 * 
 * @param {number} [page=1] - Página que se desea cargar
 */
export async function loadCharacters(page = 1) {
  // Prevenimos peticiones concurrentes: si ya hay una carga activa, ignoramos
  if (state.isLoading) return;

  state.isLoading = true;
  state.currentPage = page;
  updatePaginationUI();

  // Renderizamos el estado de carga animado del portal
  if (DOM.grid) {
    DOM.grid.innerHTML = renderLoader();
  }

  // Petición al servicio de la API con los filtros unificados.
  // Clave pedagógica: los filtros activos se pasan siempre juntos en la misma
  // petición, garantizando que la API los combine correctamente.
  const response = await fetchCharacters({
    page: state.currentPage,
    name: state.filters.name,
    status: state.filters.status,
    gender: state.filters.gender
  });

  state.isLoading = false;

  // 1. Manejo de error de red o de servidor
  if (response.error) {
    if (DOM.grid) {
      DOM.grid.innerHTML = renderError(response.error);
      const retryBtn = document.getElementById('retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => loadCharacters(state.currentPage));
      }
    }
    state.totalPages = 0;
    updatePaginationUI();
    return;
  }

  // 2. Manejo de resultado vacío (sin coincidencias para los filtros aplicados)
  if (response.isEmpty || !response.results || response.results.length === 0) {
    state.characters = [];
    state.totalPages = 0;
    if (DOM.grid) {
      DOM.grid.innerHTML = renderEmpty(state.filters.name);
    }
    updatePaginationUI();
    return;
  }

  // 3. Renderizado exitoso de personajes
  state.characters = response.results;
  state.totalPages = response.info?.pages || 1;

  if (DOM.grid) {
    DOM.grid.innerHTML = state.characters
      .map(character => renderCharacterCard(character, false))
      .join('');
  }

  updatePaginationUI();
  scrollToGrid();
}

/**
 * Configura los escuchadores de eventos de la interfaz.
 * Agrupa búsqueda, filtros y controles de paginación.
 */
function initEventListeners() {
  // ─── Búsqueda Reactiva (Debounce 350ms) ──────────────────────────────────
  // El patrón Debounce evita enviar una petición por cada pulsación de tecla.
  // Solo ejecuta la búsqueda cuando el usuario se detiene 350ms.
  if (DOM.searchInput) {
    DOM.searchInput.addEventListener(
      'input',
      debounce((event) => {
        const query = event.target.value.trim();
        if (state.filters.name !== query) {
          state.filters.name = query;
          // Importante: toda búsqueda nueva reinicia la paginación a la página 1.
          loadCharacters(1);
        }
      }, 350)
    );
  }

  // ─── Filtro por Estado (Alive / Dead / Unknown) ───────────────────────────
  if (DOM.statusFilter) {
    DOM.statusFilter.addEventListener('change', (event) => {
      state.filters.status = event.target.value;
      loadCharacters(1);
    });
  }

  // ─── Filtro por Género (Female / Male / Genderless / Unknown) ────────────
  if (DOM.genderFilter) {
    DOM.genderFilter.addEventListener('change', (event) => {
      state.filters.gender = event.target.value;
      loadCharacters(1);
    });
  }

  // ─── Paginación: Página Anterior ──────────────────────────────────────────
  // Navega a la página anterior preservando todos los filtros activos.
  // La validación de límites se realiza en updatePaginationUI() mediante
  // el atributo `disabled` del botón, pero añadimos una guarda adicional
  // en caso de activación programática.
  if (DOM.prevBtn) {
    DOM.prevBtn.addEventListener('click', () => {
      const previousPage = state.currentPage - 1;
      if (previousPage >= 1 && !state.isLoading) {
        loadCharacters(previousPage);
      }
    });
  }

  // ─── Paginación: Página Siguiente ─────────────────────────────────────────
  // Navega a la página siguiente conservando el estado de filtros y búsqueda.
  // La API de Rick and Morty limita a 42 páginas en el catálogo general y
  // menos para búsquedas filtradas, por lo que verificamos `totalPages`.
  if (DOM.nextBtn) {
    DOM.nextBtn.addEventListener('click', () => {
      const nextPage = state.currentPage + 1;
      if (nextPage <= state.totalPages && !state.isLoading) {
        loadCharacters(nextPage);
      }
    });
  }
}

/**
 * Inicialización al cargar la aplicación en el navegador.
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🧪 [Rick & Morty Explorer] Inicializando aplicación...');
  initEventListeners();
  loadCharacters(1);
});