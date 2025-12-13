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

  if (!boardLayout) {
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
 * Converts touch coordinates directly to piece anchor position
 * @param {number} touchX - Touch X coordinate (pageX)
 * @param {number} touchY - Touch Y coordinate (pageY)
 * @param {Array} pieceShape - Piece shape matrix
 * @param {Object} boardLayout - Board layout {x, y, width, height, cellSize}
 * @returns {Object} {row, col} anchor position or null if inputs invalid
 */
export const touchToPlacement = (touchX, touchY, pieceShape, boardLayout) => {
  if (!boardLayout || !pieceShape) return null;

  const cellSize = boardLayout.cellSize;

  // Piece dimensions in cells
  const pieceRows = pieceShape.length;
  const pieceCols = pieceShape[0]?.length || 0;

  // Touch position relative to board (in pixels)
  const relX = touchX - boardLayout.x;
  const relY = touchY - boardLayout.y;

  // Touch position in fractional grid coordinates
  const touchGridCol = relX / cellSize;
  const touchGridRow = relY / cellSize;

  // Anchor position (top-left of piece) - center piece on touch
  // Subtract half the piece size to center it on the touch point
  // Use Math.floor to prefer placing piece to the top-left when exactly between cells
  const anchorCol = Math.floor(touchGridCol - (pieceCols - 1) / 2);
  const anchorRow = Math.floor(touchGridRow - (pieceRows - 1) / 2);

  return { row: anchorRow, col: anchorCol };
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
  if (!boardLayout) {
    throw new Error('boardLayout must be a valid layout object');
  }

  return {
    x: boardLayout.x + gridPosition.col * boardLayout.cellSize,
    y: boardLayout.y + gridPosition.row * boardLayout.cellSize,
  };
};
