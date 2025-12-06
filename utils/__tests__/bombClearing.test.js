import { getCellsInRadius, clearBombRadius } from '../bombClearing';

describe('bombClearing', () => {
  describe('getCellsInRadius', () => {
    test('returns cells within radius 2 from center position', () => {
      const bombRow = 5;
      const bombCol = 5;
      const radius = 2;
      const boardSize = 10;

      const cells = getCellsInRadius(bombRow, bombCol, radius, boardSize);

      // Should include cells within Manhattan distance of 2
      expect(cells).toContainEqual({ row: 5, col: 5 }); // Center
      expect(cells).toContainEqual({ row: 4, col: 5 }); // Up 1
      expect(cells).toContainEqual({ row: 6, col: 5 }); // Down 1
      expect(cells).toContainEqual({ row: 5, col: 4 }); // Left 1
      expect(cells).toContainEqual({ row: 5, col: 6 }); // Right 1
      expect(cells).toContainEqual({ row: 3, col: 5 }); // Up 2
      expect(cells).toContainEqual({ row: 7, col: 5 }); // Down 2
      expect(cells).toContainEqual({ row: 5, col: 3 }); // Left 2
      expect(cells).toContainEqual({ row: 5, col: 7 }); // Right 2

      // Diagonal cells within radius 2
      expect(cells).toContainEqual({ row: 4, col: 4 });
      expect(cells).toContainEqual({ row: 4, col: 6 });
      expect(cells).toContainEqual({ row: 6, col: 4 });
      expect(cells).toContainEqual({ row: 6, col: 6 });
    });

    test('returns cells within radius 1 from center position', () => {
      const bombRow = 5;
      const bombCol = 5;
      const radius = 1;
      const boardSize = 10;

      const cells = getCellsInRadius(bombRow, bombCol, radius, boardSize);

      // Should include center and adjacent cells
      expect(cells).toContainEqual({ row: 5, col: 5 }); // Center
      expect(cells).toContainEqual({ row: 4, col: 5 }); // Up
      expect(cells).toContainEqual({ row: 6, col: 5 }); // Down
      expect(cells).toContainEqual({ row: 5, col: 4 }); // Left
      expect(cells).toContainEqual({ row: 5, col: 6 }); // Right

      // Should not include cells at distance 2
      expect(cells).not.toContainEqual({ row: 3, col: 5 });
      expect(cells).not.toContainEqual({ row: 7, col: 5 });
    });

    test('excludes cells outside board boundaries', () => {
      const bombRow = 0; // Top-left corner
      const bombCol = 0;
      const radius = 2;
      const boardSize = 10;

      const cells = getCellsInRadius(bombRow, bombCol, radius, boardSize);

      // Should not include negative indices
      expect(cells.every(cell => cell.row >= 0 && cell.col >= 0)).toBe(true);

      // Should include valid cells
      expect(cells).toContainEqual({ row: 0, col: 0 });
      expect(cells).toContainEqual({ row: 0, col: 1 });
      expect(cells).toContainEqual({ row: 1, col: 0 });
    });

    test('excludes cells beyond board size', () => {
      const bombRow = 9; // Bottom-right corner
      const bombCol = 9;
      const radius = 2;
      const boardSize = 10;

      const cells = getCellsInRadius(bombRow, bombCol, radius, boardSize);

      // Should not include indices >= boardSize
      expect(cells.every(cell => cell.row < boardSize && cell.col < boardSize)).toBe(true);

      // Should include valid cells
      expect(cells).toContainEqual({ row: 9, col: 9 });
      expect(cells).toContainEqual({ row: 9, col: 8 });
      expect(cells).toContainEqual({ row: 8, col: 9 });
    });

    test('returns only filled cells when onlyFilled is true', () => {
      const bombRow = 5;
      const bombCol = 5;
      const radius = 1;
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

      const cells = getCellsInRadius(bombRow, bombCol, radius, boardSize, gridState, true);

      // Should only include the filled center cell
      expect(cells).toHaveLength(1);
      expect(cells).toContainEqual({ row: 5, col: 5 });
    });
  });

  describe('clearBombRadius', () => {
    test('clears all cells within radius 2 of bomb position', () => {
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
      const radius = 2;

      const clearedGrid = clearBombRadius(gridState, bombRow, bombCol, radius);

      // Cells within radius should be cleared
      expect(clearedGrid[5][5].filled).toBe(false); // Center
      expect(clearedGrid[4][5].filled).toBe(false); // Up 1
      expect(clearedGrid[6][5].filled).toBe(false); // Down 1
      expect(clearedGrid[5][4].filled).toBe(false); // Left 1
      expect(clearedGrid[5][6].filled).toBe(false); // Right 1
      expect(clearedGrid[3][5].filled).toBe(false); // Up 2
      expect(clearedGrid[7][5].filled).toBe(false); // Down 2

      // Cells outside radius should remain filled
      expect(clearedGrid[0][0].filled).toBe(true);
      expect(clearedGrid[9][9].filled).toBe(true);
      expect(clearedGrid[2][5].filled).toBe(true); // Up 3
    });

    test('clears cells within radius 1 of bomb position', () => {
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
      const radius = 1;

      const clearedGrid = clearBombRadius(gridState, bombRow, bombCol, radius);

      // Cells within radius 1 should be cleared
      expect(clearedGrid[5][5].filled).toBe(false);
      expect(clearedGrid[4][5].filled).toBe(false);
      expect(clearedGrid[6][5].filled).toBe(false);

      // Cells at radius 2 should remain filled
      expect(clearedGrid[3][5].filled).toBe(true);
      expect(clearedGrid[7][5].filled).toBe(true);
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
      const radius = 1;

      const clearedGrid = clearBombRadius(gridState, bombRow, bombCol, radius);

      // Cleared cells should have null color
      expect(clearedGrid[5][5].color).toBeNull();
      expect(clearedGrid[4][5].color).toBeNull();
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
      const radius = 2;

      const clearedGrid = clearBombRadius(gridState, bombRow, bombCol, radius);

      // Original grid should remain unchanged
      expect(gridState[5][5].filled).toBe(true);
      expect(gridState[5][5].color).toBe('#FFFF00');

      // New grid should be modified
      expect(clearedGrid[5][5].filled).toBe(false);
      expect(clearedGrid[5][5].color).toBeNull();
    });
  });
});
