/**
 * ============================================================================
 * COMPONENTES DE FEEDBACK VISUAL Y ESTADOS
 * ============================================================================
 * Este módulo contiene funciones generadoras para los estados de la interfaz:
 * 1. Loader (Carga activa con portal animado)
 * 2. Error (Fallo de red o servidor)
 * 3. Sin Resultados (Filtro sin coincidencias)
 */

/**
 * Genera el marcado HTML para el estado de carga animado.
 * @returns {string} Fragmento HTML del Loader
 */
export function renderLoader() {
  return `
    <div class="status-feedback" role="status" aria-live="polite">
      <div class="portal-loader" aria-hidden="true"></div>
      <p class="status-feedback__desc">Abriendo portal interdimensional...</p>
    </div>
  `;
}

/**
 * Genera el marcado HTML cuando ocurre un error de comunicación.
 * 
 * @param {string} [message='Hubo un fallo al conectar con la dimensión C-137'] - Mensaje explicativo
 * @returns {string} Fragmento HTML del Error
 */
export function renderError(message = 'Hubo un fallo al conectar con la dimensión C-137') {
  return `
    <div class="status-feedback status-feedback--error" role="alert">
      <span class="status-feedback__icon" aria-hidden="true">💥</span>
      <h3 class="status-feedback__title">¡Wubba Lubba Dub Dub!</h3>
      <p class="status-feedback__desc">${message}</p>
      <button id="retry-btn" class="btn btn--primary" style="margin-top: 1rem;">
        🔄 Reintentar conexión
      </button>
    </div>
  `;
}

/**
 * Genera el marcado HTML cuando una búsqueda no arroja coincidencias.
 * 
 * @param {string} [query=''] - Término o filtro que causó el resultado vacío
 * @returns {string} Fragmento HTML de estado vacío
 */
export function renderEmpty(query = '') {
  const queryText = query ? ` para "<strong>${query}</strong>"` : '';
  return `
    <div class="status-feedback" role="status">
      <span class="status-feedback__icon" aria-hidden="true">🛸</span>
      <h3 class="status-feedback__title">Sin vida detectada</h3>
      <p class="status-feedback__desc">
        No se encontraron personajes en esta dimensión${queryText}. Intenta ajustar tus filtros o buscar con otro nombre.
      </p>
    </div>
  `;
}
