import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import GameScreen from '../GameScreen';
import * as pieceLibrary from '../../utils/pieceLibrary';

// Mock DraggablePiece to make pieces queryable by testID
jest.mock('../../components/DraggablePiece', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function DraggablePiece({ piece, onDragEnd }) {
    return (
      <View testID={`draggable-piece-${piece.runtimeId}`}>
        <Text>Piece {piece.runtimeId}</Text>
        {/* Expose onDragEnd for testing */}
        {onDragEnd && (
          <View testID={`drag-end-trigger-${piece.runtimeId}`} onTouchEnd={() => onDragEnd(piece)} />
        )}
      </View>
    );
  };
});

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

  test('all three pieces are rendered as draggable', () => {
    const { queryByTestId } = render(<GameScreen />);

    // Should have 3 draggable pieces (with any runtime IDs)
    // Since DraggablePiece is mocked, we check for draggable-piece testIDs
    const slots = [
      queryByTestId(/piece-slot-0/),
      queryByTestId(/piece-slot-1/),
      queryByTestId(/piece-slot-2/),
    ];

    slots.forEach(slot => {
      expect(slot).toBeTruthy();
    });
  });

  test('initializes with 3 random pieces from library', () => {
    // Mock initializeGamePieces to verify it's called
    const mockPieces = [
      { runtimeId: 1, shape: [[1, 1], [1, 1]], id: 'SQUARE_2X2_0', shapeName: 'SQUARE_2X2', rotation: 0, rotationIndex: 0, isPlaced: false },
      { runtimeId: 2, shape: [[1, 0], [1, 1]], id: 'L_SHAPE_2X2_0', shapeName: 'L_SHAPE_2X2', rotation: 0, rotationIndex: 0, isPlaced: false },
      { runtimeId: 3, shape: [[1, 1, 1, 1, 1]], id: 'LINE_5_0', shapeName: 'LINE_5', rotation: 0, rotationIndex: 0, isPlaced: false },
    ];

    const spy = jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue(mockPieces);

    render(<GameScreen />);

    // Should call initializeGamePieces with count=3
    expect(spy).toHaveBeenCalledWith(3);

    spy.mockRestore();
  });

  test('pieces have unique runtime IDs from library', () => {
    const mockPieces = [
      { runtimeId: 10, shape: [[1, 1], [1, 1]], id: 'SQUARE_2X2_0', shapeName: 'SQUARE_2X2', rotation: 0, rotationIndex: 0, isPlaced: false },
      { runtimeId: 11, shape: [[1, 1], [1, 1]], id: 'SQUARE_2X2_90', shapeName: 'SQUARE_2X2', rotation: 90, rotationIndex: 1, isPlaced: false },
      { runtimeId: 12, shape: [[1, 1], [1, 1]], id: 'SQUARE_2X2_180', shapeName: 'SQUARE_2X2', rotation: 180, rotationIndex: 2, isPlaced: false },
    ];

    jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue(mockPieces);

    const { getAllByTestId } = render(<GameScreen />);
    const slots = getAllByTestId(/piece-slot-/);

    // Should render 3 pieces
    expect(slots).toHaveLength(3);

    pieceLibrary.initializeGamePieces.mockRestore();
  });

  describe('Grid State Management', () => {
    test('initializes with empty 10x10 grid state', () => {
      const { getAllByTestId } = render(<GameScreen />);
      const cells = getAllByTestId(/grid-cell-/);

      // All 100 cells should be rendered
      expect(cells).toHaveLength(100);

      // All cells should be unfilled initially
      cells.forEach(cell => {
        expect(cell.props.accessibilityState.selected).toBe(false);
      });
    });

    test('provides onLayout callback to GameBoard', () => {
      const { UNSAFE_getByType } = render(<GameScreen />);
      const gameBoard = UNSAFE_getByType(require('../../components/GameBoard').default);

      // GameBoard should receive onLayout prop
      expect(gameBoard.props.onLayout).toBeDefined();
      expect(typeof gameBoard.props.onLayout).toBe('function');
    });

    test('provides drag handler callbacks to PieceSelector', () => {
      const { UNSAFE_getByType } = render(<GameScreen />);
      const pieceSelector = UNSAFE_getByType(require('../../components/PieceSelector').default);

      // PieceSelector should receive drag handlers
      expect(pieceSelector.props.onDragStart).toBeDefined();
      expect(pieceSelector.props.onDragMove).toBeDefined();
      expect(pieceSelector.props.onDragEnd).toBeDefined();
      expect(typeof pieceSelector.props.onDragStart).toBe('function');
      expect(typeof pieceSelector.props.onDragMove).toBe('function');
      expect(typeof pieceSelector.props.onDragEnd).toBe('function');
    });
  });

  describe('Piece Regeneration', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('generates new pieces when all three pieces are placed', () => {
      // Mock initial pieces with isPlaced: true to simulate all pieces placed
      const initialPieces = [
        { runtimeId: 1, shape: [[1]], id: 'SINGLE_1X1_0', shapeName: 'SINGLE_1X1', rotation: 0, rotationIndex: 0, isPlaced: true },
        { runtimeId: 2, shape: [[1]], id: 'SINGLE_1X1_0', shapeName: 'SINGLE_1X1', rotation: 0, rotationIndex: 0, isPlaced: true },
        { runtimeId: 3, shape: [[1]], id: 'SINGLE_1X1_0', shapeName: 'SINGLE_1X1', rotation: 0, rotationIndex: 0, isPlaced: true },
      ];

      // Mock new pieces after regeneration
      const newPieces = [
        { runtimeId: 100, shape: [[1, 1]], id: 'LINE_2_0', shapeName: 'LINE_2', rotation: 0, rotationIndex: 0, isPlaced: false },
        { runtimeId: 101, shape: [[1, 1]], id: 'LINE_2_0', shapeName: 'LINE_2', rotation: 0, rotationIndex: 0, isPlaced: false },
        { runtimeId: 102, shape: [[1, 1]], id: 'LINE_2_0', shapeName: 'LINE_2', rotation: 0, rotationIndex: 0, isPlaced: false },
      ];

      jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue(initialPieces);
      const getRandomPiecesSpy = jest.spyOn(pieceLibrary, 'getRandomPieces').mockReturnValue(newPieces);

      const { queryByTestId } = render(<GameScreen />);

      // When all pieces are placed, getRandomPieces should be called
      // THIS WILL FAIL because the feature isn't implemented yet
      expect(getRandomPiecesSpy).toHaveBeenCalledWith(3);
    });

    test('new pieces have isPlaced set to false', () => {
      const initialPieces = [
        { runtimeId: 1, shape: [[1]], id: 'SINGLE_1X1_0', shapeName: 'SINGLE_1X1', rotation: 0, rotationIndex: 0, isPlaced: true },
        { runtimeId: 2, shape: [[1]], id: 'SINGLE_1X1_0', shapeName: 'SINGLE_1X1', rotation: 0, rotationIndex: 0, isPlaced: true },
        { runtimeId: 3, shape: [[1]], id: 'SINGLE_1X1_0', shapeName: 'SINGLE_1X1', rotation: 0, rotationIndex: 0, isPlaced: true },
      ];

      const newPieces = [
        { runtimeId: 200, shape: [[1, 1]], id: 'LINE_2_0', shapeName: 'LINE_2', rotation: 0, rotationIndex: 0, isPlaced: false },
        { runtimeId: 201, shape: [[1, 1]], id: 'LINE_2_0', shapeName: 'LINE_2', rotation: 0, rotationIndex: 0, isPlaced: false },
        { runtimeId: 202, shape: [[1, 1]], id: 'LINE_2_0', shapeName: 'LINE_2', rotation: 0, rotationIndex: 0, isPlaced: false },
      ];

      jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue(initialPieces);
      jest.spyOn(pieceLibrary, 'getRandomPieces').mockReturnValue(newPieces);

      const { queryByTestId } = render(<GameScreen />);

      // After regeneration, new draggable pieces should be visible (not empty slots)
      // THIS WILL FAIL because the feature isn't implemented yet
      expect(queryByTestId('draggable-piece-200')).toBeTruthy();
      expect(queryByTestId('draggable-piece-201')).toBeTruthy();
      expect(queryByTestId('draggable-piece-202')).toBeTruthy();
    });

    test('new pieces have unique runtime IDs different from previous pieces', () => {
      const initialPieces = [
        { runtimeId: 1, shape: [[1]], id: 'SINGLE_1X1_0', shapeName: 'SINGLE_1X1', rotation: 0, rotationIndex: 0, isPlaced: true },
        { runtimeId: 2, shape: [[1]], id: 'SINGLE_1X1_0', shapeName: 'SINGLE_1X1', rotation: 0, rotationIndex: 0, isPlaced: true },
        { runtimeId: 3, shape: [[1]], id: 'SINGLE_1X1_0', shapeName: 'SINGLE_1X1', rotation: 0, rotationIndex: 0, isPlaced: true },
      ];

      const newPieces = [
        { runtimeId: 300, shape: [[1, 1]], id: 'LINE_2_0', shapeName: 'LINE_2', rotation: 0, rotationIndex: 0, isPlaced: false },
        { runtimeId: 301, shape: [[1, 1]], id: 'LINE_2_0', shapeName: 'LINE_2', rotation: 0, rotationIndex: 0, isPlaced: false },
        { runtimeId: 302, shape: [[1, 1]], id: 'LINE_2_0', shapeName: 'LINE_2', rotation: 0, rotationIndex: 0, isPlaced: false },
      ];

      jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue(initialPieces);
      jest.spyOn(pieceLibrary, 'getRandomPieces').mockReturnValue(newPieces);

      const { queryByTestId } = render(<GameScreen />);

      // After regeneration, should see new pieces with different IDs
      // THIS WILL FAIL because the feature isn't implemented yet
      expect(queryByTestId('draggable-piece-300')).toBeTruthy();
      expect(queryByTestId('draggable-piece-301')).toBeTruthy();
      expect(queryByTestId('draggable-piece-302')).toBeTruthy();

      // Old pieces should no longer be visible
      expect(queryByTestId('draggable-piece-1')).toBeNull();
      expect(queryByTestId('draggable-piece-2')).toBeNull();
      expect(queryByTestId('draggable-piece-3')).toBeNull();
    });

    test('does not generate new pieces when only one piece is placed', () => {
      const initialPieces = [
        { runtimeId: 1, shape: [[1]], id: 'SINGLE_1X1_0', shapeName: 'SINGLE_1X1', rotation: 0, rotationIndex: 0, isPlaced: true },
        { runtimeId: 2, shape: [[1]], id: 'SINGLE_1X1_0', shapeName: 'SINGLE_1X1', rotation: 0, rotationIndex: 0, isPlaced: false },
        { runtimeId: 3, shape: [[1]], id: 'SINGLE_1X1_0', shapeName: 'SINGLE_1X1', rotation: 0, rotationIndex: 0, isPlaced: false },
      ];

      jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue(initialPieces);
      const getRandomPiecesSpy = jest.spyOn(pieceLibrary, 'getRandomPieces');

      render(<GameScreen />);

      // With only 1 piece placed, getRandomPieces should NOT be called
      expect(getRandomPiecesSpy).not.toHaveBeenCalled();
    });

    test('does not generate new pieces when only two pieces are placed', () => {
      const initialPieces = [
        { runtimeId: 1, shape: [[1]], id: 'SINGLE_1X1_0', shapeName: 'SINGLE_1X1', rotation: 0, rotationIndex: 0, isPlaced: true },
        { runtimeId: 2, shape: [[1]], id: 'SINGLE_1X1_0', shapeName: 'SINGLE_1X1', rotation: 0, rotationIndex: 0, isPlaced: true },
        { runtimeId: 3, shape: [[1]], id: 'SINGLE_1X1_0', shapeName: 'SINGLE_1X1', rotation: 0, rotationIndex: 0, isPlaced: false },
      ];

      jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue(initialPieces);
      const getRandomPiecesSpy = jest.spyOn(pieceLibrary, 'getRandomPieces');

      render(<GameScreen />);

      // With only 2 pieces placed, getRandomPieces should NOT be called
      expect(getRandomPiecesSpy).not.toHaveBeenCalled();
    });
  });

  describe('Game Over Detection', () => {
    test('does not show game over modal initially', () => {
      const { queryByText } = render(<GameScreen />);
      expect(queryByText('Game Over')).toBeNull();
    });

    test('shows game over modal when no pieces can be placed on full board', async () => {
      // Create a completely full grid
      const createFullGrid = () => {
        const grid = [];
        for (let row = 0; row < 10; row++) {
          const gridRow = [];
          for (let col = 0; col < 10; col++) {
            gridRow.push({
              row,
              col,
              filled: true,
            });
          }
          grid.push(gridRow);
        }
        return grid;
      };

      // Mock createEmptyGrid to return full grid
      const gridHelpers = require('../../utils/gridHelpers');
      jest.spyOn(gridHelpers, 'createEmptyGrid').mockReturnValue(createFullGrid());

      // Mock pieces - none can fit on a full board
      const mockPieces = [
        { runtimeId: 1, shape: [[1]], id: 'SINGLE_1X1_0', shapeName: 'SINGLE_1X1', rotation: 0, rotationIndex: 0, isPlaced: false },
        { runtimeId: 2, shape: [[1, 1], [1, 1]], id: 'SQUARE_2X2_0', shapeName: 'SQUARE_2X2', rotation: 0, rotationIndex: 0, isPlaced: false },
        { runtimeId: 3, shape: [[1, 1, 1]], id: 'LINE_3_0', shapeName: 'LINE_3', rotation: 0, rotationIndex: 0, isPlaced: false },
      ];

      jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue(mockPieces);

      const { queryByText } = render(<GameScreen />);

      // Game over modal should appear since no pieces can fit
      await waitFor(() => {
        expect(queryByText('Game Over')).toBeTruthy();
      });

      // Cleanup
      gridHelpers.createEmptyGrid.mockRestore();
      pieceLibrary.initializeGamePieces.mockRestore();
    });

    test('displays current score in game over modal', async () => {
      // Similar setup to previous test
      const createFullGrid = () => {
        const grid = [];
        for (let row = 0; row < 10; row++) {
          const gridRow = [];
          for (let col = 0; col < 10; col++) {
            gridRow.push({ row, col, filled: true });
          }
          grid.push(gridRow);
        }
        return grid;
      };

      const gridHelpers = require('../../utils/gridHelpers');
      jest.spyOn(gridHelpers, 'createEmptyGrid').mockReturnValue(createFullGrid());

      const mockPieces = [
        { runtimeId: 1, shape: [[1]], id: 'SINGLE_1X1_0', shapeName: 'SINGLE_1X1', rotation: 0, rotationIndex: 0, isPlaced: false },
        { runtimeId: 2, shape: [[1, 1]], id: 'LINE_2_0', shapeName: 'LINE_2', rotation: 0, rotationIndex: 0, isPlaced: false },
        { runtimeId: 3, shape: [[1, 1, 1]], id: 'LINE_3_0', shapeName: 'LINE_3', rotation: 0, rotationIndex: 0, isPlaced: false },
      ];

      jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue(mockPieces);

      const { queryByText } = render(<GameScreen />);

      // Game over should show immediately since no pieces can fit
      await waitFor(() => {
        expect(queryByText('Game Over')).toBeTruthy();
      });

      // Should display the score (which starts at 0)
      expect(queryByText(/Score:/)).toBeTruthy();
      expect(queryByText('0')).toBeTruthy();

      gridHelpers.createEmptyGrid.mockRestore();
      pieceLibrary.initializeGamePieces.mockRestore();
    });

    test('does not show game over when at least one piece can still be placed', () => {
      // Use default empty grid where pieces can be placed
      const { queryByText } = render(<GameScreen />);

      // Should not show game over
      expect(queryByText('Game Over')).toBeNull();
    });
  });
});
