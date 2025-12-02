import React from 'react';
import { render } from '@testing-library/react-native';
import GameBoard from '../GameBoard';
import { createEmptyGrid } from '../../utils/gridHelpers';

describe('GameBoard Preview Functionality', () => {
  const boardSize = 10;
  let gridState;

  beforeEach(() => {
    gridState = createEmptyGrid(boardSize);
  });

  test('accepts gridState prop instead of creating empty grid', () => {
    // Mark some cells as filled
    gridState[5][5].filled = true;
    gridState[5][6].filled = true;

    const { getByTestId } = render(
      <GameBoard size={boardSize} gridState={gridState} />
    );

    const filledCell1 = getByTestId('grid-cell-5-5');
    const filledCell2 = getByTestId('grid-cell-5-6');

    // Cells should reflect filled state from gridState prop
    expect(filledCell1.props.accessibilityState.selected).toBe(true);
    expect(filledCell2.props.accessibilityState.selected).toBe(true);
  });

  test('passes previewCells to GridCell components', () => {
    const previewCells = [
      { row: 3, col: 3 },
      { row: 3, col: 4 },
    ];

    const { getByTestId } = render(
      <GameBoard
        size={boardSize}
        gridState={gridState}
        previewCells={previewCells}
        previewValid={true}
      />
    );

    // Preview cells should be marked
    const previewCell1 = getByTestId('grid-cell-3-3');
    const previewCell2 = getByTestId('grid-cell-3-4');

    expect(previewCell1).toBeTruthy();
    expect(previewCell2).toBeTruthy();
  });

  test('passes previewValid prop to GridCell components', () => {
    const previewCells = [{ row: 0, col: 0 }];

    const { getByTestId } = render(
      <GameBoard
        size={boardSize}
        gridState={gridState}
        previewCells={previewCells}
        previewValid={false}
      />
    );

    const cell = getByTestId('grid-cell-0-0');
    expect(cell).toBeTruthy();
  });

  test('renders without preview when previewCells is null', () => {
    const { getAllByTestId } = render(
      <GameBoard size={boardSize} gridState={gridState} previewCells={null} />
    );

    const cells = getAllByTestId(/grid-cell-/);
    expect(cells).toHaveLength(100);
  });

  test('handles empty previewCells array', () => {
    const { getAllByTestId } = render(
      <GameBoard size={boardSize} gridState={gridState} previewCells={[]} />
    );

    const cells = getAllByTestId(/grid-cell-/);
    expect(cells).toHaveLength(100);
  });

  test('falls back to creating empty grid when gridState not provided', () => {
    const { getAllByTestId } = render(<GameBoard size={boardSize} />);

    const cells = getAllByTestId(/grid-cell-/);
    expect(cells).toHaveLength(100);

    // All cells should be unfilled
    cells.forEach(cell => {
      expect(cell.props.accessibilityState.selected).toBe(false);
    });
  });
});
