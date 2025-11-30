import React from 'react';
import { render } from '@testing-library/react-native';
import GameScreen from '../GameScreen';

describe('GameScreen', () => {
  test('renders game board', () => {
    const { getAllByTestId } = render(<GameScreen />);
    const cells = getAllByTestId(/grid-cell-/);
    expect(cells.length).toBeGreaterThan(0);
  });

  test('renders 10x10 grid (100 cells)', () => {
    const { getAllByTestId } = render(<GameScreen />);
    const cells = getAllByTestId(/grid-cell-/);
    expect(cells).toHaveLength(100);
  });

  test('renders score counter', () => {
    const { getByText } = render(<GameScreen />);
    expect(getByText('Score')).toBeTruthy();
  });

  test('starts with score of 0', () => {
    const { getByText } = render(<GameScreen />);
    expect(getByText('0')).toBeTruthy();
  });

  test('renders three piece selection slots', () => {
    const { getAllByTestId } = render(<GameScreen />);
    const slots = getAllByTestId(/piece-slot-/);
    expect(slots).toHaveLength(3);
  });

  test('all three pieces are 2x2 squares', () => {
    const { getAllByTestId } = render(<GameScreen />);
    const slots = getAllByTestId(/piece-slot-/);

    // Each 2x2 square piece should have 4 blocks
    slots.forEach(slot => {
      const pieceBlocks = getAllByTestId(/piece-block-/);
      expect(pieceBlocks.length).toBeGreaterThanOrEqual(4);
    });
  });
});
