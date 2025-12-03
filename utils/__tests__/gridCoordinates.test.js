import {
  screenToGridPosition,
  snapToGrid,
} from '../gridCoordinates';

describe('gridCoordinates', () => {
  const mockBoardLayout = {
    x: 100,
    y: 200,
    width: 300,
    height: 300,
    cellSize: 30,
  };

  describe('screenToGridPosition', () => {
    test('converts top-left screen coordinate to (0,0)', () => {
      const result = screenToGridPosition(100, 200, mockBoardLayout);
      expect(result).toEqual({ row: 0, col: 0 });
    });

    test('converts center screen coordinate to middle cell', () => {
      // Center of board: x=250 (100+150), y=350 (200+150)
      const result = screenToGridPosition(250, 350, mockBoardLayout);
      expect(result).toEqual({ row: 5, col: 5 });
    });

    test('converts bottom-right screen coordinate correctly', () => {
      // Bottom-right cell (9,9) starts at x=370, y=470
      const result = screenToGridPosition(370, 470, mockBoardLayout);
      expect(result).toEqual({ row: 9, col: 9 });
    });

    test('returns null for coordinates outside grid (beyond right edge)', () => {
      const result = screenToGridPosition(500, 200, mockBoardLayout);
      expect(result).toBeNull();
    });

    test('returns null for coordinates outside grid (beyond bottom edge)', () => {
      const result = screenToGridPosition(100, 600, mockBoardLayout);
      expect(result).toBeNull();
    });

    test('returns null for negative coordinates (left of grid)', () => {
      const result = screenToGridPosition(50, 200, mockBoardLayout);
      expect(result).toBeNull();
    });

    test('returns null for negative coordinates (above grid)', () => {
      const result = screenToGridPosition(100, 150, mockBoardLayout);
      expect(result).toBeNull();
    });

    test('handles coordinates at grid boundaries', () => {
      // Right at the edge: x=399 (just before 400), y=200
      const result = screenToGridPosition(399, 200, mockBoardLayout);
      expect(result).toEqual({ row: 0, col: 9 });
    });
  });

  describe('snapToGrid', () => {
    test('converts grid position (0,0) to screen coordinates', () => {
      const result = snapToGrid({ row: 0, col: 0 }, mockBoardLayout);
      expect(result).toEqual({ x: 100, y: 200 });
    });

    test('converts grid position (5,5) to screen coordinates', () => {
      const result = snapToGrid({ row: 5, col: 5 }, mockBoardLayout);
      // x = 100 + 5*30 = 250, y = 200 + 5*30 = 350
      expect(result).toEqual({ x: 250, y: 350 });
    });

    test('converts grid position (9,9) to screen coordinates', () => {
      const result = snapToGrid({ row: 9, col: 9 }, mockBoardLayout);
      // x = 100 + 9*30 = 370, y = 200 + 9*30 = 470
      expect(result).toEqual({ x: 370, y: 470 });
    });

    test('handles middle row positions correctly', () => {
      const result = snapToGrid({ row: 3, col: 7 }, mockBoardLayout);
      // x = 100 + 7*30 = 310, y = 200 + 3*30 = 290
      expect(result).toEqual({ x: 310, y: 290 });
    });
  });
});
