/**
 * Check if a cell position is within the board bounds
 * @param {{row: number, col: number}} cell - The cell position to check
 * @param {number} boardSize - The size of the board (e.g., 10 for 10x10)
 * @returns {boolean} True if within bounds, false otherwise
 */
const isWithinBounds = (cell, boardSize) => {
  return cell.row >= 0 && cell.row < boardSize && cell.col >= 0 && cell.col < boardSize;
};

/**
 * Get the list of grid cells that would be occupied by placing a piece
 * @param {{shape: number[][]}} piece - The piece to place
 * @param {number} gridRow - The starting row position
 * @param {number} gridCol - The starting column position
 * @returns {Array<{row: number, col: number}>} Array of affected cell positions
 * @example
 * const piece = { shape: [[1, 1], [1, 1]] };
 * const cells = getAffectedCells(piece, 5, 5);
 * // Returns: [{row: 5, col: 5}, {row: 5, col: 6}, {row: 6, col: 5}, {row: 6, col: 6}]
 */
export const getAffectedCells = (piece, gridRow, gridCol) => {
  const affectedCells = [];

  // Iterate through the piece shape
  piece.shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      // Only include filled cells (value === 1)
      if (cell === 1) {
        affectedCells.push({
          row: gridRow + rowIndex,
          col: gridCol + colIndex,
        });
      }
    });
  });

  return affectedCells;
};

/**
 * Check if a piece can be placed at the specified position
 * @param {{shape: number[][]}} piece - The piece to place
 * @param {number} gridRow - The starting row position
 * @param {number} gridCol - The starting column position
 * @param {Array<Array<{row: number, col: number, filled: boolean}>>} gridState - Current grid state
 * @param {number} boardSize - The size of the board (e.g., 10 for 10x10)
 * @returns {{valid: boolean, affectedCells: Array<{row: number, col: number}>}} Validation result with affected cells
 * @example
 * const piece = { shape: [[1, 1], [1, 1]] };
 * const result = canPlacePiece(piece, 0, 0, gridState, 10);
 * if (result.valid) {
 *   console.log('Can place piece at affected cells:', result.affectedCells);
 * }
 */
export const canPlacePiece = (piece, gridRow, gridCol, gridState, boardSize) => {
  // Get all cells that would be affected by this placement
  const affectedCells = getAffectedCells(piece, gridRow, gridCol);

  // Check if any cell is out of bounds
  const hasOutOfBoundsCell = affectedCells.some(cell => !isWithinBounds(cell, boardSize));
  if (hasOutOfBoundsCell) {
    return { valid: false, affectedCells: [] };
  }

  // Check if any cell is already filled (collision detection)
  const hasCollision = affectedCells.some(cell => gridState[cell.row][cell.col].filled);
  if (hasCollision) {
    return { valid: false, affectedCells: [] };
  }

  // All checks passed
  return { valid: true, affectedCells };
};
