import React from 'react';
import { render } from '@testing-library/react-native';
import ItemInventory from '../ItemInventory';
import { ITEM_TYPES } from '../../constants/itemTypes';

describe('ItemInventory', () => {
  const mockHandlers = {
    onItemDragStart: jest.fn(),
    onItemDragMove: jest.fn(),
    onItemDragEnd: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    test('renders Items label', () => {
      const inventory = { [ITEM_TYPES.BOMB]: 0 };
      const { getByText } = render(
        <ItemInventory
          inventory={inventory}
          onItemDragStart={mockHandlers.onItemDragStart}
          onItemDragMove={mockHandlers.onItemDragMove}
          onItemDragEnd={mockHandlers.onItemDragEnd}
        />
      );

      expect(getByText('Items')).toBeTruthy();
    });

    test('renders with empty inventory', () => {
      const inventory = {};
      const { getByText } = render(
        <ItemInventory
          inventory={inventory}
          onItemDragStart={mockHandlers.onItemDragStart}
          onItemDragMove={mockHandlers.onItemDragMove}
          onItemDragEnd={mockHandlers.onItemDragEnd}
        />
      );

      // Should still render the "Items" label
      expect(getByText('Items')).toBeTruthy();
    });

    test('always renders even when all items are 0', () => {
      const inventory = { [ITEM_TYPES.BOMB]: 0 };
      const { getByText, getByTestId } = render(
        <ItemInventory
          inventory={inventory}
          onItemDragStart={mockHandlers.onItemDragStart}
          onItemDragMove={mockHandlers.onItemDragMove}
          onItemDragEnd={mockHandlers.onItemDragEnd}
        />
      );

      expect(getByText('Items')).toBeTruthy();
      expect(getByTestId('inventory-container')).toBeTruthy();
    });

    test('renders ItemSlot for each item type', () => {
      const inventory = { [ITEM_TYPES.BOMB]: 3 };
      const { getByText } = render(
        <ItemInventory
          inventory={inventory}
          onItemDragStart={mockHandlers.onItemDragStart}
          onItemDragMove={mockHandlers.onItemDragMove}
          onItemDragEnd={mockHandlers.onItemDragEnd}
        />
      );

      // Should render bomb icon
      expect(getByText('💣')).toBeTruthy();
      // Should render count
      expect(getByText('3')).toBeTruthy();
    });

    test('renders ItemSlot with count 0', () => {
      const inventory = { [ITEM_TYPES.BOMB]: 0 };
      const { getByText, queryByTestId } = render(
        <ItemInventory
          inventory={inventory}
          onItemDragStart={mockHandlers.onItemDragStart}
          onItemDragMove={mockHandlers.onItemDragMove}
          onItemDragEnd={mockHandlers.onItemDragEnd}
        />
      );

      // Should render bomb icon even with 0 count
      expect(getByText('💣')).toBeTruthy();
      // Should not render count badge
      expect(queryByTestId('item-count-badge')).toBeNull();
    });
  });

  describe('layout', () => {
    test('uses vertical column layout', () => {
      const inventory = { [ITEM_TYPES.BOMB]: 1 };
      const { getByTestId } = render(
        <ItemInventory
          inventory={inventory}
          onItemDragStart={mockHandlers.onItemDragStart}
          onItemDragMove={mockHandlers.onItemDragMove}
          onItemDragEnd={mockHandlers.onItemDragEnd}
        />
      );

      const container = getByTestId('inventory-container');
      expect(container.props.style).toEqual(
        expect.objectContaining({
          flexDirection: 'column',
        })
      );
    });

    test('has fixed width from config', () => {
      const inventory = { [ITEM_TYPES.BOMB]: 1 };
      const { getByTestId } = render(
        <ItemInventory
          inventory={inventory}
          onItemDragStart={mockHandlers.onItemDragStart}
          onItemDragMove={mockHandlers.onItemDragMove}
          onItemDragEnd={mockHandlers.onItemDragEnd}
        />
      );

      const container = getByTestId('inventory-container');
      expect(container.props.style).toEqual(
        expect.objectContaining({
          width: 80, // GAME_CONFIG.INVENTORY_WIDTH
        })
      );
    });
  });

  describe('drag handler propagation', () => {
    test('renders ItemSlot components with drag handlers', () => {
      const inventory = { [ITEM_TYPES.BOMB]: 1 };
      const { getByTestId } = render(
        <ItemInventory
          inventory={inventory}
          onItemDragStart={mockHandlers.onItemDragStart}
          onItemDragMove={mockHandlers.onItemDragMove}
          onItemDragEnd={mockHandlers.onItemDragEnd}
        />
      );

      const itemSlot = getByTestId('item-slot');
      // Verify that PanResponder handlers exist (ItemSlot should have them)
      expect(itemSlot.props.onResponderGrant).toBeDefined();
    });
  });
});
