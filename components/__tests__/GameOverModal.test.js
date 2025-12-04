import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GameOverModal from '../GameOverModal';

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
});
