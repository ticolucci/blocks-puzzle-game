import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PieceSelector from '../PieceSelector';

describe('PieceSelector', () => {
  const mockPieces = [
    { id: 1, shape: [[1, 1], [1, 1]] },
    { id: 2, shape: [[1, 1], [1, 1]] },
    { id: 3, shape: [[1, 1], [1, 1]] },
  ];

  test('renders three piece selection slots', () => {
    const { getAllByTestId } = render(
      <PieceSelector pieces={mockPieces} />
    );
    const slots = getAllByTestId(/piece-slot-/);
    expect(slots).toHaveLength(3);
  });

  test('calls onPieceSelect when piece is pressed', () => {
    const onSelect = jest.fn();
    const { getByTestId } = render(
      <PieceSelector pieces={mockPieces} onPieceSelect={onSelect} />
    );

    fireEvent.press(getByTestId('piece-slot-0'));
    expect(onSelect).toHaveBeenCalledWith(mockPieces[0]);
  });

  test('highlights selected piece', () => {
    const { getByTestId } = render(
      <PieceSelector pieces={mockPieces} selectedPieceId={2} />
    );

    const slot = getByTestId('piece-slot-1');
    expect(slot.props.accessibilityState).toEqual({ selected: true });
  });

  test('does not highlight unselected pieces', () => {
    const { getByTestId } = render(
      <PieceSelector pieces={mockPieces} selectedPieceId={2} />
    );

    const slot = getByTestId('piece-slot-0');
    expect(slot.props.accessibilityState).toEqual({ selected: false });
  });
});
