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
 * 6. Actualizar dinámicamente los componentes visuales de la interfaz.
 */

// Importación de los estilos globales (Sass)
import './scss/app.scss';

// Importación de servicios, componentes modulares y utilidades
import { fetchCharacters } from './js/services/api.js';
import { renderCharacterCard } from './js/components/CharacterCard.js';
import { renderLoader, renderError, renderEmpty } from './js/components/StateFeedback.js';
import { debounce } from './js/utils/debounce.js';

/**
 * Estado reactivo centralizado de la aplicación.
 * Cualquier cambio de filtro o página actualiza este objeto antes de consultar la API.
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
 */
function updatePaginationUI() {
  if (DOM.pageInfo) {
    DOM.pageInfo.innerHTML = `Página <span class="current-page">${state.currentPage}</span> de ${state.totalPages || 1}`;
  }

  // Deshabilita botones en los extremos o durante la carga
  if (DOM.prevBtn) {
    DOM.prevBtn.disabled = state.currentPage <= 1 || state.isLoading || state.totalPages <= 1;
  }

  if (DOM.nextBtn) {
    DOM.nextBtn.disabled = state.currentPage >= state.totalPages || state.isLoading || state.totalPages <= 1;
  }
}

/**
 * Consulta la API y renderiza el listado de personajes según el estado y filtros actuales.
 * 
 * @param {number} [page=1] - Página que se desea cargar
 */
export async function loadCharacters(page = 1) {
  state.isLoading = true;
  state.currentPage = page;
  updatePaginationUI();

  // Renderizamos el estado de carga animado del portal
  if (DOM.grid) {
    DOM.grid.innerHTML = renderLoader();
  }

  // Petición al servicio de la API con los filtros unificados
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

  // 2. Manejo de resultado vacío (sin coincidencias)
  if (response.isEmpty || !response.results || response.results.length === 0) {
    state.characters = [];
    state.totalPages = 0;
    if (DOM.grid) {
      // Pasamos el término de búsqueda actual si existe para contextualizar el mensaje
      DOM.grid.innerHTML = renderEmpty(state.filters.name);
    }
    updatePaginationUI();
    return;
  }

  // 3. Renderizado exitoso de personajes
  state.characters = response.results;
  state.totalPages = response.info?.pages || 1;

  if (DOM.grid) {
    // Generamos las tarjetas dinámicas a partir de los datos recibidos
    DOM.grid.innerHTML = state.characters
      .map(character => renderCharacterCard(character, false))
      .join('');
  }

  updatePaginationUI();
}

/**
 * Configura los escuchadores de eventos para la búsqueda y los filtros combinados.
 */
function initEventListeners() {
  // 1. Búsqueda reactiva optimizada con Debounce (350ms)
  if (DOM.searchInput) {
    DOM.searchInput.addEventListener(
      'input',
      debounce((event) => {
        const query = event.target.value.trim();
        // Solo recargamos si el valor de búsqueda ha cambiado efectivamente
        if (state.filters.name !== query) {
          state.filters.name = query;
          loadCharacters(1); // Reiniciamos siempre a la primera página en cada nueva búsqueda
        }
      }, 350)
    );
  }

  // 2. Filtro por Estado (Alive, Dead, Unknown)
  if (DOM.statusFilter) {
    DOM.statusFilter.addEventListener('change', (event) => {
      state.filters.status = event.target.value;
      loadCharacters(1);
    });
  }

  // 3. Filtro por Género (Female, Male, Genderless, Unknown)
  if (DOM.genderFilter) {
    DOM.genderFilter.addEventListener('change', (event) => {
      state.filters.gender = event.target.value;
      loadCharacters(1);
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