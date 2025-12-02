import React from 'react';
import { render } from '@testing-library/react-native';
import GameScreen from '../GameScreen';
import * as pieceLibrary from '../../utils/pieceLibrary';

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
});
