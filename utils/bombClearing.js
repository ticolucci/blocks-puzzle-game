/**
 * Gets all cells within a given radius of a bomb position
 * @param {number} bombRow - Row position of the bomb
 * @param {number} bombCol - Column position of the bomb
 * @param {number} radius - Radius to check (Manhattan distance)
 * @param {number} boardSize - Size of the board
 * @param {Array} gridState - Optional grid state to check if cells are filled
 * @param {boolean} onlyFilled - If true, only return filled cells
 * @returns {Array} Array of cell objects {row, col}
 */
export function getCellsInRadius(bombRow, bombCol, radius, boardSize, gridState = null, onlyFilled = false) {
  const cells = [];

  // Check all cells within the bounding box
  for (let row = bombRow - radius; row <= bombRow + radius; row++) {
    for (let col = bombCol - radius; col <= bombCol + radius; col++) {
      // Skip if outside board boundaries
      if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) {
        continue;
      }

      // Calculate Manhattan distance
      const distance = Math.abs(row - bombRow) + Math.abs(col - bombCol);

      // Include cell if within radius
      if (distance <= radius) {
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
  }

  return cells;
}

/**
 * Clears all cells within a radius of the bomb position
 * @param {Array} gridState - Current grid state
 * @param {number} bombRow - Row position of the bomb
 * @param {number} bombCol - Column position of the bomb
 * @param {number} radius - Radius to clear
 * @returns {Array} New grid state with cleared cells
 */
export function clearBombRadius(gridState, bombRow, bombCol, radius) {
  // Create a deep copy of the grid
  const newGrid = gridState.map(row => row.map(cell => ({ ...cell })));

  // Get cells to clear
  const cellsToClear = getCellsInRadius(bombRow, bombCol, radius, gridState.length);

  // Clear each cell
  cellsToClear.forEach(({ row, col }) => {
    newGrid[row][col].filled = false;
    newGrid[row][col].color = null;
  });

  return newGrid;
}
