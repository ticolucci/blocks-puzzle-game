/**
 * Get a random element from an array
 * @param {Array} array - The array to select from
 * @returns {*} A random element from the array
 * @throws {Error} If the array is empty
 * @example
 * const colors = ['red', 'blue', 'green'];
 * const randomColor = getRandomElement(colors);
 * // Returns: 'red', 'blue', or 'green'
 */
export function getRandomElement(array) {
  if (!array || array.length === 0) {
    throw new Error('Cannot get random element from empty array');
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
