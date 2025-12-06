import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';

// Mock the highScores utility
jest.mock('../../utils/highScores', () => ({
  getHighScores: jest.fn(),
}));

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  addListener: jest.fn(() => jest.fn()), // Return unsubscribe function
};

describe('HomeScreen', () => {
  const { getHighScores } = require('../../utils/highScores');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders New Game button', () => {
    getHighScores.mockResolvedValue([]);
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    expect(getByText('New Game')).toBeTruthy();
  });

  test('navigates to Game screen when New Game is pressed', () => {
    getHighScores.mockResolvedValue([]);
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    fireEvent.press(getByText('New Game'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Game');
  });

  describe('High Scores Display', () => {
    test('displays "High Scores" title when scores exist', async () => {
      const mockScores = [
        { name: 'AAA', score: 1000 },
      ];
      getHighScores.mockResolvedValue(mockScores);

      const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(getByText('High Scores')).toBeTruthy();
      });
    });

    test('displays top 3 high scores in order', async () => {
      const mockScores = [
        { name: 'AAA', score: 1500 },
        { name: 'BBB', score: 1200 },
        { name: 'CCC', score: 900 },
      ];
      getHighScores.mockResolvedValue(mockScores);

      const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(getByText(/AAA/)).toBeTruthy();
        expect(getByText(/1500/)).toBeTruthy();
        expect(getByText(/BBB/)).toBeTruthy();
        expect(getByText(/1200/)).toBeTruthy();
        expect(getByText(/CCC/)).toBeTruthy();
        expect(getByText(/900/)).toBeTruthy();
      });
    });

    test('displays rank numbers (1, 2, 3) for each score', async () => {
      const mockScores = [
        { name: 'AAA', score: 1500 },
        { name: 'BBB', score: 1200 },
        { name: 'CCC', score: 900 },
      ];
      getHighScores.mockResolvedValue(mockScores);

      const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(getByText('1.')).toBeTruthy();
        expect(getByText('2.')).toBeTruthy();
        expect(getByText('3.')).toBeTruthy();
      });
    });

    test('does not display high scores section when no scores exist', async () => {
      getHighScores.mockResolvedValue([]);

      const { queryByText } = render(<HomeScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(queryByText('High Scores')).toBeNull();
      });
    });

    test('displays only available scores when fewer than 3 exist', async () => {
      const mockScores = [
        { name: 'AAA', score: 1500 },
      ];
      getHighScores.mockResolvedValue(mockScores);

      const { getByText, queryByText } = render(<HomeScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(getByText('1.')).toBeTruthy();
        expect(getByText('AAA')).toBeTruthy();
        expect(queryByText('2.')).toBeNull();
        expect(queryByText('3.')).toBeNull();
      });
    });

    test('loads high scores when screen becomes focused', async () => {
      getHighScores.mockResolvedValue([
        { name: 'AAA', score: 1000 },
      ]);

      render(<HomeScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(getHighScores).toHaveBeenCalled();
      });
    });

    test('reloads high scores when navigating back to screen', async () => {
      // Initial scores
      getHighScores.mockResolvedValue([
        { name: 'AAA', score: 1000 },
      ]);

      // Create a mock navigation with addListener
      let focusListener;
      const mockNavigationWithListener = {
        navigate: jest.fn(),
        addListener: jest.fn((event, callback) => {
          if (event === 'focus') {
            focusListener = callback;
          }
          // Return unsubscribe function
          return jest.fn();
        }),
      };

      render(<HomeScreen navigation={mockNavigationWithListener} />);

      // Wait for initial load
      await waitFor(() => {
        expect(getHighScores).toHaveBeenCalledTimes(1);
      });

      // Simulate new scores being saved elsewhere
      getHighScores.mockResolvedValue([
        { name: 'BBB', score: 2000 },
        { name: 'AAA', score: 1000 },
      ]);

      // Trigger focus event (simulating navigation back)
      if (focusListener) {
        focusListener();
      }

      // getHighScores should be called again
      await waitFor(() => {
        expect(getHighScores).toHaveBeenCalledTimes(2);
      });
    });
  });
});
