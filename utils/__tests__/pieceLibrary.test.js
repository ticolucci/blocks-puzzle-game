import { generateRotations } from '../pieceLibrary';

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
});
