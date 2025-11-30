import React from 'react';
import { render } from '@testing-library/react-native';
import Piece from '../Piece';

describe('Piece', () => {
  const squareShape = [
    [1, 1],
    [1, 1],
  ];

  test('renders a 2x2 square piece', () => {
    const { getAllByTestId } = render(<Piece shape={squareShape} />);
    const blocks = getAllByTestId(/piece-block-/);
    expect(blocks).toHaveLength(4); // 2x2 = 4 filled blocks
  });

  test('renders filled blocks based on shape matrix', () => {
    const lShape = [
      [1, 0],
      [1, 1],
    ];
    const { getAllByTestId } = render(<Piece shape={lShape} />);
    const blocks = getAllByTestId(/piece-block-/);
    expect(blocks).toHaveLength(3); // Only 3 filled blocks in L shape
  });

  test('renders with custom color', () => {
    const { getAllByTestId } = render(
      <Piece shape={squareShape} color="#FF0000" />
    );
    const blocks = getAllByTestId(/piece-block-/);
    expect(blocks.length).toBe(4); // Verify blocks exist with custom color
  });

  test('renders empty cells for 0 values in shape matrix', () => {
    const shape = [
      [1, 0],
      [0, 1],
    ];
    const { getAllByTestId } = render(<Piece shape={shape} />);
    const blocks = getAllByTestId(/piece-block-/);
    expect(blocks).toHaveLength(2); // Only cells with 1 are rendered
  });
});
