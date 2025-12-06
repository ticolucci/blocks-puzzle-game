import { generateRotations, generatePieceLibrary, getPieceLibrary, getRandomPieces, areAllPiecesPlaced } from '../pieceLibrary';
import { PIECE_SHAPES, COLOR_POOL } from '../../constants/gameConfig';

describe('pieceLibrary', () => {
  describe('generateRotations', () => {
    test('generates 4 rotation variants for a single shape with metadata', () => {
      const shapeName = 'SQUARE_2X2';
      const shape = [[1, 1], [1, 1]];

      const result = generateRotations(shapeName, shape);

      // Should return array of 4 pieces
      expect(result).toHaveLength(4);

      // Check 0° rotation
      expect(result[0]).toEqual({
        id: 'SQUARE_2X2_0',
        shapeName: 'SQUARE_2X2',
        shape: [[1, 1], [1, 1]],
        rotation: 0,
        rotationIndex: 0,
      });

      // Check 90° rotation
      expect(result[1]).toEqual({
        id: 'SQUARE_2X2_90',
        shapeName: 'SQUARE_2X2',
        shape: [[1, 1], [1, 1]],
        rotation: 90,
        rotationIndex: 1,
      });

      // Check 180° rotation
      expect(result[2]).toEqual({
        id: 'SQUARE_2X2_180',
        shapeName: 'SQUARE_2X2',
        shape: [[1, 1], [1, 1]],
        rotation: 180,
        rotationIndex: 2,
      });

      // Check 270° rotation
      expect(result[3]).toEqual({
        id: 'SQUARE_2X2_270',
        shapeName: 'SQUARE_2X2',
        shape: [[1, 1], [1, 1]],
        rotation: 270,
        rotationIndex: 3,
      });
    });

    test('generates correct rotations for L-shape', () => {
      const shapeName = 'L_SHAPE_2X2';
      const shape = [
        [1, 0],
        [1, 1],
      ];

      const result = generateRotations(shapeName, shape);

      expect(result).toHaveLength(4);

      // 0° rotation (original)
      expect(result[0].shape).toEqual([
        [1, 0],
        [1, 1],
      ]);

      // 90° rotation
      expect(result[1].shape).toEqual([
        [1, 1],
        [1, 0],
      ]);

      // 180° rotation
      expect(result[2].shape).toEqual([
        [1, 1],
        [0, 1],
      ]);

      // 270° rotation
      expect(result[3].shape).toEqual([
        [0, 1],
        [1, 1],
      ]);
    });
  });

  describe('generatePieceLibrary', () => {
    test('generates library with all 13 shapes × 4 rotations = 52 pieces', () => {
      const library = generatePieceLibrary();

      // Should have 13 shapes * 4 rotations = 52 pieces
      const shapeCount = Object.keys(PIECE_SHAPES).length;
      expect(library).toHaveLength(shapeCount * 4);
    });

    test('includes all rotation variants for each shape', () => {
      const library = generatePieceLibrary();

      // Group by shape name
      const shapeGroups = library.reduce((acc, piece) => {
        if (!acc[piece.shapeName]) {
          acc[piece.shapeName] = [];
        }
        acc[piece.shapeName].push(piece);
        return acc;
      }, {});

      // Each shape should have 4 variants
      Object.values(shapeGroups).forEach(group => {
        expect(group).toHaveLength(4);
      });
    });

    test('all pieces have required metadata fields', () => {
      const library = generatePieceLibrary();

      library.forEach(piece => {
        expect(piece).toHaveProperty('id');
        expect(piece).toHaveProperty('shapeName');
        expect(piece).toHaveProperty('shape');
        expect(piece).toHaveProperty('rotation');
        expect(piece).toHaveProperty('rotationIndex');
        expect(typeof piece.id).toBe('string');
        expect(typeof piece.shapeName).toBe('string');
        expect(Array.isArray(piece.shape)).toBe(true);
        expect(typeof piece.rotation).toBe('number');
        expect(typeof piece.rotationIndex).toBe('number');
      });
    });

    test('rotation values are correct', () => {
      const library = generatePieceLibrary();

      library.forEach(piece => {
        expect([0, 90, 180, 270]).toContain(piece.rotation);
        expect([0, 1, 2, 3]).toContain(piece.rotationIndex);
      });
    });
  });

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
        expect(piece).toHaveProperty('rotation');
        expect(piece).toHaveProperty('rotationIndex');
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
        expect(piece).toHaveProperty('rotation');
        expect(piece).toHaveProperty('rotationIndex');
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
          libraryPiece.shapeName === piece.shapeName &&
          libraryPiece.rotation === piece.rotation
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

    test('each piece has a color property', () => {
      const pieces = getRandomPieces(3);

      pieces.forEach(piece => {
        expect(piece).toHaveProperty('color');
        expect(typeof piece.color).toBe('string');
      });
    });

    test('piece colors are from the COLOR_POOL', () => {
      const pieces = getRandomPieces(10);

      pieces.forEach(piece => {
        expect(COLOR_POOL).toContain(piece.color);
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
      expect(rainbowPiece).toHaveProperty('color');
      expect(rainbowPiece).toHaveProperty('type');
    });

    test('rainbow piece has type "rainbow"', () => {
      const { createRainbowPiece } = require('../pieceLibrary');
      const { PIECE_TYPES } = require('../../constants/gameConfig');
      const rainbowPiece = createRainbowPiece();

      expect(rainbowPiece.type).toBe(PIECE_TYPES.RAINBOW);
    });

    test('rainbow piece has special rainbow gradient color', () => {
      const { createRainbowPiece } = require('../pieceLibrary');
      const rainbowPiece = createRainbowPiece();

      expect(rainbowPiece.color).toBe('rainbow');
    });

    test('rainbow piece has a single block shape', () => {
      const { createRainbowPiece } = require('../pieceLibrary');
      const rainbowPiece = createRainbowPiece();

      expect(rainbowPiece.shape).toEqual([[1]]);
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
