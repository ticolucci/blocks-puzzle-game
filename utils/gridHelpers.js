/**
 * Creates an empty grid data structure for the game board
 * @param {number} size - The size of the grid (e.g., 10 for 10x10)
 * @returns {Array<Array<{row: number, col: number, filled: boolean, svgRef: string|null}>>} 2D array of grid cells
 */
export const createEmptyGrid = (size) => {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => ({
      row,
      col,
      filled: false,
      svgRef: null,
    }))
  );
};
