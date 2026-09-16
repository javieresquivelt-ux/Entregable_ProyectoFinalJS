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
 * 7. Abrir y cerrar el modal de detalle con episodios paralelos.
 * 8. Gestionar favoritos con persistencia en localStorage y vista exclusiva.
 */

// Importación de los estilos globales (Sass)
import './scss/app.scss';

// Importación de servicios, componentes y utilidades
import { fetchCharacters, fetchEpisodesByUrls } from './js/services/api.js';
import { renderCharacterCard } from './js/components/CharacterCard.js';
import { renderLoader, renderError, renderEmpty } from './js/components/StateFeedback.js';
import { debounce } from './js/utils/debounce.js';
import { openModal, initModalListeners } from './js/components/Modal.js';
import {
  toggleFavorite,
  isFavorite,
  getFavoritesCount,
  getFavoritesArray
} from './js/services/favorites.js';

/**
 * Estado reactivo centralizado.
 * `activeTab` controla si se muestra el catálogo general ('all') o solo favoritos ('favs').
 */
const state = {
  currentPage: 1,
  totalPages: 1,
  characters: [],
  isLoading: false,
  activeTab: 'all',   // 'all' | 'favs'
  filters: {
    name: '',
    status: '',
    gender: ''
  }
};

/**
 * Referencias cacheadas a los elementos del DOM.
 */
const DOM = {
  grid: document.getElementById('characters-grid'),
  pageInfo: document.getElementById('page-info'),
  prevBtn: document.getElementById('prev-page-btn'),
  nextBtn: document.getElementById('next-page-btn'),
  paginationControls: document.getElementById('pagination-controls'),
  searchInput: document.getElementById('search-input'),
  statusFilter: document.getElementById('status-filter'),
  genderFilter: document.getElementById('gender-filter'),
  tabAll: document.getElementById('tab-all'),
  tabFavs: document.getElementById('tab-favs'),
  favCount: document.getElementById('fav-count')
};

// ============================================================================
// UTILIDADES DE UI
// ============================================================================

/**
 * Actualiza el indicador de página y el estado habilitado/deshabilitado
 * de los botones de navegación.
 */
function updatePaginationUI() {
  const isVisible = state.activeTab === 'all' && state.totalPages > 1;

  if (DOM.paginationControls) {
    // Ocultamos la paginación cuando se está en la vista de Favoritos
    DOM.paginationControls.style.visibility = isVisible ? 'visible' : 'hidden';
  }

  if (DOM.pageInfo) {
    const total = state.totalPages > 0 ? state.totalPages : 1;
    DOM.pageInfo.innerHTML = `Página <span class="current-page">${state.currentPage}</span> de ${total}`;
  }

  if (DOM.prevBtn) {
    DOM.prevBtn.disabled = state.currentPage <= 1 || state.isLoading || state.totalPages <= 1;
  }

  if (DOM.nextBtn) {
    DOM.nextBtn.disabled = state.currentPage >= state.totalPages || state.isLoading || state.totalPages <= 1;
  }
}

/**
 * Actualiza el contador de favoritos en la pestaña y el estado visual de las pestañas.
 */
function updateTabsUI() {
  const count = getFavoritesCount();
  if (DOM.favCount) DOM.favCount.textContent = count;

  if (DOM.tabAll) {
    DOM.tabAll.classList.toggle('tab-btn--active', state.activeTab === 'all');
    DOM.tabAll.setAttribute('aria-selected', state.activeTab === 'all');
  }

  if (DOM.tabFavs) {
    DOM.tabFavs.classList.toggle('tab-btn--active', state.activeTab === 'favs');
    DOM.tabFavs.setAttribute('aria-selected', state.activeTab === 'favs');
  }
}

/**
 * Desplaza la vista suavemente al inicio del grid de personajes.
 */
function scrollToGrid() {
  if (DOM.grid) {
    const gridTop = DOM.grid.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top: Math.max(0, gridTop), behavior: 'smooth' });
  }
}

