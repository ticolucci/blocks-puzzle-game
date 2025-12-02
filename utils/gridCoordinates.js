/**
 * Validates that a board layout object has all required properties
 * @param {{x: number, y: number, width: number, height: number, cellSize: number}} boardLayout - Board layout to validate
 * @returns {boolean} True if valid, false otherwise
 */
const validateBoardLayout = (boardLayout) => {
  return (
    boardLayout &&
    typeof boardLayout.x === 'number' &&
    typeof boardLayout.y === 'number' &&
    typeof boardLayout.width === 'number' &&
    typeof boardLayout.height === 'number' &&
    typeof boardLayout.cellSize === 'number' &&
    boardLayout.cellSize > 0
  );
};

/**
 * Convert screen coordinates to grid position
 * @param {number} screenX - The X coordinate on screen
 * @param {number} screenY - The Y coordinate on screen
 * @param {{x: number, y: number, width: number, height: number, cellSize: number}} boardLayout - Board layout info
 * @returns {{row: number, col: number} | null} Grid position or null if outside bounds
 * @throws {Error} If screenX or screenY are not valid numbers
 */
export const screenToGridPosition = (screenX, screenY, boardLayout) => {
  // Validate inputs
  if (typeof screenX !== 'number' || typeof screenY !== 'number') {
    throw new Error('screenX and screenY must be valid numbers');
  }

  if (!validateBoardLayout(boardLayout)) {
    return null;
  }

  // Calculate relative position within the board
  const relX = screenX - boardLayout.x;
  const relY = screenY - boardLayout.y;

  // Check if coordinates are outside the board
  if (relX < 0 || relY < 0 || relX >= boardLayout.width || relY >= boardLayout.height) {
    return null;
  }

  // Calculate grid indices
  const gridCol = Math.floor(relX / boardLayout.cellSize);
  const gridRow = Math.floor(relY / boardLayout.cellSize);

  // Calculate board size from dimensions
  const boardSize = Math.floor(boardLayout.width / boardLayout.cellSize);

  // Verify indices are within valid range
  if (gridRow < 0 || gridRow >= boardSize || gridCol < 0 || gridCol >= boardSize) {
    return null;
  }

  return { row: gridRow, col: gridCol };
};

/**
 * Calculate the bounding box of filled cells in a piece shape
 * @param {number[][]} shape - The 2D array representing the piece shape
 * @returns {{minRow: number, maxRow: number, minCol: number, maxCol: number} | null}
 */
const calculateBoundingBox = (shape) => {
  const filledCells = [];

  // Collect all filled cell positions
  shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 1) {
        filledCells.push({ row: rowIndex, col: colIndex });
      }
    });
  });

  if (filledCells.length === 0) {
    return null;
  }

  // Use reduce for functional approach
  return filledCells.reduce(
    (bounds, cell) => ({
      minRow: Math.min(bounds.minRow, cell.row),
      maxRow: Math.max(bounds.maxRow, cell.row),
      minCol: Math.min(bounds.minCol, cell.col),
      maxCol: Math.max(bounds.maxCol, cell.col),
    }),
    {
      minRow: filledCells[0].row,
      maxRow: filledCells[0].row,
      minCol: filledCells[0].col,
      maxCol: filledCells[0].col,
    }
  );
};

/**
 * Calculate the visual center offset of a piece shape for better drag UX
 * @param {number[][]} shape - The 2D array representing the piece shape
 * @param {number} blockSize - The size of each block in pixels
 * @returns {{offsetX: number, offsetY: number}} The center offset in pixels
 * @throws {Error} If shape is not a valid 2D array or blockSize is not a positive number
 */
export const calculatePieceCenterOffset = (shape, blockSize) => {
  // Validate inputs
  if (!Array.isArray(shape) || shape.length === 0) {
    throw new Error('shape must be a non-empty 2D array');
  }

  if (typeof blockSize !== 'number' || blockSize <= 0) {
    throw new Error('blockSize must be a positive number');
  }

  // Calculate bounding box
  const bounds = calculateBoundingBox(shape);

  if (!bounds) {
    // No filled cells found
    return { offsetX: 0, offsetY: 0 };
  }

  // Calculate center of bounding box
  const centerRow = (bounds.minRow + bounds.maxRow) / 2;
  const centerCol = (bounds.minCol + bounds.maxCol) / 2;

  // Convert to pixel offset
  return {
    offsetX: centerCol * blockSize,
    offsetY: centerRow * blockSize,
  };
};

/**
 * Convert grid position back to screen coordinates
 * @param {{row: number, col: number}} gridPosition - The grid position
 * @param {{x: number, y: number, cellSize: number}} boardLayout - Board layout info
 * @returns {{x: number, y: number}} Screen coordinates
 * @throws {Error} If gridPosition or boardLayout are invalid
 */
export const snapToGrid = (gridPosition, boardLayout) => {
  // Validate gridPosition
  if (
    !gridPosition ||
    typeof gridPosition.row !== 'number' ||
    typeof gridPosition.col !== 'number'
  ) {
    throw new Error('gridPosition must have valid row and col properties');
  }

  // Validate boardLayout (using helper)
  if (!validateBoardLayout(boardLayout)) {
    throw new Error('boardLayout must be a valid layout object');
  }

  return {
    x: boardLayout.x + gridPosition.col * boardLayout.cellSize,
    y: boardLayout.y + gridPosition.row * boardLayout.cellSize,
  };
};
