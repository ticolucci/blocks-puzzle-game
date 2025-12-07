/**
 * Gets all cells within a square area centered on a bomb position
 * @param {number} bombRow - Row position of the bomb
 * @param {number} bombCol - Column position of the bomb
 * @param {number} size - Size of the square (e.g., 3 for 3x3, 5 for 5x5) - should be odd number
 * @param {number} boardSize - Size of the board
 * @param {Array} gridState - Optional grid state to check if cells are filled
 * @param {boolean} onlyFilled - If true, only return filled cells
 * @returns {Array} Array of cell objects {row, col}
 */
export function getCellsInRadius(bombRow, bombCol, size, boardSize, gridState = null, onlyFilled = false) {
  const cells = [];

  // Calculate half-size for centering the square
  const halfSize = Math.floor(size / 2);

  // Calculate the bounds of the square
  const startRow = bombRow - halfSize;
  const endRow = bombRow + halfSize;
  const startCol = bombCol - halfSize;
  const endCol = bombCol + halfSize;

  // Iterate through all cells in the square
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      // Skip if outside board boundaries
      if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) {
        continue;
      }

      // If onlyFilled is true, check if cell is filled
      if (onlyFilled && gridState) {
        if (gridState[row][col].filled) {
          cells.push({ row, col });
        }
      } else {
        cells.push({ row, col });
      }
    }
  }

  return cells;
}

/**
 * Clears all cells within a square area centered on the bomb position
 * @param {Array} gridState - Current grid state
 * @param {number} bombRow - Row position of the bomb
 * @param {number} bombCol - Column position of the bomb
 * @param {number} size - Size of the square to clear (e.g., 3 for 3x3, 5 for 5x5) - should be odd number
 * @returns {Array} New grid state with cleared cells
 */
export function clearBombRadius(gridState, bombRow, bombCol, size) {
  // Create a deep copy of the grid
  const newGrid = gridState.map(row => row.map(cell => ({ ...cell })));

  // Get cells to clear
  const cellsToClear = getCellsInRadius(bombRow, bombCol, size, gridState.length);

  // Clear each cell
  cellsToClear.forEach(({ row, col }) => {
    newGrid[row][col].filled = false;
    newGrid[row][col].color = null;
  });

  return newGrid;
}

/**
 * Processes a bomb item usage - gets cells to animate and cleared grid
 * @param {Array} gridState - Current grid state
 * @param {number} bombRow - Row position where bomb is used
 * @param {number} bombCol - Column position where bomb is used
 * @param {number} size - Size of the bomb clearing area
 * @param {number} boardSize - Size of the board
 * @returns {Object} { cellsToAnimate: Array, clearedGrid: Array }
 */
export function useBombItem(gridState, bombRow, bombCol, size, boardSize) {
  // Get filled cells for animation
  const cellsToAnimate = getCellsInRadius(
    bombRow,
    bombCol,
    size,
    boardSize,
    gridState,
    true // Only filled cells
  );

  // Get cleared grid
  const clearedGrid = clearBombRadius(gridState, bombRow, bombCol, size);

  return { cellsToAnimate, clearedGrid };
}
