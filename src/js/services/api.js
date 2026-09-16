/**
 * ============================================================================
 * SERVICIO DE COMUNICACIÓN CON LA API DE RICK AND MORTY
 * ============================================================================
 * Este módulo centraliza todas las llamadas HTTP hacia la API oficial:
 * https://rickandmortyapi.com/documentation/#rest
 * 
 * Conceptos pedagógicos aplicados:
 * 1. Funciones Asíncronas (async/await) para código secuencial y legible.
 * 2. Manejo Defensivo de Errores: La API de Rick and Morty responde con un HTTP 404
 *    cuando una búsqueda con filtros no arroja resultados. En lugar de permitir que
 *    la aplicación falle, transformamos ese 404 en una estructura de datos segura
 *    con un arreglo vacío.
 * 3. URLSearchParams para serializar y codificar parámetros de consulta sin riesgo
 *    de inyecciones o caracteres mal formateados.
 */

const BASE_URL = 'https://rickandmortyapi.com/api';

/**
 * Consulta la lista de personajes con soporte de paginación y filtros combinables.
 * 
 * @param {Object} params - Parámetros de consulta
 * @param {number} [params.page=1] - Número de página actual
 * @param {string} [params.name=''] - Término de búsqueda por nombre
 * @param {string} [params.status=''] - Filtro por estado ('alive', 'dead', 'unknown')
 * @param {string} [params.gender=''] - Filtro por género ('female', 'male', 'genderless', 'unknown')
 * @returns {Promise<{ info: Object, results: Array, error?: string }>} Objeto con información de paginación y lista de personajes
 */
export async function fetchCharacters({ page = 1, name = '', status = '', gender = '' } = {}) {
  try {
    // Construcción dinámica de los parámetros de búsqueda (Query Params)
    const queryParams = new URLSearchParams();

    if (page) queryParams.set('page', page);
    if (name && name.trim() !== '') queryParams.set('name', name.trim());
    if (status && status.trim() !== '') queryParams.set('status', status.trim());
    if (gender && gender.trim() !== '') queryParams.set('gender', gender.trim());

    const endpoint = `${BASE_URL}/character/?${queryParams.toString()}`;

    const response = await fetch(endpoint);

    // Caso especial de la Rick and Morty API:
    // Un status 404 significa que la búsqueda no produjo coincidencias.
    // Devolvemos una estructura vacía controlada para no arrojar una excepción.
    if (response.status === 404) {
      return {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
        isEmpty: true
      };
    }

    // Verificamos si hubo algún otro error de servidor o de red
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      info: data.info,
      results: data.results,
      isEmpty: false
    };

  } catch (error) {
    // Si la conexión falló o hubo un error inesperado, lo capturamos
    console.error('[API Service Error] Fallo al consultar personajes:', error);
    return {
      info: { count: 0, pages: 0, next: null, prev: null },
      results: [],
      error: error.message || 'Error de conexión con el multiverso'
    };
  }
}

/**
 * Consulta un personaje específico a través de su ID único.
 * Útil para abrir la ficha extendida en el modal.
 * 
 * @param {number|string} id - Identificador del personaje
 * @returns {Promise<Object|null>} Datos completos del personaje o null si falló
 */
export async function fetchCharacterById(id) {
  try {
    const response = await fetch(`${BASE_URL}/character/${id}`);
    if (!response.ok) {
      throw new Error(`No se pudo obtener el personaje con ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[API Service Error] Fallo al consultar personaje ${id}:`, error);
    return null;
  }
}

/**
 * Consulta múltiples episodios en paralelo a partir de sus URLs.
 * 
 * Concepto pedagógico: Promise.all() ejecuta todas las promesas simultáneamente
 * en lugar de esperar una por una. Para Rick Sanchez (51 episodios), esto reduce
 * el tiempo de espera de ~20s (serie) a ~2s (paralelo).
 * 
 * Limitamos a los primeros 20 episodios para no sobrecargar la API pública.
 * 
 * @param {string[]} urls - Array de URLs de episodios del personaje
 * @returns {Promise<Object[]>} Lista de objetos de episodio
 */
export async function fetchEpisodesByUrls(urls = []) {
  try {
    // Limitamos a los primeros 20 episodios para evitar sobrecarga de la API pública
    const limitedUrls = urls.slice(0, 20);

    // Promise.all() ejecuta todas las peticiones en paralelo
    // Si cualquiera falla, el catch de abajo lo gestiona sin romper la app
    const responses = await Promise.all(
      limitedUrls.map(url => fetch(url))
    );

    // Parseamos el JSON de cada respuesta también en paralelo
    const episodes = await Promise.all(
      responses
        .filter(res => res.ok) // Descartamos silenciosamente las respuestas fallidas
        .map(res => res.json())
    );

    return episodes;
  } catch (error) {
    console.error('[API Service Error] Fallo al consultar episodios:', error);
    return [];
  }
}

