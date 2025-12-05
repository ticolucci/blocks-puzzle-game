import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveHighScore,
  getHighScores,
  getMaxScore,
  isHighScore
} from '../highScores';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('highScores utility', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getHighScores', () => {
    test('returns empty array when no high scores exist', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);

      const scores = await getHighScores();

      expect(scores).toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('high_scores');
    });

    test('returns parsed high scores from storage', async () => {
      const mockScores = [
        { name: 'ABC', score: 1000 },
        { name: 'XYZ', score: 500 },
      ];
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockScores));

      const scores = await getHighScores();

      expect(scores).toEqual(mockScores);
    });
  });

  describe('saveHighScore', () => {
    test('saves first high score when storage is empty', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      AsyncStorage.setItem.mockResolvedValue();

      await saveHighScore('AAA', 1500);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'high_scores',
        JSON.stringify([{ name: 'AAA', score: 1500 }])
      );
    });

    test('adds new score and keeps top 3 scores sorted by score descending', async () => {
      const existingScores = [
        { name: 'AAA', score: 1000 },
        { name: 'BBB', score: 800 },
      ];
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingScores));
      AsyncStorage.setItem.mockResolvedValue();

      await saveHighScore('CCC', 1500);

      const expectedScores = [
        { name: 'CCC', score: 1500 },
        { name: 'AAA', score: 1000 },
        { name: 'BBB', score: 800 },
      ];

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'high_scores',
        JSON.stringify(expectedScores)
      );
    });

    test('removes lowest score when adding 4th score', async () => {
      const existingScores = [
        { name: 'AAA', score: 1000 },
        { name: 'BBB', score: 800 },
        { name: 'CCC', score: 600 },
      ];
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingScores));
      AsyncStorage.setItem.mockResolvedValue();

      await saveHighScore('DDD', 900);

      const expectedScores = [
        { name: 'AAA', score: 1000 },
        { name: 'DDD', score: 900 },
        { name: 'BBB', score: 800 },
      ];

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'high_scores',
        JSON.stringify(expectedScores)
      );
    });

    test('does not add score if it is lower than existing top 3', async () => {
      const existingScores = [
        { name: 'AAA', score: 1000 },
        { name: 'BBB', score: 800 },
        { name: 'CCC', score: 600 },
      ];
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingScores));
      AsyncStorage.setItem.mockResolvedValue();

      await saveHighScore('DDD', 400);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'high_scores',
        JSON.stringify(existingScores)
      );
    });

    test('throws error when name is not exactly 3 characters', async () => {
      await expect(saveHighScore('AB', 1000)).rejects.toThrow('Name must be exactly 3 letters');
      await expect(saveHighScore('ABCD', 1000)).rejects.toThrow('Name must be exactly 3 letters');
      await expect(saveHighScore('', 1000)).rejects.toThrow('Name must be exactly 3 letters');
    });

    test('throws error when name contains non-letter characters', async () => {
      await expect(saveHighScore('AB1', 1000)).rejects.toThrow('Name must be exactly 3 letters');
      await expect(saveHighScore('A-B', 1000)).rejects.toThrow('Name must be exactly 3 letters');
      await expect(saveHighScore('A B', 1000)).rejects.toThrow('Name must be exactly 3 letters');
    });

    test('throws error when score is not a positive number', async () => {
      await expect(saveHighScore('ABC', -100)).rejects.toThrow('Score must be a positive number');
      await expect(saveHighScore('ABC', 0)).rejects.toThrow('Score must be a positive number');
      await expect(saveHighScore('ABC', NaN)).rejects.toThrow('Score must be a positive number');
    });
  });

  describe('getMaxScore', () => {
    test('returns 0 when no high scores exist', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);

      const maxScore = await getMaxScore();

      expect(maxScore).toBe(0);
    });

    test('returns highest score from stored scores', async () => {
      const mockScores = [
        { name: 'AAA', score: 1500 },
        { name: 'BBB', score: 1000 },
        { name: 'CCC', score: 800 },
      ];
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockScores));

      const maxScore = await getMaxScore();

      expect(maxScore).toBe(1500);
    });
  });

  describe('isHighScore', () => {
    test('returns true when no high scores exist', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);

      const result = await isHighScore(100);

      expect(result).toBe(true);
    });

    test('returns true when score is higher than lowest of top 3', async () => {
      const mockScores = [
        { name: 'AAA', score: 1000 },
        { name: 'BBB', score: 800 },
        { name: 'CCC', score: 600 },
      ];
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockScores));

      const result = await isHighScore(700);

      expect(result).toBe(true);
    });

    test('returns true when fewer than 3 high scores exist', async () => {
      const mockScores = [
        { name: 'AAA', score: 1000 },
      ];
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockScores));

      const result = await isHighScore(100);

      expect(result).toBe(true);
    });

    test('returns false when score is lower than all top 3 scores', async () => {
      const mockScores = [
        { name: 'AAA', score: 1000 },
        { name: 'BBB', score: 800 },
        { name: 'CCC', score: 600 },
      ];
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockScores));

      const result = await isHighScore(500);

      expect(result).toBe(false);
    });
  });
});
