import { rotateMatrixClockwise, rotateMatrix } from '../pieceRotation';

describe('pieceRotation', () => {
  describe('rotateMatrixClockwise', () => {
    test('rotates a 2x2 L-shape 90° clockwise', () => {
      // L-shape:
      // 1 0
      // 1 1
      const lShape = [
        [1, 0],
        [1, 1],
      ];

      // Expected after 90° clockwise rotation:
      // 1 1
      // 1 0
      const expected = [
        [1, 1],
        [1, 0],
      ];

      const result = rotateMatrixClockwise(lShape);
      expect(result).toEqual(expected);
    });
  });

  describe('rotateMatrix', () => {
    const original = [
      [1, 0],
      [1, 1],
    ];

    test('rotates 0° (no rotation)', () => {
      const result = rotateMatrix(original, 0);
      expect(result).toEqual(original);
    });

    test('rotates 90° clockwise', () => {
      const expected = [
        [1, 1],
        [1, 0],
      ];
      const result = rotateMatrix(original, 90);
      expect(result).toEqual(expected);
    });

    test('rotates 180° clockwise', () => {
      const expected = [
        [1, 1],
        [0, 1],
      ];
      const result = rotateMatrix(original, 180);
      expect(result).toEqual(expected);
    });

    test('rotates 270° clockwise', () => {
      const expected = [
        [0, 1],
        [1, 1],
      ];
      const result = rotateMatrix(original, 270);
      expect(result).toEqual(expected);
    });
  });
});
