import React from 'react';
import { render } from '@testing-library/react-native';
import PieceSelector from '../PieceSelector';

// Mock DraggablePiece component
jest.mock('../DraggablePiece', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function DraggablePiece({ piece }) {
    return (
      <View testID={`draggable-piece-${piece.runtimeId || piece.id}`}>
        <Text>Draggable Piece</Text>
      </View>
    );
  };
});

describe('PieceSelector', () => {
  const mockPieces = [
    { runtimeId: 1, id: 'piece-1', shape: [[1, 1], [1, 1]], isPlaced: false },
    { runtimeId: 2, id: 'piece-2', shape: [[1, 1], [1, 1]], isPlaced: false },
    { runtimeId: 3, id: 'piece-3', shape: [[1, 1], [1, 1]], isPlaced: false },
  ];

  const mockHandlers = {
    onDragStart: jest.fn(),
    onDragMove: jest.fn(),
    onDragEnd: jest.fn(),
  };

  test('renders three piece selection slots', () => {
    const { getAllByTestId } = render(
      <PieceSelector pieces={mockPieces} {...mockHandlers} />
    );
    const slots = getAllByTestId(/piece-slot-/);
    expect(slots).toHaveLength(3);
  });

  test('renders DraggablePiece for available pieces', () => {
    const { getByTestId } = render(
      <PieceSelector pieces={mockPieces} {...mockHandlers} />
    );

    expect(getByTestId('draggable-piece-1')).toBeTruthy();
    expect(getByTestId('draggable-piece-2')).toBeTruthy();
    expect(getByTestId('draggable-piece-3')).toBeTruthy();
  });

  test('renders empty slot for placed pieces', () => {
    const piecesWithPlaced = [
      { runtimeId: 1, id: 'piece-1', shape: [[1, 1], [1, 1]], isPlaced: true },
      { runtimeId: 2, id: 'piece-2', shape: [[1, 1], [1, 1]], isPlaced: false },
      { runtimeId: 3, id: 'piece-3', shape: [[1, 1], [1, 1]], isPlaced: false },
    ];

    const { queryByTestId, getByTestId } = render(
      <PieceSelector pieces={piecesWithPlaced} {...mockHandlers} />
    );

    // First piece is placed, should not have DraggablePiece
    expect(queryByTestId('draggable-piece-1')).toBeNull();

    // Other pieces should have DraggablePiece
    expect(getByTestId('draggable-piece-2')).toBeTruthy();
    expect(getByTestId('draggable-piece-3')).toBeTruthy();
  });

  test('applies placedSlot style to placed pieces', () => {
    const piecesWithPlaced = [
      { runtimeId: 1, id: 'piece-1', shape: [[1, 1], [1, 1]], isPlaced: true },
      { runtimeId: 2, id: 'piece-2', shape: [[1, 1], [1, 1]], isPlaced: false },
    ];

    const { getByTestId } = render(
      <PieceSelector pieces={piecesWithPlaced} {...mockHandlers} />
    );

    const placedSlot = getByTestId('piece-slot-0');
    const activeSlot = getByTestId('piece-slot-1');

    // Check that styles are applied (checking for opacity in the style array)
    expect(placedSlot.props.style).toContainEqual(
      expect.objectContaining({ opacity: 0.5 })
    );
    expect(activeSlot.props.style).not.toContainEqual(
      expect.objectContaining({ opacity: 0.5 })
    );
  });
});
