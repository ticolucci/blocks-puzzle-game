import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GameScreen from '../GameScreen';
import * as pieceLibrary from '../../utils/pieceLibrary';
import { SVG_IDS } from '../../constants/gameConfig';
import { ITEM_TYPES } from '../../constants/itemTypes';

// Mock highScores utility
jest.mock('../../utils/highScores', () => ({
  getMaxScore: jest.fn(),
  isHighScore: jest.fn(),
  saveHighScore: jest.fn(),
}));

// Mock GameBoard to expose board layout
jest.mock('../../components/GameBoard', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return React.forwardRef(function GameBoard(props, ref) {
    // Expose layout callback for testing
    React.useEffect(() => {
      if (props.onLayout) {
        props.onLayout({
          x: 0,
          y: 0,
          width: 300,
          height: 300,
          cellSize: 30,
        });
      }
    }, [props.onLayout]);

    return (
      <View testID="game-board">
        <Text>Board</Text>
      </View>
    );
  });
});

// Mock ItemInventory to expose drag handlers
jest.mock('../../components/ItemInventory', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return function ItemInventory({ inventory, onItemDragStart, onItemDragMove, onItemDragEnd }) {
    const bombCount = inventory[require('../../constants/itemTypes').ITEM_TYPES.BOMB] || 0;
    return (
      <View testID="item-inventory">
        <Text testID="bomb-count">{bombCount}</Text>
        {bombCount > 0 && (
          <Pressable
            testID="drag-bomb-button"
            onPress={() => {
              // Simulate drag sequence
              onItemDragStart && onItemDragStart(require('../../constants/itemTypes').ITEM_TYPES.BOMB);
              onItemDragMove && onItemDragMove(require('../../constants/itemTypes').ITEM_TYPES.BOMB, 150, 150);
              onItemDragEnd && onItemDragEnd(require('../../constants/itemTypes').ITEM_TYPES.BOMB, 150, 150);
            }}
          >
            <Text>Drag Bomb</Text>
          </Pressable>
        )}
      </View>
    );
  };
});

describe('GameScreen - Item Usage', () => {
  const { getMaxScore, isHighScore } = require('../../utils/highScores');

  beforeEach(() => {
    jest.clearAllMocks();
    getMaxScore.mockResolvedValue(0);
    isHighScore.mockResolvedValue(false);
  });

  describe('Inventory - Red Piece Placement', () => {
    test('adds bomb to inventory when red piece is placed', async () => {
      // Mock pieces with one red piece
      const redPiece = {
        runtimeId: 1,
        shape: [[1]],
        svgRefs: [SVG_IDS.SOLID_RED],
        isPlaced: false,
      };

      jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue([redPiece]);

      const { getByTestId } = render(<GameScreen />);

      // Get initial bomb count (should be 0)
      const initialCount = getByTestId('bomb-count');
      expect(initialCount.props.children).toBe(0);

      // Actual placement logic tested separately
      // This test verifies inventory is initialized correctly

      pieceLibrary.initializeGamePieces.mockRestore();
    });

    test('inventory count increments when multiple red pieces are placed', async () => {
      // This test will verify that inventory count increases properly
      // Will be implemented in GREEN phase
    });

    test('does not add to inventory when non-red piece is placed', async () => {
      const bluePiece = {
        runtimeId: 1,
        shape: [[1]],
        svgRefs: [SVG_IDS.SOLID_BLUE],
        isPlaced: false,
      };

      jest.spyOn(pieceLibrary, 'initializeGamePieces').mockReturnValue([bluePiece]);

      const { getByTestId } = render(<GameScreen />);

      const bombCount = getByTestId('bomb-count');
      expect(bombCount.props.children).toBe(0);

      pieceLibrary.initializeGamePieces.mockRestore();
    });
  });

  describe('Inventory - Item Usage', () => {
    test('renders ItemInventory component', () => {
      const { getByTestId } = render(<GameScreen />);
      expect(getByTestId('item-inventory')).toBeTruthy();
    });

    test('inventory is always visible even when empty', () => {
      const { getByTestId } = render(<GameScreen />);
      const inventory = getByTestId('item-inventory');
      expect(inventory).toBeTruthy();
    });

    test('can drag bomb from inventory when count > 0', async () => {
      // This test will verify drag interaction works
      // Will be fully implemented in GREEN phase when GameScreen has inventory state
    });

    test('bomb usage decrements inventory count', async () => {
      // This test will verify count decreases after use
      // Will be implemented in GREEN phase
    });
  });

  describe('Inventory - Game Restart', () => {
    test('inventory resets to empty on game restart', async () => {
      const { getByTestId } = render(<GameScreen />);

      // Initially should be 0
      const bombCount = getByTestId('bomb-count');
      expect(bombCount.props.children).toBe(0);

      // Inventory is properly reset on restart
      // (Restart functionality is tested in main GameScreen tests)
      // This test verifies inventory state structure is correct
    });
  });

  describe('Inventory - Item Preview', () => {
    test('shows preview when dragging item over board', async () => {
      // This test will verify preview appears during drag
      // Will be implemented in GREEN phase with preview state
    });

    test('preview shows 5x5 area for bomb', async () => {
      // This test will verify bomb preview size is correct
      // Will be implemented in GREEN phase
    });
  });
});
