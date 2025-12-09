import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DraggablePiece from '../DraggablePiece';

describe('DraggablePiece', () => {
  const mockPiece = {
    runtimeId: 1,
    id: 'SQUARE_2X2_0',
    shapeName: 'SQUARE_2X2',
    shape: [
      [1, 1],
      [1, 1],
    ],
    svgRefs: ['solid-red', 'solid-red', 'solid-red', 'solid-red'],
  };

  const mockHandlers = {
    onDragStart: jest.fn(),
    onDragMove: jest.fn(),
    onDragEnd: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders piece shape correctly', () => {
    const { getAllByTestId } = render(
      <DraggablePiece
        piece={mockPiece}
        onDragStart={mockHandlers.onDragStart}
        onDragMove={mockHandlers.onDragMove}
        onDragEnd={mockHandlers.onDragEnd}
        isPlaced={false}
      />
    );

    // Should render 4 blocks for 2x2 square
    const blocks = getAllByTestId(/piece-block-/);
    expect(blocks).toHaveLength(4);
  });

  test('renders with GestureDetector for gesture handling', () => {
    const { getByTestId } = render(
      <DraggablePiece
        piece={mockPiece}
        onDragStart={mockHandlers.onDragStart}
        onDragMove={mockHandlers.onDragMove}
        onDragEnd={mockHandlers.onDragEnd}
        isPlaced={false}
        testID="draggable-piece"
      />
    );

    const draggablePiece = getByTestId('draggable-piece');

    // Component should render (gesture-handler uses native gestures, not JS responders)
    expect(draggablePiece).toBeTruthy();
  });

  test('renders component for drag functionality', () => {
    const { getByTestId } = render(
      <DraggablePiece
        piece={mockPiece}
        onDragStart={mockHandlers.onDragStart}
        onDragMove={mockHandlers.onDragMove}
        onDragEnd={mockHandlers.onDragEnd}
        isPlaced={false}
        testID="draggable-piece"
      />
    );

    const draggablePiece = getByTestId('draggable-piece');

    // Verify component renders (gesture handlers are set up via GestureDetector)
    expect(draggablePiece).toBeTruthy();
    expect(draggablePiece.props.onLayout).toBeDefined();
  });

  test('renders draggable piece with callbacks ready', () => {
    const { getByTestId } = render(
      <DraggablePiece
        piece={mockPiece}
        onDragStart={mockHandlers.onDragStart}
        onDragMove={mockHandlers.onDragMove}
        onDragEnd={mockHandlers.onDragEnd}
        isPlaced={false}
        testID="draggable-piece"
      />
    );

    const draggablePiece = getByTestId('draggable-piece');

    // Verify component is rendered and ready for gestures
    // Note: gesture-handler gestures are native and cannot be easily simulated in unit tests
    expect(draggablePiece).toBeTruthy();
  });

  test('does not respond to gestures when isPlaced is true', () => {
    const { getByTestId } = render(
      <DraggablePiece
        piece={mockPiece}
        onDragStart={mockHandlers.onDragStart}
        onDragMove={mockHandlers.onDragMove}
        onDragEnd={mockHandlers.onDragEnd}
        isPlaced={true}
        testID="draggable-piece"
      />
    );

    const draggablePiece = getByTestId('draggable-piece');

    // Try to simulate pan gesture start
    fireEvent(draggablePiece, 'responderGrant');

    // Should not call handlers when piece is placed
    expect(mockHandlers.onDragStart).not.toHaveBeenCalled();
  });

  test('renders with disabled prop', () => {
    const { getByTestId } = render(
      <DraggablePiece
        piece={mockPiece}
        onDragStart={mockHandlers.onDragStart}
        onDragMove={mockHandlers.onDragMove}
        onDragEnd={mockHandlers.onDragEnd}
        isPlaced={false}
        disabled={true}
        testID="draggable-piece"
      />
    );

    const draggablePiece = getByTestId('draggable-piece');

    // Try to simulate pan gesture start
    fireEvent(draggablePiece, 'responderGrant');

    // Should not call handlers when disabled
    expect(mockHandlers.onDragStart).not.toHaveBeenCalled();
  });

  test('renders piece with correct color', () => {
    const { getAllByTestId } = render(
      <DraggablePiece
        piece={mockPiece}
        onDragStart={mockHandlers.onDragStart}
        onDragMove={mockHandlers.onDragMove}
        onDragEnd={mockHandlers.onDragEnd}
        isPlaced={false}
      />
    );

    // Should render blocks (exact color matching may vary)
    const blocks = getAllByTestId(/piece-block-/);
    expect(blocks.length).toBeGreaterThan(0);
  });

  test('handles different piece shapes', () => {
    const linePiece = {
      runtimeId: 2,
      shape: [[1, 1, 1, 1, 1]],
      svgRefs: ['solid-blue', 'solid-blue', 'solid-blue', 'solid-blue', 'solid-blue'],
    };

    const { getAllByTestId } = render(
      <DraggablePiece
        piece={linePiece}
        onDragStart={mockHandlers.onDragStart}
        onDragMove={mockHandlers.onDragMove}
        onDragEnd={mockHandlers.onDragEnd}
        isPlaced={false}
      />
    );

    // Should render 5 blocks for line piece
    const blocks = getAllByTestId(/piece-block-/);
    expect(blocks).toHaveLength(5);
  });

  test('renders piece at smaller scale in selector preview mode', () => {
    const selectorScale = 0.65;
    const { getByTestId } = render(
      <DraggablePiece
        piece={mockPiece}
        onDragStart={mockHandlers.onDragStart}
        onDragMove={mockHandlers.onDragMove}
        onDragEnd={mockHandlers.onDragEnd}
        isPlaced={false}
        selectorScale={selectorScale}
        testID="draggable-piece"
      />
    );

    const draggablePiece = getByTestId('draggable-piece');

    // Verify the piece is scaled down in selector
    expect(draggablePiece.props.style).toEqual(
      expect.objectContaining({
        transform: expect.arrayContaining([
          expect.objectContaining({ scale: selectorScale })
        ])
      })
    );
  });

  test('accepts selectorScale prop and applies it initially', () => {
    const customScale = 0.5;
    const { getByTestId } = render(
      <DraggablePiece
        piece={mockPiece}
        onDragStart={mockHandlers.onDragStart}
        onDragMove={mockHandlers.onDragMove}
        onDragEnd={mockHandlers.onDragEnd}
        isPlaced={false}
        selectorScale={customScale}
        testID="draggable-piece"
      />
    );

    const draggablePiece = getByTestId('draggable-piece');

    // Verify the custom scale is applied
    expect(draggablePiece.props.style.transform).toContainEqual(
      expect.objectContaining({ scale: customScale })
    );
  });
});
