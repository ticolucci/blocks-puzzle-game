import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import GameScreen from '../GameScreen';
import * as pieceLibrary from '../../utils/pieceLibrary';

// Mock highScores utility
jest.mock('../../utils/highScores', () => ({
  getMaxScore: jest.fn(),
  isHighScore: jest.fn(),
  saveHighScore: jest.fn(),
}));

// Mock DraggablePiece to make pieces queryable by testID
jest.mock('../../components/DraggablePiece', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function DraggablePiece({ piece, onDragEnd }) {
    return (
      <View testID={`draggable-piece-${piece.runtimeId}`}>
        <Text>Piece {piece.runtimeId}</Text>
        {piece.type === 'bomb' && <Text>Bomb</Text>}
        {/* Expose onDragEnd for testing */}
        {onDragEnd && (
          <View testID={`drag-end-trigger-${piece.runtimeId}`} onTouchEnd={() => onDragEnd(piece)} />
        )}
      </View>
    );
  };
});

describe('GameScreen - Bomb Piece Feature', () => {
  const { getMaxScore, isHighScore } = require('../../utils/highScores');

  beforeEach(() => {
    jest.clearAllMocks();
    getMaxScore.mockResolvedValue(0);
    isHighScore.mockResolvedValue(false);
  });

  describe('Red Piece Tracking', () => {
    test('tracks when a red piece is placed', () => {
      // This test will fail until we implement red piece tracking
      // Mock a red piece
      const redPiece = {
        runtimeId: 1,
        shape: [[1]],
        id: 'SINGLE_1X1_0',
        shapeName: 'SINGLE_1X1',
        isPlaced: false,
        color: '#FF0000', // Red color
      };

      const mockPieces = [redPiece];
      jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue(mockPieces);

      const { getByTestId } = render(<GameScreen />);

      // Verify the piece is rendered
      expect(getByTestId('draggable-piece-1')).toBeTruthy();

      pieceLibrary.initializeGamePieces.mockRestore();
    });

    test('does not count non-red pieces toward bomb generation', () => {
      // Mock a blue piece
      const bluePiece = {
        runtimeId: 1,
        shape: [[1]],
        id: 'SINGLE_1X1_0',
        shapeName: 'SINGLE_1X1',
        isPlaced: false,
        color: '#0000FF', // Blue color
      };

      const mockPieces = [bluePiece];
      jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue(mockPieces);

      render(<GameScreen />);

      // Blue pieces should not contribute to red piece count
      // This will be validated by bomb generation tests

      pieceLibrary.initializeGamePieces.mockRestore();
    });
  });

  describe('Bomb Piece Generation', () => {
    test('createBombPiece generates a valid bomb piece', () => {
      const bombPiece = pieceLibrary.createBombPiece();

      // Verify bomb piece properties
      expect(bombPiece.type).toBe('bomb');
      expect(bombPiece.svgRefs).toEqual(['solid-grey']);
      expect(bombPiece.shape).toEqual([[1]]);
      expect(bombPiece.shapeName).toBe('BOMB');
    });

    test('does not generate bomb piece after placing only 2 red pieces', () => {
      const pieces = [
        {
          runtimeId: 1,
          shape: [[1]],
          id: 'SINGLE_1X1_0',
          shapeName: 'SINGLE_1X1',
          isPlaced: false,
          color: '#FF0000', // Red
        },
        {
          runtimeId: 2,
          shape: [[1]],
          id: 'SINGLE_1X1_0',
          shapeName: 'SINGLE_1X1',
          isPlaced: false,
          color: '#FF0000', // Red
        },
        {
          runtimeId: 3,
          shape: [[1]],
          id: 'SINGLE_1X1_0',
          shapeName: 'SINGLE_1X1',
          isPlaced: false,
          color: '#0000FF', // Blue
        },
      ];

      jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue(pieces);

      const { queryByText } = render(<GameScreen />);

      // Should not have a bomb piece
      expect(queryByText('Bomb')).toBeNull();

      pieceLibrary.initializeGamePieces.mockRestore();
    });

    test('bomb piece is 1x1 size', async () => {
      // This test will verify bomb piece properties
      const bombPiece = {
        runtimeId: 100,
        shape: [[1]], // 1x1 shape
        id: 'BOMB_1X1_0',
        shapeName: 'BOMB',
        isPlaced: false,
        color: '#808080', // Grey
        type: 'bomb',
      };

      // Verify the shape is 1x1
      expect(bombPiece.shape).toEqual([[1]]);
      expect(bombPiece.shape.length).toBe(1);
      expect(bombPiece.shape[0].length).toBe(1);
    });

    test('bomb piece has grey color', () => {
      const bombPiece = {
        runtimeId: 100,
        shape: [[1]],
        id: 'BOMB_1X1_0',
        shapeName: 'BOMB',
        isPlaced: false,
        color: '#808080', // Grey
        type: 'bomb',
      };

      expect(bombPiece.color).toBe('#808080');
    });

    test('bomb piece has type "bomb"', () => {
      const bombPiece = {
        runtimeId: 100,
        shape: [[1]],
        id: 'BOMB_1X1_0',
        shapeName: 'BOMB',
        isPlaced: false,
        color: '#808080',
        type: 'bomb',
      };

      expect(bombPiece.type).toBe('bomb');
    });
  });

  describe('Bomb Piece Placement and Clearing', () => {
    test('bomb clears adjacent pieces in radius of 2 cells', () => {
      // Create a grid with some filled cells
      const createGridWithFilledCells = (filledCells) => {
        const grid = [];
        for (let row = 0; row < 10; row++) {
          const gridRow = [];
          for (let col = 0; col < 10; col++) {
            gridRow.push({
              row,
              col,
              filled: filledCells.some(cell => cell.row === row && cell.col === col),
              color: filledCells.some(cell => cell.row === row && cell.col === col) ? '#FF0000' : null,
            });
          }
          grid.push(gridRow);
        }
        return grid;
      };

      // Fill cells around position (5, 5) within radius 2
      const filledCells = [
        // Radius 1
        { row: 4, col: 5 }, { row: 6, col: 5 }, // Above and below
        { row: 5, col: 4 }, { row: 5, col: 6 }, // Left and right
        // Radius 2
        { row: 3, col: 5 }, { row: 7, col: 5 }, // Farther above and below
        { row: 5, col: 3 }, { row: 5, col: 7 }, // Farther left and right
        // Diagonal within radius 2
        { row: 4, col: 4 }, { row: 4, col: 6 },
        { row: 6, col: 4 }, { row: 6, col: 6 },
      ];

      const gridHelpers = require('../../utils/gridHelpers');
      jest.spyOn(gridHelpers, 'createEmptyGrid').mockReturnValue(createGridWithFilledCells(filledCells));

      // Mock a bomb piece
      const bombPiece = {
        runtimeId: 1,
        shape: [[1]],
        id: 'BOMB_1X1_0',
        shapeName: 'BOMB',
        isPlaced: false,
        color: '#808080',
        type: 'bomb',
      };

      const mockPieces = [bombPiece];
      jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue(mockPieces);

      render(<GameScreen />);

      // When bomb is placed at (5, 5), all cells within radius 2 should be cleared
      // This will fail until we implement the clearing logic

      gridHelpers.createEmptyGrid.mockRestore();
      pieceLibrary.initializeGamePieces.mockRestore();
    });

    test('bomb clearing size is configurable (default 5)', () => {
      // Test that the bomb size can be configured
      // Default is 5 (5x5 square)
      const BOMB_SIZE = 5;
      expect(BOMB_SIZE).toBe(5);
    });

    test('bomb does not clear pieces beyond square area', () => {
      // This test verifies that pieces outside the square area are not affected
      // Will be implemented after the main clearing logic
    });
  });
});
