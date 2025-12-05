import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GameOverModal from '../GameOverModal';

// Mock the highScores utility
jest.mock('../../utils/highScores', () => ({
  isHighScore: jest.fn(),
  saveHighScore: jest.fn(),
}));

describe('GameOverModal', () => {
  test('renders game over title', () => {
    const { getByText } = render(<GameOverModal visible={true} score={100} />);
    expect(getByText('Game Over')).toBeTruthy();
  });

  test('displays the score', () => {
    const { getByText } = render(<GameOverModal visible={true} score={250} />);
    expect(getByText('Score: 250')).toBeTruthy();
  });

  test('does not render when visible is false', () => {
    const { queryByText } = render(<GameOverModal visible={false} score={100} />);
    expect(queryByText('Game Over')).toBeNull();
  });

  test('renders New Game button', () => {
    const { getByText } = render(<GameOverModal visible={true} score={100} />);
    expect(getByText('New Game')).toBeTruthy();
  });

  test('calls onRestart when New Game button is pressed', () => {
    const mockOnRestart = jest.fn();
    const { getByText } = render(
      <GameOverModal visible={true} score={100} onRestart={mockOnRestart} />
    );

    const newGameButton = getByText('New Game');
    fireEvent.press(newGameButton);

    expect(mockOnRestart).toHaveBeenCalledTimes(1);
  });

  test('New Game button has proper accessibility label', () => {
    const { getByLabelText } = render(<GameOverModal visible={true} score={100} />);
    expect(getByLabelText('Start a new game')).toBeTruthy();
  });

  describe('High Score Name Input', () => {
    const { isHighScore, saveHighScore } = require('../../utils/highScores');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('shows name input when score is a high score', async () => {
      isHighScore.mockResolvedValue(true);
      const { getByPlaceholderText } = render(
        <GameOverModal visible={true} score={1000} onRestart={jest.fn()} />
      );

      await waitFor(() => {
        expect(getByPlaceholderText('AAA')).toBeTruthy();
      });
    });

    test('shows congratulations message for high score', async () => {
      isHighScore.mockResolvedValue(true);
      const { getByText } = render(
        <GameOverModal visible={true} score={1000} onRestart={jest.fn()} />
      );

      await waitFor(() => {
        expect(getByText(/new high score/i)).toBeTruthy();
      });
    });

    test('does not show name input when score is not a high score', async () => {
      isHighScore.mockResolvedValue(false);
      const { queryByPlaceholderText } = render(
        <GameOverModal visible={true} score={100} onRestart={jest.fn()} />
      );

      await waitFor(() => {
        expect(queryByPlaceholderText('AAA')).toBeNull();
      });
    });

    test('name input only accepts letters and limits to 3 characters', async () => {
      isHighScore.mockResolvedValue(true);
      const { getByPlaceholderText } = render(
        <GameOverModal visible={true} score={1000} onRestart={jest.fn()} />
      );

      await waitFor(() => {
        const input = getByPlaceholderText('AAA');

        // Try to enter 4 characters - should only keep 3
        fireEvent.changeText(input, 'ABCD');
        expect(input.props.value).toBe('ABC');
      });
    });

    test('converts name input to uppercase', async () => {
      isHighScore.mockResolvedValue(true);
      const { getByPlaceholderText } = render(
        <GameOverModal visible={true} score={1000} onRestart={jest.fn()} />
      );

      await waitFor(() => {
        const input = getByPlaceholderText('AAA');
        fireEvent.changeText(input, 'abc');
        expect(input.props.value).toBe('ABC');
      });
    });

    test('submit button is disabled when name is less than 3 characters', async () => {
      isHighScore.mockResolvedValue(true);
      const { getByPlaceholderText, getByText } = render(
        <GameOverModal visible={true} score={1000} onRestart={jest.fn()} />
      );

      await waitFor(() => {
        const input = getByPlaceholderText('AAA');
        fireEvent.changeText(input, 'AB');

        const submitButton = getByText('Save Score');
        expect(submitButton.props.accessibilityState?.disabled).toBe(true);
      });
    });

    test('saves high score and calls onRestart when valid name is submitted', async () => {
      isHighScore.mockResolvedValue(true);
      saveHighScore.mockResolvedValue();
      const mockOnRestart = jest.fn();

      const { getByPlaceholderText, getByText } = render(
        <GameOverModal visible={true} score={1000} onRestart={mockOnRestart} />
      );

      await waitFor(() => {
        const input = getByPlaceholderText('AAA');
        fireEvent.changeText(input, 'ABC');
      });

      const submitButton = getByText('Save Score');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(saveHighScore).toHaveBeenCalledWith('ABC', 1000);
        expect(mockOnRestart).toHaveBeenCalled();
      });
    });

    test('strips non-letter characters from input', async () => {
      isHighScore.mockResolvedValue(true);
      const { getByPlaceholderText } = render(
        <GameOverModal visible={true} score={1000} onRestart={jest.fn()} />
      );

      await waitFor(() => {
        const input = getByPlaceholderText('AAA');
        fireEvent.changeText(input, 'A1B2C3');
        expect(input.props.value).toBe('ABC');
      });
    });
  });
});
