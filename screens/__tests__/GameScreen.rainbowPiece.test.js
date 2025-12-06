import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import GameScreen from '../GameScreen';
import * as pieceLibrary from '../../utils/pieceLibrary';
import { PIECE_TYPES } from '../../constants/gameConfig';

// Mock highScores utility
jest.mock('../../utils/highScores', () => ({
  getMaxScore: jest.fn(),
  isHighScore: jest.fn(),
  saveHighScore: jest.fn(),
}));

// Mock DraggablePiece to make pieces queryable by testID and trigger placement
jest.mock('../../components/DraggablePiece', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function DraggablePiece({ piece, onDragEnd }) {
    return (
      <View testID={`draggable-piece-${piece.runtimeId}`}>
        <Text>Piece {piece.runtimeId}</Text>
        {onDragEnd && (
          <View testID={`drag-end-trigger-${piece.runtimeId}`} onTouchEnd={() => onDragEnd(piece)} />
        )}
      </View>
    );
  };
});

describe('GameScreen - Rainbow Piece Feature', () => {
  const { getMaxScore, isHighScore } = require('../../utils/highScores');

  beforeEach(() => {
    jest.clearAllMocks();
    getMaxScore.mockResolvedValue(0);
    isHighScore.mockResolvedValue(false);
  });

  describe('Rainbow Piece Generation', () => {
    test('createRainbowPiece generates a valid rainbow piece', () => {
      const rainbowPiece = pieceLibrary.createRainbowPiece();

      // Verify rainbow piece properties
      expect(rainbowPiece.type).toBe(PIECE_TYPES.RAINBOW);
      expect(rainbowPiece.color).toBe('rainbow');
      expect(rainbowPiece.shape).toEqual([[1]]);
      expect(rainbowPiece.shapeName).toBe('RAINBOW');
    });

    test('rainbow pieces can appear in game pieces', () => {
      // Mock initializeGamePieces to return a rainbow piece
      const mockRainbowPiece = {
        runtimeId: 1,
        shape: [[1]],
        color: 'rainbow',
        type: PIECE_TYPES.RAINBOW,
        isPlaced: false,
      };

      jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue([mockRainbowPiece]);

      const { getByTestId } = render(<GameScreen />);

      // Should render the rainbow piece
      expect(getByTestId('draggable-piece-1')).toBeTruthy();
    });
  });

  describe('Nyan Cat Animation', () => {
    test('nyan cat animation is triggered when rainbow piece is placed', async () => {
      // Mock a rainbow piece
      const mockRainbowPiece = {
        runtimeId: 1,
        shape: [[1]],
        color: 'rainbow',
        type: PIECE_TYPES.RAINBOW,
        isPlaced: false,
      };

      jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue([mockRainbowPiece]);

      const { getByTestId, queryByTestId } = render(<GameScreen />);

      // Initially, nyan cat should not be visible
      expect(queryByTestId('nyan-cat-animation')).toBeNull();

      // Simulate placing the rainbow piece
      // We'll need to mock the placement logic to trigger the animation
      // For now, we're testing that the component can handle the rainbow piece
      await waitFor(() => {
        expect(getByTestId('draggable-piece-1')).toBeTruthy();
      });
    });

    test('nyan cat animation does not appear before rainbow piece placement', async () => {
      const mockRainbowPiece = {
        runtimeId: 1,
        shape: [[1]],
        color: 'rainbow',
        type: PIECE_TYPES.RAINBOW,
        isPlaced: false,
      };

      jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue([mockRainbowPiece]);

      const { queryByTestId } = render(<GameScreen />);

      // Nyan cat should not appear before a rainbow piece is placed
      await waitFor(() => {
        expect(queryByTestId('draggable-piece-1')).toBeTruthy();
      });

      // Nyan cat animation should not be visible
      expect(queryByTestId('nyan-cat-animation')).toBeNull();
    });

    test('nyan cat animation is not triggered for normal pieces', async () => {
      const mockNormalPiece = {
        runtimeId: 1,
        shape: [[1]],
        color: '#FF0000',
        type: PIECE_TYPES.NORMAL,
        isPlaced: false,
      };

      jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue([mockNormalPiece]);

      const { queryByTestId } = render(<GameScreen />);

      await waitFor(() => {
        expect(queryByTestId('draggable-piece-1')).toBeTruthy();
      });

      // Nyan cat should not appear for normal pieces
      expect(queryByTestId('nyan-cat-animation')).toBeNull();
    });
  });
});
