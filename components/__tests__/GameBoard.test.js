import React from 'react';
import { render } from '@testing-library/react-native';
import GameBoard from '../GameBoard';

describe('GameBoard', () => {
  test('renders a 10x10 grid', () => {
    const { getAllByTestId } = render(<GameBoard size={10} />);
    const cells = getAllByTestId(/grid-cell-/);
    expect(cells).toHaveLength(100); // 10x10 = 100 cells
  });

  test('all grid cells start empty', () => {
    const { getAllByTestId } = render(<GameBoard size={10} />);
    const cells = getAllByTestId(/grid-cell-/);
    cells.forEach(cell => {
      expect(cell.props.accessibilityState).toEqual({ selected: false });
    });
  });
});
