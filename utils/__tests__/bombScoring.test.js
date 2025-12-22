import { calculateBombDestructionScore } from '../bombScoring';

describe('calculateBombDestructionScore', () => {
  test('returns 0 points when no blocks are destroyed', () => {
    const destroyedBlockCount = 0;
    expect(calculateBombDestructionScore(destroyedBlockCount)).toBe(0);
  });

  test('returns 10 points for destroying 1 block', () => {
    const destroyedBlockCount = 1;
    expect(calculateBombDestructionScore(destroyedBlockCount)).toBe(10);
  });

  test('returns 50 points for destroying 5 blocks', () => {
    const destroyedBlockCount = 5;
    expect(calculateBombDestructionScore(destroyedBlockCount)).toBe(50);
  });

  test('returns 100 points for destroying 10 blocks', () => {
    const destroyedBlockCount = 10;
    expect(calculateBombDestructionScore(destroyedBlockCount)).toBe(100);
  });

  test('returns 250 points for destroying 25 blocks (full 5x5)', () => {
    const destroyedBlockCount = 25;
    expect(calculateBombDestructionScore(destroyedBlockCount)).toBe(250);
  });

  test('returns correct points for partial destruction near board edge', () => {
    // If bomb is placed at edge, it might only destroy 15 blocks instead of 25
    const destroyedBlockCount = 15;
    expect(calculateBombDestructionScore(destroyedBlockCount)).toBe(150);
  });
});
