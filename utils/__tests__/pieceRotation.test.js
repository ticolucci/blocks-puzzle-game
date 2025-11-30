import { rotateMatrixClockwise } from '../pieceRotation';

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
});
