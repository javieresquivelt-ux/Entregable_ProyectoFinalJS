/**
 * ============================================================================
 * ORQUESTADOR PRINCIPAL: RICK AND MORTY EXPLORER
 * ============================================================================
 * Este archivo es el punto de entrada de la aplicación.
 * Se encarga de:
 * 1. Inicializar los estilos Sass.
 * 2. Gestionar el estado global de la vista (página actual, filtros, resultados).
 * 3. Orquestar la carga inicial de datos desde la API.
 * 4. Actualizar dinámicamente los componentes de la interfaz.
 */

// Importación de los estilos globales (Sass)
import './scss/app.scss';

// Importación de servicios y componentes modulares
import { fetchCharacters } from './js/services/api.js';
import { renderCharacterCard } from './js/components/CharacterCard.js';
import { renderLoader, renderError, renderEmpty } from './js/components/StateFeedback.js';

/**
 * Estado reactivo simple de la aplicación.
 * Centraliza la información para mantener una única fuente de la verdad (Single Source of Truth).
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
 * Referencias en caché a los elementos del DOM indispensables.
 */
const DOM = {
  grid: document.getElementById('characters-grid'),
  pageInfo: document.getElementById('page-info'),
  prevBtn: document.getElementById('prev-page-btn'),
  nextBtn: document.getElementById('next-page-btn')
};

/**
 * Actualiza la barra de paginación con el estado actual.
 */
function updatePaginationUI() {
  if (DOM.pageInfo) {
    DOM.pageInfo.innerHTML = `Página <span class="current-page">${state.currentPage}</span> de ${state.totalPages || 1}`;
  }

  if (DOM.prevBtn) {
    DOM.prevBtn.disabled = state.currentPage <= 1 || state.isLoading;
  }

  if (DOM.nextBtn) {
    DOM.nextBtn.disabled = state.currentPage >= state.totalPages || state.isLoading;
  }
}

/**
 * Consulta la API y renderiza el listado de personajes según el estado actual.
 * 
 * @param {number} [page=1] - Página que se desea cargar
 */
export async function loadCharacters(page = 1) {
  state.isLoading = true;
  state.currentPage = page;
  updatePaginationUI();

  // Renderizamos el estado de carga temático
  if (DOM.grid) {
    DOM.grid.innerHTML = renderLoader();
  }

  // Petición al servicio de la API
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
    updatePaginationUI();
    return;
  }

  // 2. Manejo de resultado vacío (sin coincidencias)
  if (response.isEmpty || response.results.length === 0) {
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
    // Generamos las tarjetas dinámicas
    DOM.grid.innerHTML = state.characters
      .map(character => renderCharacterCard(character, false))
      .join('');
  }

  updatePaginationUI();
}

/**
 * Inicialización al cargar la aplicación.
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🧪 [Rick & Morty Explorer] Inicializando aplicación...');
  loadCharacters(1);
});