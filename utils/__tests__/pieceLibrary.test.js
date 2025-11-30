import { generateRotations, generatePieceLibrary } from '../pieceLibrary';
import { PIECE_SHAPES } from '../../constants/gameConfig';

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
});