// ============================================================================
// CARGA Y RENDERIZADO DE PERSONAJES
// ============================================================================

/**
 * Consulta la API y renderiza personajes según los filtros y la página activa.
 * Bloqueada si ya hay una carga en progreso (guarda anti-concurrencia).
 *
 * @param {number} [page=1] - Número de página a cargar
 */
export async function loadCharacters(page = 1) {
  if (state.isLoading) return;

  state.isLoading = true;
  state.currentPage = page;
  updatePaginationUI();

  if (DOM.grid) DOM.grid.innerHTML = renderLoader();

  const response = await fetchCharacters({
    page: state.currentPage,
    name: state.filters.name,
    status: state.filters.status,
    gender: state.filters.gender
  });

  state.isLoading = false;

  if (response.error) {
    if (DOM.grid) {
      DOM.grid.innerHTML = renderError(response.error);
      document.getElementById('retry-btn')?.addEventListener('click', () => loadCharacters(state.currentPage));
    }
    state.totalPages = 0;
    updatePaginationUI();
    return;
  }

  if (response.isEmpty || !response.results?.length) {
    state.characters = [];
    state.totalPages = 0;
    if (DOM.grid) DOM.grid.innerHTML = renderEmpty(state.filters.name);
    updatePaginationUI();
    return;
  }

  state.characters = response.results;
  state.totalPages = response.info?.pages || 1;

  if (DOM.grid) {
    // Pasamos el estado de favorito actual a cada tarjeta al renderizar
    DOM.grid.innerHTML = state.characters
      .map(character => renderCharacterCard(character, isFavorite(character.id)))
      .join('');
  }

  updatePaginationUI();
  scrollToGrid();
}

/**
 * Renderiza la vista exclusiva de favoritos desde el localStorage.
 * No realiza ninguna petición a la API.
 */
function renderFavoritesView() {
  const favorites = getFavoritesArray();

  if (DOM.grid) {
    if (favorites.length === 0) {
      DOM.grid.innerHTML = `
        <div class="status-feedback" role="status">
          <span class="status-feedback__icon" aria-hidden="true">⭐</span>
          <h3 class="status-feedback__title">Sin favoritos aún</h3>
          <p class="status-feedback__desc">
            Marca personajes con ⭐ desde el catálogo para verlos aquí.
          </p>
        </div>
      `;
    } else {
      // Todos los personajes de esta vista son favoritos, por eso isFavorite = true
      DOM.grid.innerHTML = favorites
        .map(character => renderCharacterCard(character, true))
        .join('');
    }
  }

  // En la vista de favoritos, ocultamos la paginación
  updatePaginationUI();
}

// ============================================================================
// EVENTOS
// ============================================================================

/**
 * Registra todos los escuchadores de eventos de la interfaz.
 */
