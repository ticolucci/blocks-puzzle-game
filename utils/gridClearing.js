import { GAME_CONFIG } from '../constants/gameConfig';

/**
 * Get the indices of all completely filled rows
 * @param {Array<Array<{row: number, col: number, filled: boolean}>>} gridState - Current grid state
 * @param {number} boardSize - The size of the board (e.g., 10 for 10x10)
 * @returns {number[]} Array of row indices that are completely filled
 */
export const getFilledRows = (gridState, boardSize) => {
  const filledRows = [];

  for (let row = 0; row < boardSize; row++) {
    let isRowFilled = true;

    for (let col = 0; col < boardSize; col++) {
      if (!gridState[row][col].filled) {
        isRowFilled = false;
        break;
      }
    }

    if (isRowFilled) {
      filledRows.push(row);
    }
  }

  return filledRows;
};

/**
 * Get the indices of all completely filled columns
 * @param {Array<Array<{row: number, col: number, filled: boolean}>>} gridState - Current grid state
 * @param {number} boardSize - The size of the board (e.g., 10 for 10x10)
 * @returns {number[]} Array of column indices that are completely filled
 */
export const getFilledColumns = (gridState, boardSize) => {
  const filledColumns = [];

  for (let col = 0; col < boardSize; col++) {
    let isColumnFilled = true;

    for (let row = 0; row < boardSize; row++) {
      if (!gridState[row][col].filled) {
        isColumnFilled = false;
        break;
      }
    }

    if (isColumnFilled) {
      filledColumns.push(col);
    }
  }

  return filledColumns;
};

/**
 * Clear the specified rows and columns from the grid
 * @param {Array<Array<{row: number, col: number, filled: boolean}>>} gridState - Current grid state
 * @param {number[]} filledRows - Array of row indices to clear
 * @param {number[]} filledColumns - Array of column indices to clear
 * @returns {Array<Array<{row: number, col: number, filled: boolean}>>} New grid state with cleared lines
 */
export const clearLines = (gridState, filledRows, filledColumns) => {
  // Create a deep copy of the grid state
  const newGrid = gridState.map(row => row.map(cell => ({ ...cell })));

  // Clear all cells in filled rows
  filledRows.forEach(rowIndex => {
    for (let col = 0; col < newGrid[rowIndex].length; col++) {
      newGrid[rowIndex][col].filled = false;
    }
  });

  // Clear all cells in filled columns
  filledColumns.forEach(colIndex => {
    for (let row = 0; row < newGrid.length; row++) {
      newGrid[row][colIndex].filled = false;
    }
  });

  return newGrid;
};

/**
 * Calculate the score for clearing rows and columns
 * @param {number} rowCount - Number of rows cleared
 * @param {number} columnCount - Number of columns cleared
 * @returns {number} Score earned from clearing
 */
export const calculateClearScore = (rowCount, columnCount) => {
  const totalLines = rowCount + columnCount;

  if (totalLines === 0) {
    return 0;
  }

  const baseScore = GAME_CONFIG.LINE_CLEAR_BASE_POINTS * totalLines;

  // Determine multiplier
  let multiplier;
  if (rowCount > 0 && columnCount > 0) {
    // Row AND column cleared together
    multiplier = 2;
  } else if (totalLines === 2) {
    multiplier = 1.5;
  } else if (totalLines === 3) {
    multiplier = 2;
  } else if (totalLines >= 4) {
    multiplier = 4;
  } else {
    // totalLines === 1
    multiplier = 1;
  }

  return Math.floor(baseScore * multiplier);
};
