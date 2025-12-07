import { calculatePlacementScore } from '../placementScoring';

describe('calculatePlacementScore', () => {
  test('returns 10 points for a 1x1 piece (1 block)', () => {
    const piece = {
      shape: [[1]],
    };
    expect(calculatePlacementScore(piece)).toBe(10);
  });

  test('returns 20 points for a 2x1 piece (2 blocks)', () => {
    const piece = {
      shape: [[1, 1]],
    };
    expect(calculatePlacementScore(piece)).toBe(20);
  });

  test('returns 40 points for a 2x2 square piece (4 blocks)', () => {
    const piece = {
      shape: [
        [1, 1],
        [1, 1],
      ],
    };
    expect(calculatePlacementScore(piece)).toBe(40);
  });

  test('returns 50 points for a 5x1 line piece (5 blocks)', () => {
    const piece = {
      shape: [[1, 1, 1, 1, 1]],
    };
    expect(calculatePlacementScore(piece)).toBe(50);
  });

  test('returns 40 points for L-shape piece (4 blocks)', () => {
    const piece = {
      shape: [
        [1, 1],
        [1, 0],
      ],
    };
    expect(calculatePlacementScore(piece)).toBe(30);
  });

  test('returns 40 points for T-shape piece (4 blocks)', () => {
    const piece = {
      shape: [
        [1, 1, 1],
        [0, 1, 0],
      ],
    };
    expect(calculatePlacementScore(piece)).toBe(40);
  });

  test('counts only filled cells (1s), ignores empty cells (0s)', () => {
    const piece = {
      shape: [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1],
      ],
    };
    // 5 blocks (corners + center)
    expect(calculatePlacementScore(piece)).toBe(50);
  });

  test('returns 0 for empty piece', () => {
    const piece = {
      shape: [[0]],
    };
    expect(calculatePlacementScore(piece)).toBe(0);
  });
});
