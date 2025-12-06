import { getRandomElement } from '../arrayHelpers';

describe('arrayHelpers', () => {
  describe('getRandomElement', () => {
    test('returns an element from the array', () => {
      const array = ['a', 'b', 'c'];
      const result = getRandomElement(array);

      expect(array).toContain(result);
    });

    test('returns different elements over multiple calls', () => {
      const array = ['a', 'b', 'c', 'd', 'e'];
      const results = new Set();

      // Call 20 times to increase chance of getting different values
      for (let i = 0; i < 20; i++) {
        results.add(getRandomElement(array));
      }

      // Should get at least 2 different values (statistically very likely)
      expect(results.size).toBeGreaterThanOrEqual(2);
    });

    test('works with single element array', () => {
      const array = ['only'];
      const result = getRandomElement(array);

      expect(result).toBe('only');
    });

    test('works with different data types', () => {
      const numberArray = [1, 2, 3];
      const numberResult = getRandomElement(numberArray);
      expect(numberArray).toContain(numberResult);

      const objectArray = [{ id: 1 }, { id: 2 }];
      const objectResult = getRandomElement(objectArray);
      expect(objectArray).toContain(objectResult);
    });

    test('throws error for empty array', () => {
      expect(() => getRandomElement([])).toThrow('Cannot get random element from empty array');
    });

    test('throws error for null or undefined', () => {
      expect(() => getRandomElement(null)).toThrow();
      expect(() => getRandomElement(undefined)).toThrow();
    });
  });
});
