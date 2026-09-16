/**
 * ============================================================================
 * SERVICIO: GESTIÓN DE FAVORITOS CON PERSISTENCIA EN localStorage
 * ============================================================================
 * Este módulo encapsula toda la lógica de favoritos, manteniendo una única
 * fuente de verdad en el almacenamiento local del navegador.
 *
 * Conceptos pedagógicos aplicados:
 * 1. Encapsulamiento: La clave del localStorage y la lógica de serialización
 *    viven en este módulo. El resto de la app no necesita conocer la implementación.
 * 2. Patrón de Objeto Plano (POJO): Guardamos objetos de personaje completos,
 *    evitando peticiones adicionales a la API al mostrar la vista de favoritos.
 * 3. Manejo Defensivo: JSON.parse puede lanzar excepciones si el valor en
 *    localStorage fue corrompido; lo capturamos y reseteamos.
 */

/** Clave única del localStorage para esta aplicación */
const STORAGE_KEY = 'rmx_favorites';

/**
 * Lee los favoritos almacenados y los retorna como un Map indexado por ID.
 * Usar un Map permite operaciones de búsqueda y verificación en O(1).
 *
 * @returns {Map<number, Object>} Mapa de personajes favoritos
 */
export function getFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Map();

    // Parseamos el array de personajes y lo convertimos a Map para acceso eficiente
    const favoritesArray = JSON.parse(raw);
    return new Map(favoritesArray.map(character => [character.id, character]));
  } catch (error) {
    // Si el JSON estaba corrompido, limpiamos y devolvemos un Map vacío
    console.warn('[Favorites] Error al leer localStorage, reseteando:', error);
    localStorage.removeItem(STORAGE_KEY);
    return new Map();
  }
}

/**
 * Guarda el Map de favoritos en el localStorage como JSON.
 * Esta función es privada a este módulo (no exportada).
 *
 * @param {Map<number, Object>} favoritesMap - El Map actualizado de favoritos
 */
function saveFavorites(favoritesMap) {
  // Convertimos el Map a un array de valores para serialización JSON
  const favoritesArray = Array.from(favoritesMap.values());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritesArray));
}

/**
 * Alterna el estado de favorito de un personaje:
 * - Si ya era favorito, lo elimina del mapa.
 * - Si no lo era, lo agrega con todos sus datos.
 *
 * @param {Object} character - Objeto completo del personaje
 * @returns {boolean} El nuevo estado de favorito (true = añadido, false = eliminado)
 */
export function toggleFavorite(character) {
  const favorites = getFavorites();

  if (favorites.has(character.id)) {
    favorites.delete(character.id);
  } else {
    favorites.set(character.id, character);
  }

  saveFavorites(favorites);
  return favorites.has(character.id);
}

/**
 * Verifica si un personaje está marcado como favorito.
 * Función pura: no modifica el estado, solo consulta.
 *
 * @param {number|string} id - ID del personaje a verificar
 * @returns {boolean} true si es favorito, false si no lo es
 */
export function isFavorite(id) {
  const favorites = getFavorites();
  return favorites.has(Number(id));
}

/**
 * Retorna el número total de personajes favoritos guardados.
 *
 * @returns {number} Cantidad de favoritos
 */
export function getFavoritesCount() {
  return getFavorites().size;
}

/**
 * Retorna los favoritos como un array ordenado de objetos de personaje.
 * Útil para renderizar la vista de favoritos sin peticiones a la API.
 *
 * @returns {Object[]} Array de objetos de personaje marcados como favoritos
 */
export function getFavoritesArray() {
  return Array.from(getFavorites().values());
}
