/**
 * ============================================================================
 * COMPONENTE: MODAL DE DETALLE EXTENDIDO DEL PERSONAJE
 * ============================================================================
 * Este módulo controla el ciclo de vida del diálogo modal nativo `<dialog>`.
 *
 * Conceptos pedagógicos aplicados:
 * 1. API nativa `<dialog>`: showModal() / close() con accesibilidad gratuita
 *    (focus management, aria-modal, cierre con tecla Escape).
 * 2. Función pura `renderModalContent`: genera el HTML sin efectos secundarios.
 * 3. Delegación del cierre mediante clic en el backdrop (::backdrop del dialog).
 */

// Referencia cacheada al elemento dialog del DOM
const dialogEl = document.getElementById('character-modal');
const modalBodyEl = document.getElementById('modal-body');
const closeBtn = document.getElementById('close-modal-btn');

/**
 * Genera el HTML del contenido del modal a partir de los datos del personaje.
 * Esta función es pura: no accede ni modifica el DOM, solo retorna un string.
 *
 * @param {Object} character - Datos completos del personaje
 * @param {Object[]} episodes - Lista de objetos de episodio (máx. 20)
 * @returns {string} Fragmento HTML completo del modal
 */
export function renderModalContent(character, episodes = []) {
  const { name, image, status, species, gender, origin, location } = character;

  // Determinar la clase de color para el badge de estado
  const statusClass =
    status.toLowerCase() === 'alive'
      ? 'status-dot--alive'
      : status.toLowerCase() === 'dead'
      ? 'status-dot--dead'
      : 'status-dot--unknown';

  const statusLabels = { alive: 'Vivo', dead: 'Muerto', unknown: 'Desconocido' };
  const statusSpanish = statusLabels[status.toLowerCase()] || status;

  const genderLabels = {
    female: 'Femenino',
    male: 'Masculino',
    genderless: 'Sin género',
    unknown: 'Desconocido'
  };
  const genderSpanish = genderLabels[gender.toLowerCase()] || gender;

  // Generar los badges de episodios (cada objeto tiene name y episode = "S01E01")
  const episodeBadges = episodes.length > 0
    ? episodes.map(ep => `
        <span class="episode-badge" title="${ep.name}">
          ${ep.episode}
        </span>
      `).join('')
    : '<p style="color: var(--color-text-muted, #6b7280); font-size: 0.85rem;">Sin episodios disponibles</p>';

  return `
    <div class="modal__header">
      <img
        src="${image}"
        alt="${name}"
        class="modal__avatar"
        loading="lazy"
      />
      <div class="modal__info">
        <h2 id="modal-character-name">${name}</h2>
        <div class="character-card__status" style="justify-content: flex-start;">
          <span class="status-dot ${statusClass}" aria-hidden="true"></span>
          <span>${statusSpanish} &bull; ${species}</span>
        </div>
        <span style="font-size: 0.85rem; color: var(--color-text-muted, #6b7280);">
          Género: ${genderSpanish}
        </span>
      </div>
    </div>

    <div class="modal__body">
      <!-- Sección de Ubicación -->
      <div>
        <p class="modal__section-title">📍 Ubicación</p>
        <div class="modal__meta-grid">
          <div>
            <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-text-muted, #6b7280); letter-spacing: 0.05em;">Origen</span>
            <p style="color: #f5f6fa; font-weight: 500; margin-top: 0.2rem;">${origin?.name || 'Desconocido'}</p>
          </div>
          <div>
            <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-text-muted, #6b7280); letter-spacing: 0.05em;">Última ubicación</span>
            <p style="color: #f5f6fa; font-weight: 500; margin-top: 0.2rem;">${location?.name || 'Desconocida'}</p>
          </div>
        </div>
      </div>

      <!-- Sección de Episodios -->
      <div>
        <p class="modal__section-title">
          📺 Episodios (${episodes.length}${character.episode?.length > 20 ? ` de ${character.episode.length} — mostrando primeros 20` : ''})
        </p>
        <div class="modal__episodes-list">
          ${episodeBadges}
        </div>
      </div>
    </div>
  `;
}

/**
 * Abre el modal con el contenido del personaje y sus episodios.
 * Muestra un loader mientras se cargan los episodios en paralelo.
 *
 * @param {Object} character - Datos del personaje (ya disponibles en el estado)
 * @param {Function} fetchEpisodes - Función para cargar los episodios desde la API
 */
export async function openModal(character, fetchEpisodes) {
  if (!dialogEl || !modalBodyEl) return;

  // Mostrar loader mientras cargamos episodios
  modalBodyEl.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 300px; flex-direction: column; gap: 1rem;">
      <div class="portal-loader" aria-hidden="true"></div>
      <p style="color: #9aa0a6; font-size: 0.9rem;">Consultando el Consejo del Tiempo Rick...</p>
    </div>
  `;

  // Abrimos el modal (el elemento <dialog> aplica accesibilidad automáticamente)
  dialogEl.showModal();

  // Prevenimos scroll en el body mientras el modal está abierto
  document.body.style.overflow = 'hidden';

  // Cargamos los episodios en paralelo con Promise.all (via la función inyectada)
  const episodes = await fetchEpisodes(character.episode || []);

  // Una vez resueltas las promesas, renderizamos el contenido completo
  modalBodyEl.innerHTML = renderModalContent(character, episodes);
}

/**
 * Cierra el modal y restaura el scroll del body.
 */
export function closeModal() {
  if (!dialogEl) return;
  dialogEl.close();
  document.body.style.overflow = '';
}

/**
 * Configura los listeners de cierre del modal:
 * 1. Botón de cierre (×)
 * 2. Clic en el backdrop (área gris fuera del contenido)
 * 3. Tecla Escape (gestionada nativamente por <dialog>; disparamos closeModal para limpiar)
 */
export function initModalListeners() {
  // 1. Botón de cierre
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // 2. Clic en el backdrop: el <dialog> cubre toda la pantalla, pero el contenido
  //    interno (.modal__content) no. Si el clic fue directamente en el <dialog>,
  //    significa que se hizo clic fuera del contenido → cerramos.
  if (dialogEl) {
    dialogEl.addEventListener('click', (event) => {
      if (event.target === dialogEl) {
        closeModal();
      }
    });

    // 3. El evento 'close' del <dialog> (Escape incluido) siempre restaura el scroll
    dialogEl.addEventListener('close', () => {
      document.body.style.overflow = '';
    });
  }
}
