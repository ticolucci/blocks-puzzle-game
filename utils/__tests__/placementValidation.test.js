import { canPlacePiece, getAffectedCells, isPossibleToPlace } from '../placementValidation';
import { createEmptyGrid } from '../gridHelpers';

describe('placementValidation', () => {
  const boardSize = 10;
  let emptyGrid;

  beforeEach(() => {
    emptyGrid = createEmptyGrid(boardSize);
  });

  describe('canPlacePiece', () => {
    const squarePiece = {
      shape: [
        [1, 1],
        [1, 1],
      ],
    };

    const linePiece = {
      shape: [[1, 1, 1, 1, 1]],
    };

    const lShapePiece = {
      shape: [
        [1, 0],
        [1, 1],
      ],
    };

    test('returns true for valid placement in empty grid', () => {
      const result = canPlacePiece(squarePiece, 0, 0, emptyGrid, boardSize);
      expect(result.valid).toBe(true);
      expect(result.affectedCells).toHaveLength(4);
    });

    test('returns true for valid placement in middle of empty grid', () => {
      const result = canPlacePiece(squarePiece, 5, 5, emptyGrid, boardSize);
      expect(result.valid).toBe(true);
      expect(result.affectedCells).toEqual([
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 6, col: 5 },
        { row: 6, col: 6 },
      ]);
    });

    test('returns false when piece extends beyond right edge', () => {
      const result = canPlacePiece(squarePiece, 0, 9, emptyGrid, boardSize);
      expect(result.valid).toBe(false);
    });

    test('returns false when piece extends beyond bottom edge', () => {
      const result = canPlacePiece(squarePiece, 9, 0, emptyGrid, boardSize);
      expect(result.valid).toBe(false);
    });

    test('returns false when piece extends beyond left edge (negative col)', () => {
      const result = canPlacePiece(squarePiece, 0, -1, emptyGrid, boardSize);
      expect(result.valid).toBe(false);
    });

    test('returns false when piece extends beyond top edge (negative row)', () => {
      const result = canPlacePiece(squarePiece, -1, 0, emptyGrid, boardSize);
      expect(result.valid).toBe(false);
    });

    test('returns false when piece overlaps filled cells', () => {
      // Fill some cells
      emptyGrid[5][5].filled = true;
      emptyGrid[5][6].filled = true;

      const result = canPlacePiece(squarePiece, 5, 5, emptyGrid, boardSize);
      expect(result.valid).toBe(false);
    });

    test('returns false when piece partially overlaps filled cells', () => {
      // Fill one cell that would overlap
      emptyGrid[5][6].filled = true;

      const result = canPlacePiece(squarePiece, 5, 5, emptyGrid, boardSize);
      expect(result.valid).toBe(false);
    });

    test('returns true when piece fits between filled cells', () => {
      // Fill cells around but not in the placement area
      emptyGrid[4][4].filled = true;
      emptyGrid[7][7].filled = true;

      const result = canPlacePiece(squarePiece, 5, 5, emptyGrid, boardSize);
      expect(result.valid).toBe(true);
    });

    test('validates long horizontal line piece at top edge', () => {
      const result = canPlacePiece(linePiece, 0, 0, emptyGrid, boardSize);
      expect(result.valid).toBe(true);
      expect(result.affectedCells).toHaveLength(5);
    });

    test('returns false for long line piece extending beyond right edge', () => {
      const result = canPlacePiece(linePiece, 0, 6, emptyGrid, boardSize);
      expect(result.valid).toBe(false);
    });

    test('validates L-shape piece placement', () => {
      const result = canPlacePiece(lShapePiece, 0, 0, emptyGrid, boardSize);
      expect(result.valid).toBe(true);
      expect(result.affectedCells).toHaveLength(3);
    });

    test('handles piece with empty cells in shape array', () => {
      const result = canPlacePiece(lShapePiece, 5, 5, emptyGrid, boardSize);
      expect(result.valid).toBe(true);
      // Should only count filled cells (value === 1)
      expect(result.affectedCells).toEqual([
        { row: 5, col: 5 },
        { row: 6, col: 5 },
        { row: 6, col: 6 },
      ]);
    });

    test('returns false for placement at exact boundary that would overflow', () => {
      // Placing 2x2 at (9,9) would overflow
      const result = canPlacePiece(squarePiece, 9, 9, emptyGrid, boardSize);
      expect(result.valid).toBe(false);
    });

    test('allows placement at corner (8,8) for 2x2 piece', () => {
      const result = canPlacePiece(squarePiece, 8, 8, emptyGrid, boardSize);
      expect(result.valid).toBe(true);
      expect(result.affectedCells).toEqual([
        { row: 8, col: 8 },
        { row: 8, col: 9 },
        { row: 9, col: 8 },
        { row: 9, col: 9 },
      ]);
    });
  });

  describe('getAffectedCells', () => {
    test('returns correct cells for 2x2 square at (0,0)', () => {
      const piece = {
        shape: [
          [1, 1],
          [1, 1],
        ],
      };
      const result = getAffectedCells(piece, 0, 0);
      expect(result).toEqual([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
      ]);
    });

    test('returns correct cells for 2x2 square at (5,5)', () => {
      const piece = {
        shape: [
          [1, 1],
          [1, 1],
        ],
      };
      const result = getAffectedCells(piece, 5, 5);
      expect(result).toEqual([
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 6, col: 5 },
        { row: 6, col: 6 },
      ]);
    });

    test('returns correct cells for L-shape', () => {
      const piece = {
        shape: [
          [1, 0],
          [1, 1],
        ],
      };
      const result = getAffectedCells(piece, 3, 3);
      expect(result).toEqual([
        { row: 3, col: 3 },
        { row: 4, col: 3 },
        { row: 4, col: 4 },
      ]);
    });

    test('returns correct cells for horizontal line', () => {
      const piece = {
        shape: [[1, 1, 1, 1, 1]],
      };
      const result = getAffectedCells(piece, 0, 0);
      expect(result).toEqual([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 0, col: 3 },
        { row: 0, col: 4 },
      ]);
    });

    test('returns correct cells for vertical line', () => {
      const piece = {
        shape: [[1], [1], [1], [1]],
      };
      const result = getAffectedCells(piece, 2, 5);
      expect(result).toEqual([
        { row: 2, col: 5 },
        { row: 3, col: 5 },
        { row: 4, col: 5 },
        { row: 5, col: 5 },
      ]);
    });

    test('returns correct cells for single block', () => {
      const piece = {
        shape: [[1]],
      };
      const result = getAffectedCells(piece, 7, 3);
      expect(result).toEqual([{ row: 7, col: 3 }]);
    });

    test('skips empty cells in shape', () => {
      const piece = {
        shape: [
          [1, 0, 1],
          [0, 1, 0],
          [1, 0, 1],
        ],
      };
      const result = getAffectedCells(piece, 0, 0);
      expect(result).toEqual([
        { row: 0, col: 0 },
        { row: 0, col: 2 },
        { row: 1, col: 1 },
        { row: 2, col: 0 },
        { row: 2, col: 2 },
      ]);
    });
  });

  describe('isPossibleToPlace', () => {
    const squarePiece = {
      shape: [
        [1, 1],
        [1, 1],
      ],
    };

    const linePiece = {
      shape: [[1, 1, 1, 1, 1]],
    };

    const singleBlockPiece = {
      shape: [[1]],
    };

    test('returns true for empty board with any piece', () => {
      const result = isPossibleToPlace(squarePiece, emptyGrid, boardSize);
      expect(result).toBe(true);
    });

    test('returns true when there is at least one valid position', () => {
      // Fill most of the board except one corner
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          if (!(row >= 8 && col >= 8)) {
            emptyGrid[row][col].filled = true;
          }
        }
      }

      const result = isPossibleToPlace(squarePiece, emptyGrid, boardSize);
      expect(result).toBe(true);
    });

    test('returns false when board is completely full', () => {
      // Fill entire board
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          emptyGrid[row][col].filled = true;
        }
      }

      const result = isPossibleToPlace(singleBlockPiece, emptyGrid, boardSize);
      expect(result).toBe(false);
    });

    test('returns false when no space is large enough for the piece', () => {
      // Create a checkerboard pattern - no 2x2 space available
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          if ((row + col) % 2 === 0) {
            emptyGrid[row][col].filled = true;
          }
        }
      }

      const result = isPossibleToPlace(squarePiece, emptyGrid, boardSize);
      expect(result).toBe(false);
    });

    test('returns true for single block when at least one cell is empty', () => {
      // Fill entire board except one cell
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          emptyGrid[row][col].filled = true;
        }
      }
      emptyGrid[5][5].filled = false;

      const result = isPossibleToPlace(singleBlockPiece, emptyGrid, boardSize);
      expect(result).toBe(true);
    });

    test('returns false for large piece on nearly full board', () => {
      // Fill board leaving only small gaps
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          if (!(row === 5 && col === 5)) {
            emptyGrid[row][col].filled = true;
          }
        }
      }

      // 5-cell line piece cannot fit
      const result = isPossibleToPlace(linePiece, emptyGrid, boardSize);
      expect(result).toBe(false);
    });

    test('returns true when piece fits at edge of board', () => {
      // Fill board except top row
      for (let row = 1; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          emptyGrid[row][col].filled = true;
        }
      }

      const result = isPossibleToPlace(linePiece, emptyGrid, boardSize);
      expect(result).toBe(true);
    });
  });
});
