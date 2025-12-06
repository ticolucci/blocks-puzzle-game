import { getPieceLibrary, areAllPiecesPlaced } from '../pieceLibrary';
import { PIECE_SHAPES } from '../../constants/gameConfig';

describe('pieceLibrary', () => {
  describe('getPieceLibrary', () => {
    test('returns the same library instance on multiple calls (cached)', () => {
      const library1 = getPieceLibrary();
      const library2 = getPieceLibrary();

      // Should return the exact same instance
      expect(library1).toBe(library2);
    });

    test('returns a valid piece library', () => {
      const library = getPieceLibrary();

      // Should have correct number of pieces
      const shapeCount = Object.keys(PIECE_SHAPES).length;
      expect(library).toHaveLength(shapeCount * 4);

      // All pieces should have valid structure
      library.forEach(piece => {
        expect(piece).toHaveProperty('id');
        expect(piece).toHaveProperty('shapeName');
        expect(piece).toHaveProperty('shape');
      });
    });
  });

  describe('getRandomPieces', () => {
    test('returns the requested number of random pieces', () => {
      const pieces = getRandomPieces(3);
      expect(pieces).toHaveLength(3);
    });

    test('each piece has a unique runtime ID', () => {
      const pieces = getRandomPieces(5);

      const runtimeIds = pieces.map(p => p.runtimeId);
      const uniqueIds = new Set(runtimeIds);

      // All runtime IDs should be unique
      expect(uniqueIds.size).toBe(5);
    });

    test('returned pieces have all required fields including runtimeId', () => {
      const pieces = getRandomPieces(3);

      pieces.forEach(piece => {
        expect(piece).toHaveProperty('id');
        expect(piece).toHaveProperty('shapeName');
        expect(piece).toHaveProperty('shape');
        expect(piece).toHaveProperty('runtimeId');
        expect(typeof piece.runtimeId).toBe('number');
      });
    });

    test('pieces are selected from the library', () => {
      const library = getPieceLibrary();
      const pieces = getRandomPieces(3);

      pieces.forEach(piece => {
        // Should find a matching piece in library (ignoring runtimeId)
        const matchInLibrary = library.some(libraryPiece =>
          libraryPiece.id === piece.id &&
          libraryPiece.shapeName === piece.shapeName
        );
        expect(matchInLibrary).toBe(true);
      });
    });

    test('allows selecting more pieces than library size (with repeats)', () => {
      const library = getPieceLibrary();
      const pieces = getRandomPieces(library.length + 10);

      expect(pieces).toHaveLength(library.length + 10);

      // All should still have unique runtime IDs
      const runtimeIds = pieces.map(p => p.runtimeId);
      const uniqueIds = new Set(runtimeIds);
      expect(uniqueIds.size).toBe(library.length + 10);
    });

    test('each piece has svgRefs property', () => {
      const pieces = getRandomPieces(3);

      pieces.forEach(piece => {
        expect(piece).toHaveProperty('svgRefs');
        expect(Array.isArray(piece.svgRefs)).toBe(true);
      });
    });

    test('piece svgRefs are from the SVG_ID_POOL', () => {
      const { SVG_ID_POOL } = require('../../constants/gameConfig');
      const pieces = getRandomPieces(10);

      pieces.forEach(piece => {
        // All svgRefs for a normal piece should be the same SVG ID
        const uniqueSvgIds = [...new Set(piece.svgRefs)];
        expect(uniqueSvgIds).toHaveLength(1);
        expect(SVG_ID_POOL).toContain(uniqueSvgIds[0]);
      });
    });
  });

  describe('areAllPiecesPlaced', () => {
    test('returns true when all pieces are placed', () => {
      const pieces = [
        { runtimeId: 1, shape: [[1]], isPlaced: true },
        { runtimeId: 2, shape: [[1]], isPlaced: true },
        { runtimeId: 3, shape: [[1]], isPlaced: true },
      ];

      expect(areAllPiecesPlaced(pieces)).toBe(true);
    });

    test('returns false when no pieces are placed', () => {
      const pieces = [
        { runtimeId: 1, shape: [[1]], isPlaced: false },
        { runtimeId: 2, shape: [[1]], isPlaced: false },
        { runtimeId: 3, shape: [[1]], isPlaced: false },
      ];

      expect(areAllPiecesPlaced(pieces)).toBe(false);
    });

    test('returns false when only some pieces are placed', () => {
      const pieces = [
        { runtimeId: 1, shape: [[1]], isPlaced: true },
        { runtimeId: 2, shape: [[1]], isPlaced: false },
        { runtimeId: 3, shape: [[1]], isPlaced: true },
      ];

      expect(areAllPiecesPlaced(pieces)).toBe(false);
    });

    test('returns false when only one piece is not placed', () => {
      const pieces = [
        { runtimeId: 1, shape: [[1]], isPlaced: true },
        { runtimeId: 2, shape: [[1]], isPlaced: true },
        { runtimeId: 3, shape: [[1]], isPlaced: false },
      ];

      expect(areAllPiecesPlaced(pieces)).toBe(false);
    });

    test('returns true for empty array', () => {
      expect(areAllPiecesPlaced([])).toBe(true);
    });

    test('handles pieces without isPlaced property (treats as false)', () => {
      const pieces = [
        { runtimeId: 1, shape: [[1]], isPlaced: true },
        { runtimeId: 2, shape: [[1]] }, // Missing isPlaced
        { runtimeId: 3, shape: [[1]], isPlaced: true },
      ];

      expect(areAllPiecesPlaced(pieces)).toBe(false);
    });
  });

  describe('createRainbowPiece', () => {
    test('creates a rainbow piece with correct structure', () => {
      const { createRainbowPiece } = require('../pieceLibrary');
      const rainbowPiece = createRainbowPiece();

      expect(rainbowPiece).toHaveProperty('runtimeId');
      expect(rainbowPiece).toHaveProperty('id');
      expect(rainbowPiece).toHaveProperty('shapeName');
      expect(rainbowPiece).toHaveProperty('shape');
      expect(rainbowPiece).toHaveProperty('svgRefs');
      expect(rainbowPiece).toHaveProperty('type');
    });

    test('rainbow piece has type "rainbow"', () => {
      const { createRainbowPiece } = require('../pieceLibrary');
      const { PIECE_TYPES } = require('../../constants/gameConfig');
      const rainbowPiece = createRainbowPiece();

      expect(rainbowPiece.type).toBe(PIECE_TYPES.RAINBOW);
    });

    test('rainbow piece has rainbow SVG sequence', () => {
      const { createRainbowPiece } = require('../pieceLibrary');
      const { RAINBOW_SVG_SEQUENCE } = require('../../constants/gameConfig');
      const rainbowPiece = createRainbowPiece();

      expect(rainbowPiece.svgRefs).toEqual(RAINBOW_SVG_SEQUENCE);
    });

    test('rainbow piece has a 5x1 line shape', () => {
      const { createRainbowPiece } = require('../pieceLibrary');
      const rainbowPiece = createRainbowPiece();

      expect(rainbowPiece.shape).toEqual([[1, 1, 1, 1, 1]]);
      expect(rainbowPiece.shapeName).toBe('RAINBOW');
    });
  });

  describe('initializeGamePieces with rainbow pieces', () => {
    test('occasionally generates rainbow pieces based on probability', () => {
      const { initializeGamePieces } = require('../pieceLibrary');
      const { PIECE_TYPES } = require('../../constants/gameConfig');

      // Generate many pieces to test probability
      const pieces = initializeGamePieces(100, 1.0); // 100% rainbow probability for testing

      // All pieces should be rainbow pieces
      const rainbowCount = pieces.filter(p => p.type === PIECE_TYPES.RAINBOW).length;
      expect(rainbowCount).toBe(100);
    });

    test('with 0% probability, no rainbow pieces are generated', () => {
      const { initializeGamePieces } = require('../pieceLibrary');
      const { PIECE_TYPES } = require('../../constants/gameConfig');

      const pieces = initializeGamePieces(100, 0); // 0% rainbow probability

      const rainbowCount = pieces.filter(p => p.type === PIECE_TYPES.RAINBOW).length;
      expect(rainbowCount).toBe(0);
    });

    test('rainbow probability parameter is optional and defaults to config value', () => {
      const { initializeGamePieces } = require('../pieceLibrary');

      // Should not throw when called without rainbow probability parameter
      expect(() => initializeGamePieces(3)).not.toThrow();
    });
  });
});
