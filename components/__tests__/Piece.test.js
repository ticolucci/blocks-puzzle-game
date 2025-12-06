import React from 'react';
import { render } from '@testing-library/react-native';
import Piece from '../Piece';

describe('Piece', () => {
  const squareShape = [
    [1, 1],
    [1, 1],
  ];
  const squareSvgRefs = ['solid-red', 'solid-red', 'solid-red', 'solid-red'];

  test('renders a 2x2 square piece', () => {
    const { getAllByTestId } = render(
      <Piece shape={squareShape} svgRefs={squareSvgRefs} />
    );
    const blocks = getAllByTestId(/piece-block-/);
    expect(blocks).toHaveLength(4); // 2x2 = 4 filled blocks
  });

  test('renders filled blocks based on shape matrix', () => {
    const lShape = [
      [1, 0],
      [1, 1],
    ];
    const lShapeSvgRefs = ['solid-blue', 'solid-blue', 'solid-blue'];
    const { getAllByTestId } = render(
      <Piece shape={lShape} svgRefs={lShapeSvgRefs} />
    );
    const blocks = getAllByTestId(/piece-block-/);
    expect(blocks).toHaveLength(3); // Only 3 filled blocks in L shape
  });

  test('renders with custom svgRefs', () => {
    const customSvgRefs = ['solid-green', 'solid-green', 'solid-green', 'solid-green'];
    const { getAllByTestId } = render(
      <Piece shape={squareShape} svgRefs={customSvgRefs} />
    );
    const blocks = getAllByTestId(/piece-block-/);
    expect(blocks.length).toBe(4); // Verify blocks exist with custom color
  });

  test('renders empty cells for 0 values in shape matrix', () => {
    const shape = [
      [1, 0],
      [0, 1],
    ];
    const shapeSvgRefs = ['solid-red', 'solid-red'];
    const { getAllByTestId } = render(
      <Piece shape={shape} svgRefs={shapeSvgRefs} />
    );
    const blocks = getAllByTestId(/piece-block-/);
    expect(blocks).toHaveLength(2); // Only cells with 1 are rendered
  });
});
