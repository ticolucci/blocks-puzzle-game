import {
  screenToGridPosition,
  snapToGrid,
  touchToPlacement,
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

  describe('touchToPlacement', () => {
    const VERTICAL_OFFSET_BLOCKS = 5; // Piece is displayed 5 blocks above finger

    const mockPieceShape2x2 = [
      [1, 1],
      [1, 1],
    ];

    const mockPieceShape3x3 = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];

    test('centers 2x2 piece horizontally on piece center coordinate', () => {
      // Piece center at grid position (5, 5) -> screen position (250, 350)
      const result = touchToPlacement(250, 350, mockPieceShape2x2, mockBoardLayout);
      // 2x2 piece center is at (0.5, 0.5) offset from anchor
      // To center at grid (5, 5), anchor should be at (4, 4)
      // (since piece occupies [4,5] x [4,5])
      expect(result).toEqual({ row: 4, col: 4 });
    });

    test('places piece based on visual center when finger touch includes vertical offset', () => {
      // Finger touches at screen position (250, 350) -> grid position (5, 5)
      // Piece is visually displayed 5 blocks above: (250, 350 - 5*30) = (250, 200) -> grid (5, 0)
      // We want placement to use the visual center (250, 200), not finger position (250, 350)

      // When touch is at (250, 350), the piece center is at (250, 200)
      const pieceCenterX = 250;
      const pieceCenterY = 350 - (VERTICAL_OFFSET_BLOCKS * mockBoardLayout.cellSize); // 350 - 150 = 200

      const result = touchToPlacement(pieceCenterX, pieceCenterY, mockPieceShape2x2, mockBoardLayout);
      // Piece center at (250, 200) -> grid (5, 0) -> anchor at floor(4.5, -0.5) = (4, -1)
      expect(result).toEqual({ row: -1, col: 4 });
    });

    test('centers 3x3 piece horizontally on piece center coordinate', () => {
      // Piece center at grid position (5, 5) -> screen position (250, 350)
      const result = touchToPlacement(250, 350, mockPieceShape3x3, mockBoardLayout);
      // 3x3 piece: cols=3, rows=3, center offset = (3-1)/2 = 1
      // anchor at floor(5 - 1, 5 - 1) = floor(4, 4) = (4, 4)
      // Piece occupies [4,5,6] x [4,5,6], center at (5, 5) ✓
      expect(result).toEqual({ row: 4, col: 4 });
    });

    test('handles piece center at board top-left', () => {
      // Piece center at grid position (0, 0) -> screen position (100, 200)
      const result = touchToPlacement(100, 200, mockPieceShape2x2, mockBoardLayout);
      // 2x2 piece centered at (0, 0) -> anchor at floor(-0.5, -0.5) = (-1, -1)
      expect(result).toEqual({ row: -1, col: -1 });
    });

    test('handles piece center at arbitrary position', () => {
      // Piece center at grid position (7, 3) -> screen position (310, 290)
      const result = touchToPlacement(310, 290, mockPieceShape2x2, mockBoardLayout);
      // 2x2 piece centered at (7, 3) -> anchor at floor(6.5, 2.5) = (6, 2)
      // Piece occupies [6,7] x [2,3], center at (6.5, 2.5) ✓
      expect(result).toEqual({ row: 2, col: 6 });
    });

    test('returns null when pieceShape is null', () => {
      const result = touchToPlacement(250, 350, null, mockBoardLayout);
      expect(result).toBeNull();
    });

    test('returns null when boardLayout is null', () => {
      const result = touchToPlacement(250, 350, mockPieceShape2x2, null);
      expect(result).toBeNull();
    });
  });
});
