import { getCellsInRadius, clearBombRadius } from '../bombClearing';

describe('bombClearing', () => {
  describe('getCellsInRadius', () => {
    test('returns cells in 5x5 square (size 5) centered on bomb', () => {
      const bombRow = 5;
      const bombCol = 5;
      const size = 5;
      const boardSize = 10;

      const cells = getCellsInRadius(bombRow, bombCol, size, boardSize);

      // Should return all cells in 5x5 square (rows 3-7, cols 3-7)
      expect(cells).toHaveLength(25);

      // Check corners of the square
      expect(cells).toContainEqual({ row: 3, col: 3 }); // Top-left
      expect(cells).toContainEqual({ row: 3, col: 7 }); // Top-right
      expect(cells).toContainEqual({ row: 7, col: 3 }); // Bottom-left
      expect(cells).toContainEqual({ row: 7, col: 7 }); // Bottom-right

      // Check center
      expect(cells).toContainEqual({ row: 5, col: 5 });

      // Check edges
      expect(cells).toContainEqual({ row: 3, col: 5 }); // Top edge
      expect(cells).toContainEqual({ row: 7, col: 5 }); // Bottom edge
      expect(cells).toContainEqual({ row: 5, col: 3 }); // Left edge
      expect(cells).toContainEqual({ row: 5, col: 7 }); // Right edge

      // Should NOT include cells outside the 5x5 square
      expect(cells).not.toContainEqual({ row: 2, col: 5 }); // Above square
      expect(cells).not.toContainEqual({ row: 8, col: 5 }); // Below square
      expect(cells).not.toContainEqual({ row: 5, col: 2 }); // Left of square
      expect(cells).not.toContainEqual({ row: 5, col: 8 }); // Right of square
    });

    test('returns cells in 3x3 square (size 3) centered on bomb', () => {
      const bombRow = 5;
      const bombCol = 5;
      const size = 3;
      const boardSize = 10;

      const cells = getCellsInRadius(bombRow, bombCol, size, boardSize);

      // Should return all cells in 3x3 square (rows 4-6, cols 4-6)
      expect(cells).toHaveLength(9);

      // Check corners of the square
      expect(cells).toContainEqual({ row: 4, col: 4 }); // Top-left
      expect(cells).toContainEqual({ row: 4, col: 6 }); // Top-right
      expect(cells).toContainEqual({ row: 6, col: 4 }); // Bottom-left
      expect(cells).toContainEqual({ row: 6, col: 6 }); // Bottom-right

      // Check center and adjacent
      expect(cells).toContainEqual({ row: 5, col: 5 }); // Center
      expect(cells).toContainEqual({ row: 4, col: 5 }); // Up
      expect(cells).toContainEqual({ row: 6, col: 5 }); // Down
      expect(cells).toContainEqual({ row: 5, col: 4 }); // Left
      expect(cells).toContainEqual({ row: 5, col: 6 }); // Right

      // Should NOT include cells outside 3x3 square
      expect(cells).not.toContainEqual({ row: 3, col: 5 });
      expect(cells).not.toContainEqual({ row: 7, col: 5 });
    });

    test('excludes cells outside board boundaries (top-left corner)', () => {
      const bombRow = 0; // Top-left corner
      const bombCol = 0;
      const size = 5;
      const boardSize = 10;

      const cells = getCellsInRadius(bombRow, bombCol, size, boardSize);

      // Should not include negative indices
      expect(cells.every(cell => cell.row >= 0 && cell.col >= 0)).toBe(true);

      // Should include valid cells in the clipped square
      expect(cells).toContainEqual({ row: 0, col: 0 });
      expect(cells).toContainEqual({ row: 0, col: 1 });
      expect(cells).toContainEqual({ row: 1, col: 0 });
      expect(cells).toContainEqual({ row: 2, col: 2 }); // Within 5x5 range

      // Verify it's a clipped 5x5 square (would be -2 to 2, but clipped to 0-2)
      // So we get 3x3 in top-left corner (rows 0-2, cols 0-2)
      expect(cells).toHaveLength(9);
    });

    test('excludes cells beyond board size (bottom-right corner)', () => {
      const bombRow = 9; // Bottom-right corner
      const bombCol = 9;
      const size = 5;
      const boardSize = 10;

      const cells = getCellsInRadius(bombRow, bombCol, size, boardSize);

      // Should not include indices >= boardSize
      expect(cells.every(cell => cell.row < boardSize && cell.col < boardSize)).toBe(true);

      // Should include valid cells in the clipped square
      expect(cells).toContainEqual({ row: 9, col: 9 });
      expect(cells).toContainEqual({ row: 9, col: 8 });
      expect(cells).toContainEqual({ row: 8, col: 9 });
      expect(cells).toContainEqual({ row: 7, col: 7 }); // Within 5x5 range

      // Verify it's a clipped 5x5 square (would be 7 to 11, but clipped to 7-9)
      // So we get 3x3 in bottom-right corner (rows 7-9, cols 7-9)
      expect(cells).toHaveLength(9);
    });

    test('returns only filled cells when onlyFilled is true', () => {
      const bombRow = 5;
      const bombCol = 5;
      const size = 3;
      const boardSize = 10;

      // Create a grid with some filled cells
      const gridState = [];
      for (let row = 0; row < boardSize; row++) {
        const gridRow = [];
        for (let col = 0; col < boardSize; col++) {
          gridRow.push({
            row,
            col,
            filled: row === 5 && col === 5, // Only center is filled
            color: row === 5 && col === 5 ? '#FF0000' : null,
          });
        }
        gridState.push(gridRow);
      }

      const cells = getCellsInRadius(bombRow, bombCol, size, boardSize, gridState, true);

      // Should only include the filled center cell (even though 3x3 square would cover 9 cells)
      expect(cells).toHaveLength(1);
      expect(cells).toContainEqual({ row: 5, col: 5 });
    });

    test('returns cells in 1x1 square (size 1) - just the bomb itself', () => {
      const bombRow = 5;
      const bombCol = 5;
      const size = 1;
      const boardSize = 10;

      const cells = getCellsInRadius(bombRow, bombCol, size, boardSize);

      // Should only include the center cell
      expect(cells).toHaveLength(1);
      expect(cells).toContainEqual({ row: 5, col: 5 });
    });
  });

  describe('clearBombRadius', () => {
    test('clears all cells in 5x5 square centered on bomb', () => {
      const boardSize = 10;

      // Create a grid with filled cells
      const gridState = [];
      for (let row = 0; row < boardSize; row++) {
        const gridRow = [];
        for (let col = 0; col < boardSize; col++) {
          gridRow.push({
            row,
            col,
            filled: true, // All cells filled
            color: '#FF0000',
          });
        }
        gridState.push(gridRow);
      }

      const bombRow = 5;
      const bombCol = 5;
      const size = 5;

      const clearedGrid = clearBombRadius(gridState, bombRow, bombCol, size);

      // All cells in 5x5 square (rows 3-7, cols 3-7) should be cleared
      expect(clearedGrid[5][5].filled).toBe(false); // Center
      expect(clearedGrid[3][3].filled).toBe(false); // Top-left corner
      expect(clearedGrid[3][7].filled).toBe(false); // Top-right corner
      expect(clearedGrid[7][3].filled).toBe(false); // Bottom-left corner
      expect(clearedGrid[7][7].filled).toBe(false); // Bottom-right corner
      expect(clearedGrid[4][5].filled).toBe(false); // Inside square
      expect(clearedGrid[6][5].filled).toBe(false); // Inside square

      // Cells outside 5x5 square should remain filled
      expect(clearedGrid[0][0].filled).toBe(true);
      expect(clearedGrid[9][9].filled).toBe(true);
      expect(clearedGrid[2][5].filled).toBe(true); // Above square
      expect(clearedGrid[8][5].filled).toBe(true); // Below square
      expect(clearedGrid[5][2].filled).toBe(true); // Left of square
      expect(clearedGrid[5][8].filled).toBe(true); // Right of square
    });

    test('clears cells in 3x3 square centered on bomb', () => {
      const boardSize = 10;

      // Create a grid with filled cells
      const gridState = [];
      for (let row = 0; row < boardSize; row++) {
        const gridRow = [];
        for (let col = 0; col < boardSize; col++) {
          gridRow.push({
            row,
            col,
            filled: true,
            color: '#0000FF',
          });
        }
        gridState.push(gridRow);
      }

      const bombRow = 5;
      const bombCol = 5;
      const size = 3;

      const clearedGrid = clearBombRadius(gridState, bombRow, bombCol, size);

      // All cells in 3x3 square (rows 4-6, cols 4-6) should be cleared
      expect(clearedGrid[5][5].filled).toBe(false); // Center
      expect(clearedGrid[4][4].filled).toBe(false); // Top-left
      expect(clearedGrid[4][6].filled).toBe(false); // Top-right
      expect(clearedGrid[6][4].filled).toBe(false); // Bottom-left
      expect(clearedGrid[6][6].filled).toBe(false); // Bottom-right

      // Cells outside 3x3 square should remain filled
      expect(clearedGrid[3][5].filled).toBe(true);
      expect(clearedGrid[7][5].filled).toBe(true);
      expect(clearedGrid[5][3].filled).toBe(true);
      expect(clearedGrid[5][7].filled).toBe(true);
    });

    test('clears color when clearing cells', () => {
      const boardSize = 10;

      const gridState = [];
      for (let row = 0; row < boardSize; row++) {
        const gridRow = [];
        for (let col = 0; col < boardSize; col++) {
          gridRow.push({
            row,
            col,
            filled: true,
            color: '#00FF00',
          });
        }
        gridState.push(gridRow);
      }

      const bombRow = 5;
      const bombCol = 5;
      const size = 3;

      const clearedGrid = clearBombRadius(gridState, bombRow, bombCol, size);

      // Cleared cells in 3x3 square should have null color
      expect(clearedGrid[5][5].color).toBeNull();
      expect(clearedGrid[4][5].color).toBeNull();
      expect(clearedGrid[6][6].color).toBeNull();
    });

    test('does not modify original grid (returns new grid)', () => {
      const boardSize = 10;

      const gridState = [];
      for (let row = 0; row < boardSize; row++) {
        const gridRow = [];
        for (let col = 0; col < boardSize; col++) {
          gridRow.push({
            row,
            col,
            filled: true,
            color: '#FFFF00',
          });
        }
        gridState.push(gridRow);
      }

      const bombRow = 5;
      const bombCol = 5;
      const size = 5;

      const clearedGrid = clearBombRadius(gridState, bombRow, bombCol, size);

      // Original grid should remain unchanged
      expect(gridState[5][5].filled).toBe(true);
      expect(gridState[5][5].color).toBe('#FFFF00');

      // New grid should be modified
      expect(clearedGrid[5][5].filled).toBe(false);
      expect(clearedGrid[5][5].color).toBeNull();
    });
  });
});
