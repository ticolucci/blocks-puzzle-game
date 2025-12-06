import { createEmptyGrid } from '../gridHelpers';

describe('gridHelpers', () => {
  describe('createEmptyGrid', () => {
    test('creates a grid of the specified size', () => {
      const size = 10;
      const grid = createEmptyGrid(size);

      expect(grid).toHaveLength(size);
      grid.forEach(row => {
        expect(row).toHaveLength(size);
      });
    });

    test('each cell has row, col, filled, and color properties', () => {
      const grid = createEmptyGrid(5);

      grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          expect(cell).toHaveProperty('row', rowIndex);
          expect(cell).toHaveProperty('col', colIndex);
          expect(cell).toHaveProperty('filled', false);
          expect(cell).toHaveProperty('color', null);
        });
      });
    });

    test('all cells start with filled as false and color as null', () => {
      const grid = createEmptyGrid(3);

      grid.forEach(row => {
        row.forEach(cell => {
          expect(cell.filled).toBe(false);
          expect(cell.color).toBe(null);
        });
      });
    });
  });
});
