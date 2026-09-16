/**
 * ============================================================================
 * COMPONENTE: TARJETA DE PERSONAJE (CharacterCard)
 * ============================================================================
 * Función pura encargada de recibir la entidad de un personaje y generar su
 * representación semántica en HTML.
 * 
 * Conceptos pedagógicos aplicados:
 * 1. Funciones Puras: La función no modifica el estado exterior; dado el mismo
 *    personaje y estado de favorito, produce siempre el mismo HTML.
 * 2. Data Attributes (`data-id`, `data-action`): Permiten delegar eventos
 *    eficientemente desde el contenedor padre (Event Delegation).
 * 3. Sanitización básica y validación de campos faltantes ("Unknown").
 */

/**
 * Traduce el estado del inglés al español para una mejor experiencia de usuario.
 * @param {string} status - Estado original ('Alive', 'Dead', 'unknown')
 * @returns {string} Estado traducido
 */
function translateStatus(status) {
  switch (status.toLowerCase()) {
    case 'alive':
      return 'Vivo';
    case 'dead':
      return 'Muerto';
    default:
      return 'Desconocido';
  }
}

/**
 * Retorna la clase modificadora para el punto de color según el estado.
 * @param {string} status - Estado original del personaje
 * @returns {string} Clase CSS correspondiente
 */
function getStatusClass(status) {
  const normalized = status.toLowerCase();
  if (normalized === 'alive') return 'status-dot--alive';
  if (normalized === 'dead') return 'status-dot--dead';
  return 'status-dot--unknown';
}

/**
 * Genera el string HTML correspondiente a una tarjeta de personaje.
 * 
 * @param {Object} character - Objeto personaje devuelto por la API
 * @param {boolean} [isFavorite=false] - Indica si el personaje está guardado en favoritos
 * @returns {string} Fragmento HTML de la tarjeta
 */
export function renderCharacterCard(character, isFavorite = false) {
  const { id, name, status, species, gender, image, origin, location } = character;

  const statusClass = getStatusClass(status);
  const statusSpanish = translateStatus(status);
  const favActiveClass = isFavorite ? 'is-favorite' : '';
  const favAriaLabel = isFavorite ? `Quitar a ${name} de favoritos` : `Agregar a ${name} a favoritos`;

  return `
    <article class="character-card" data-card-id="${id}">
      <!-- Cabecera de la tarjeta con imagen y botón de favorito -->
      <div class="character-card__media">
        <img 
          src="${image}" 
          alt="${name}" 
          class="character-card__image" 
          loading="lazy" 
        />
        <button 
          class="btn btn--favorite character-card__fav-btn ${favActiveClass}" 
          data-action="toggle-favorite" 
          data-id="${id}" 
          aria-label="${favAriaLabel}"
          title="${favAriaLabel}"
        >
          ⭐
        </button>
      </div>

      <!-- Contenido descriptivo del personaje -->
      <div class="character-card__body">
        <header class="character-card__header">
          <h2 class="character-card__name" title="${name}">${name}</h2>
          <div class="character-card__status">
            <span class="status-dot ${statusClass}" aria-hidden="true"></span>
            <span>${statusSpanish} • ${species}</span>
          </div>
        </header>

        <!-- Metadata relevante -->
        <div class="character-card__meta">
          <div class="character-card__meta-item">
            <span class="label">Última ubicación:</span>
            <span class="value" title="${location?.name || 'Desconocida'}">
              ${location?.name || 'Desconocida'}
            </span>
          </div>
          <div class="character-card__meta-item">
            <span class="label">Origen:</span>
            <span class="value" title="${origin?.name || 'Desconocido'}">
              ${origin?.name || 'Desconocido'}
            </span>
          </div>
        </div>

        <!-- Botón de acción para el detalle -->
        <footer class="character-card__footer">
          <button 
            class="btn btn--secondary" 
            data-action="view-details" 
            data-id="${id}"
          >
            🔍 Ver detalles
          </button>
        </footer>
      </div>
    </article>
  `;
}
