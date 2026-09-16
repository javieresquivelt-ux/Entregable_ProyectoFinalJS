/**
 * ============================================================================
 * UTILIDAD: PATRÓN DE OPTIMIZACIÓN DEBOUNCE
 * ============================================================================
 * Esta función de orden superior (Higher-Order Function) retrasa la ejecución
 * de una función hasta que haya transcurrido un tiempo determinado desde la última
 * vez que fue invocada.
 * 
 * Conceptos pedagógicos clave:
 * 1. Closure (Clausura): La función retornada retiene acceso a la variable
 *    `timeoutId` definida en el ámbito exterior, permitiendo cancelar temporizadores
 *    previos entre ejecuciones sucesivas.
 * 2. Event Loop y Timers: `clearTimeout` cancela la tarea encolada en la Web API
 *    del navegador, evitando disparar peticiones intermedias.
 * 3. Preservación del Contexto: Uso de `callback.apply(this, args)` para mantener
 *    intactos el receptor (`this`) y los parámetros del evento original.
 * 
 * @param {Function} callback - Función que deseamos optimizar (ej. búsqueda)
 * @param {number} [delay=350] - Tiempo de espera en milisegundos
 * @returns {Function} Función debounced lista para asociar a eventos del DOM
 */
export function debounce(callback, delay = 350) {
  let timeoutId = null;

  return function (...args) {
    // Si el usuario vuelve a presionar una tecla antes de expirar el tiempo,
    // cancelamos el temporizador anterior.
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Iniciamos una nueva cuenta regresiva
    timeoutId = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}
