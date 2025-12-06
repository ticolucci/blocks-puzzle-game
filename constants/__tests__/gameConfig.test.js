import { GAME_CONFIG, COLORS, PIECE_SHAPES, COLOR_POOL } from '../gameConfig';

describe('gameConfig', () => {
  describe('COLOR_POOL', () => {
    test('should exist as an array', () => {
      expect(COLOR_POOL).toBeDefined();
      expect(Array.isArray(COLOR_POOL)).toBe(true);
    });

    test('should contain the initial 6 colors', () => {
      expect(COLOR_POOL).toContain('#FF0000'); // red
      expect(COLOR_POOL).toContain('#0000FF'); // blue
      expect(COLOR_POOL).toContain('#00FF00'); // green
      expect(COLOR_POOL).toContain('#FFFF00'); // yellow
      expect(COLOR_POOL).toContain('#800080'); // purple
      expect(COLOR_POOL).toContain('#FFC0CB'); // pink
    });

    test('should have exactly 6 colors', () => {
      expect(COLOR_POOL.length).toBe(6);
    });
  });
});