function initEventListeners() {
  // ─── Búsqueda con Debounce ────────────────────────────────────────────────
  if (DOM.searchInput) {
    DOM.searchInput.addEventListener(
      'input',
      debounce((event) => {
        const query = event.target.value.trim();
        if (state.filters.name !== query) {
          state.filters.name = query;
          // Si se busca desde la pestaña de favoritos, volvemos a "Todos"
          if (state.activeTab === 'favs') switchTab('all');
          else loadCharacters(1);
        }
      }, 350)
    );
  }

  // ─── Filtro por Estado ────────────────────────────────────────────────────
  if (DOM.statusFilter) {
    DOM.statusFilter.addEventListener('change', (event) => {
      state.filters.status = event.target.value;
      if (state.activeTab === 'favs') switchTab('all');
      else loadCharacters(1);
    });
  }

  // ─── Filtro por Género ────────────────────────────────────────────────────
  if (DOM.genderFilter) {
    DOM.genderFilter.addEventListener('change', (event) => {
      state.filters.gender = event.target.value;
      if (state.activeTab === 'favs') switchTab('all');
      else loadCharacters(1);
    });
  }

  // ─── Paginación: Anterior ─────────────────────────────────────────────────
  if (DOM.prevBtn) {
    DOM.prevBtn.addEventListener('click', () => {
      const prev = state.currentPage - 1;
      if (prev >= 1 && !state.isLoading) loadCharacters(prev);
    });
  }

  // ─── Paginación: Siguiente ────────────────────────────────────────────────
  if (DOM.nextBtn) {
    DOM.nextBtn.addEventListener('click', () => {
      const next = state.currentPage + 1;
      if (next <= state.totalPages && !state.isLoading) loadCharacters(next);
    });
  }

  // ─── Pestañas: Todos / Favoritos ──────────────────────────────────────────
  DOM.tabAll?.addEventListener('click', () => switchTab('all'));
  DOM.tabFavs?.addEventListener('click', () => switchTab('favs'));

  // ─── Event Delegation: Grid de Personajes ─────────────────────────────────
  // Un único listener maneja tanto "Ver detalles" como "Toggle Favorito"
  if (DOM.grid) {
    DOM.grid.addEventListener('click', async (event) => {
      // 1. Botón de Ver Detalles → abre el modal
      const detailBtn = event.target.closest('[data-action="view-details"]');
      if (detailBtn) {
        const characterId = parseInt(detailBtn.dataset.id, 10);
        // Buscamos el personaje en el estado local (vista 'all') o en favoritos (vista 'favs')
        const character =
          state.characters.find(c => c.id === characterId) ||
          getFavoritesArray().find(c => c.id === characterId);

        if (character) {
          await openModal(character, fetchEpisodesByUrls);
        }
        return;
      }

      // 2. Botón de Favorito → toggle sin re-render del grid completo
      const favBtn = event.target.closest('[data-action="toggle-favorite"]');
      if (favBtn) {
        const characterId = parseInt(favBtn.dataset.id, 10);
        const character =
          state.characters.find(c => c.id === characterId) ||
          getFavoritesArray().find(c => c.id === characterId);

        if (character) {
          const nowFavorite = toggleFavorite(character);

          // Actualización quirúrgica: solo actualizamos el botón afectado,
          // sin re-renderizar todo el grid (evita parpadeos y pérdida de scroll)
          favBtn.classList.toggle('is-favorite', nowFavorite);
          favBtn.setAttribute(
            'aria-label',
            nowFavorite ? `Quitar a ${character.name} de favoritos` : `Agregar a ${character.name} a favoritos`
          );

          // Si estamos en la vista de favoritos y desmarcamos, quitamos la tarjeta
          if (state.activeTab === 'favs' && !nowFavorite) {
            const card = DOM.grid.querySelector(`[data-card-id="${characterId}"]`);
            if (card) {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity = '0';
              card.style.transform = 'scale(0.95)';
              setTimeout(() => {
                card.remove();
                // Si ya no quedan favoritos, mostramos el estado vacío
                if (getFavoritesCount() === 0) renderFavoritesView();
              }, 300);
            }
          }

          // Actualizamos el contador en la pestaña
          updateTabsUI();
        }
      }
    });
  }

  // ─── Listeners del Modal (cierre) ─────────────────────────────────────────
  initModalListeners();
}

// ============================================================================
// CONTROL DE PESTAÑAS
// ============================================================================

/**
 * Cambia la pestaña activa entre el catálogo general y la vista de favoritos.
 *
 * @param {'all' | 'favs'} tab - La pestaña destino
 */
function switchTab(tab) {
  state.activeTab = tab;
  updateTabsUI();

  if (tab === 'favs') {
    renderFavoritesView();
  } else {
    // Volvemos a cargar el catálogo con los filtros actuales desde la página actual
    loadCharacters(state.currentPage);
  }
}

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🧪 [Rick & Morty Explorer] Inicializando aplicación...');
  updateTabsUI();     // Muestra el contador de favoritos persistidos al cargar
  initEventListeners();
  loadCharacters(1);
});