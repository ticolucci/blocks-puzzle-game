import React from 'react';
import { render } from '@testing-library/react-native';
import ItemSlot from '../ItemSlot';
import { ITEM_TYPES } from '../../constants/itemTypes';

describe('ItemSlot', () => {
  const mockHandlers = {
    onDragStart: jest.fn(),
    onDragMove: jest.fn(),
    onDragEnd: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    test('renders item icon', () => {
      const { getByText } = render(
        <ItemSlot
          itemType={ITEM_TYPES.BOMB}
          count={1}
          onDragStart={mockHandlers.onDragStart}
          onDragMove={mockHandlers.onDragMove}
          onDragEnd={mockHandlers.onDragEnd}
        />
      );

      expect(getByText('💣')).toBeTruthy();
    });

    test('renders with count badge when count > 0', () => {
      const { getByText } = render(
        <ItemSlot
          itemType={ITEM_TYPES.BOMB}
          count={3}
          onDragStart={mockHandlers.onDragStart}
          onDragMove={mockHandlers.onDragMove}
          onDragEnd={mockHandlers.onDragEnd}
        />
      );

      expect(getByText('3')).toBeTruthy();
    });

    test('does not render count badge when count is 0', () => {
      const { queryByTestId } = render(
        <ItemSlot
          itemType={ITEM_TYPES.BOMB}
          count={0}
          onDragStart={mockHandlers.onDragStart}
          onDragMove={mockHandlers.onDragMove}
          onDragEnd={mockHandlers.onDragEnd}
        />
      );

      expect(queryByTestId('item-count-badge')).toBeNull();
    });

    test('renders with single digit count', () => {
      const { getByText } = render(
        <ItemSlot
          itemType={ITEM_TYPES.BOMB}
          count={1}
          onDragStart={mockHandlers.onDragStart}
          onDragMove={mockHandlers.onDragMove}
          onDragEnd={mockHandlers.onDragEnd}
        />
      );

      expect(getByText('1')).toBeTruthy();
    });

    test('renders with multi-digit count', () => {
      const { getByText } = render(
        <ItemSlot
          itemType={ITEM_TYPES.BOMB}
          count={15}
          onDragStart={mockHandlers.onDragStart}
          onDragMove={mockHandlers.onDragMove}
          onDragEnd={mockHandlers.onDragEnd}
        />
      );

      expect(getByText('15')).toBeTruthy();
    });
  });

  describe('disabled state', () => {
    test('shows disabled styling when count is 0', () => {
      const { getByTestId } = render(
        <ItemSlot
          itemType={ITEM_TYPES.BOMB}
          count={0}
          onDragStart={mockHandlers.onDragStart}
          onDragMove={mockHandlers.onDragMove}
          onDragEnd={mockHandlers.onDragEnd}
        />
      );

      const itemSlot = getByTestId('item-slot');
      expect(itemSlot.props.style).toEqual(
        expect.objectContaining({
          opacity: 0.4,
        })
      );
    });

    test('shows active styling when count > 0', () => {
      const { getByTestId } = render(
        <ItemSlot
          itemType={ITEM_TYPES.BOMB}
          count={1}
          onDragStart={mockHandlers.onDragStart}
          onDragMove={mockHandlers.onDragMove}
          onDragEnd={mockHandlers.onDragEnd}
        />
      );

      const itemSlot = getByTestId('item-slot');
      expect(itemSlot.props.style).toEqual(
        expect.objectContaining({
          opacity: 1,
        })
      );
    });
  });

  describe('drag interaction', () => {
    test('has pan handlers attached for drag functionality when count > 0', () => {
      const { getByTestId } = render(
        <ItemSlot
          itemType={ITEM_TYPES.BOMB}
          count={1}
          onDragStart={mockHandlers.onDragStart}
          onDragMove={mockHandlers.onDragMove}
          onDragEnd={mockHandlers.onDragEnd}
        />
      );

      const itemSlot = getByTestId('item-slot');

      // Verify PanResponder handlers are set up
      expect(itemSlot.props.onResponderGrant).toBeDefined();
      expect(itemSlot.props.onResponderMove).toBeDefined();
      expect(itemSlot.props.onResponderRelease).toBeDefined();
    });

    test('does not allow drag when count is 0', () => {
      const { getByTestId } = render(
        <ItemSlot
          itemType={ITEM_TYPES.BOMB}
          count={0}
          onDragStart={mockHandlers.onDragStart}
          onDragMove={mockHandlers.onDragMove}
          onDragEnd={mockHandlers.onDragEnd}
        />
      );

      const itemSlot = getByTestId('item-slot');

      // Verify PanResponder is disabled when count is 0
      // onStartShouldSetResponder should return false
      const shouldRespond = itemSlot.props.onStartShouldSetResponder();
      expect(shouldRespond).toBe(false);
    });
  });

  describe('accessibility', () => {
    test('has accessible label with item name and count', () => {
      const { getByTestId } = render(
        <ItemSlot
          itemType={ITEM_TYPES.BOMB}
          count={3}
          onDragStart={mockHandlers.onDragStart}
          onDragMove={mockHandlers.onDragMove}
          onDragEnd={mockHandlers.onDragEnd}
        />
      );

      const itemSlot = getByTestId('item-slot');
      expect(itemSlot.props.accessibilityLabel).toBe('Bomb, 3 available');
    });

    test('has accessible role of button', () => {
      const { getByTestId } = render(
        <ItemSlot
          itemType={ITEM_TYPES.BOMB}
          count={1}
          onDragStart={mockHandlers.onDragStart}
          onDragMove={mockHandlers.onDragMove}
          onDragEnd={mockHandlers.onDragEnd}
        />
      );

      const itemSlot = getByTestId('item-slot');
      expect(itemSlot.props.accessibilityRole).toBe('button');
    });

    test('has disabled accessibility state when count is 0', () => {
      const { getByTestId } = render(
        <ItemSlot
          itemType={ITEM_TYPES.BOMB}
          count={0}
          onDragStart={mockHandlers.onDragStart}
          onDragMove={mockHandlers.onDragMove}
          onDragEnd={mockHandlers.onDragEnd}
        />
      );

      const itemSlot = getByTestId('item-slot');
      expect(itemSlot.props.accessibilityState).toEqual({ disabled: true });
    });

    test('does not have disabled accessibility state when count > 0', () => {
      const { getByTestId } = render(
        <ItemSlot
          itemType={ITEM_TYPES.BOMB}
          count={1}
          onDragStart={mockHandlers.onDragStart}
          onDragMove={mockHandlers.onDragMove}
          onDragEnd={mockHandlers.onDragEnd}
        />
      );

      const itemSlot = getByTestId('item-slot');
      expect(itemSlot.props.accessibilityState).toEqual({ disabled: false });
    });
  });
});
