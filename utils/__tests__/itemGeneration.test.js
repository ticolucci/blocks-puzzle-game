import {
  isRedPiece,
  addItemToInventory,
  removeItemFromInventory,
  hasItem,
} from '../itemGeneration';
import { SVG_IDS } from '../../constants/gameConfig';
import { ITEM_TYPES } from '../../constants/itemTypes';

describe('itemGeneration', () => {
  describe('isRedPiece', () => {
    test('returns true when piece has red SVG ref', () => {
      const redPiece = {
        shape: [[1]],
        svgRefs: [SVG_IDS.SOLID_RED],
      };
      expect(isRedPiece(redPiece)).toBe(true);
    });

    test('returns true when piece has multiple SVG refs including red', () => {
      const multiColorPiece = {
        shape: [[1, 1]],
        svgRefs: [SVG_IDS.SOLID_BLUE, SVG_IDS.SOLID_RED],
      };
      expect(isRedPiece(multiColorPiece)).toBe(true);
    });

    test('returns false when piece has no red SVG ref', () => {
      const bluePiece = {
        shape: [[1]],
        svgRefs: [SVG_IDS.SOLID_BLUE],
      };
      expect(isRedPiece(bluePiece)).toBe(false);
    });

    test('returns false when piece has no svgRefs', () => {
      const pieceWithoutRefs = {
        shape: [[1]],
      };
      expect(isRedPiece(pieceWithoutRefs)).toBe(false);
    });

    test('returns false when piece has empty svgRefs array', () => {
      const pieceWithEmptyRefs = {
        shape: [[1]],
        svgRefs: [],
      };
      expect(isRedPiece(pieceWithEmptyRefs)).toBe(false);
    });
  });

  describe('addItemToInventory', () => {
    test('adds new item to empty inventory', () => {
      const inventory = {};
      const result = addItemToInventory(inventory, ITEM_TYPES.BOMB, 1);
      expect(result).toEqual({ [ITEM_TYPES.BOMB]: 1 });
    });

    test('increments existing item count', () => {
      const inventory = { [ITEM_TYPES.BOMB]: 2 };
      const result = addItemToInventory(inventory, ITEM_TYPES.BOMB, 1);
      expect(result).toEqual({ [ITEM_TYPES.BOMB]: 3 });
    });

    test('adds multiple items at once', () => {
      const inventory = { [ITEM_TYPES.BOMB]: 1 };
      const result = addItemToInventory(inventory, ITEM_TYPES.BOMB, 3);
      expect(result).toEqual({ [ITEM_TYPES.BOMB]: 4 });
    });

    test('does not mutate original inventory', () => {
      const inventory = { [ITEM_TYPES.BOMB]: 1 };
      const result = addItemToInventory(inventory, ITEM_TYPES.BOMB, 1);
      expect(inventory).toEqual({ [ITEM_TYPES.BOMB]: 1 });
      expect(result).not.toBe(inventory);
    });
  });

  describe('removeItemFromInventory', () => {
    test('decrements item count', () => {
      const inventory = { [ITEM_TYPES.BOMB]: 2 };
      const result = removeItemFromInventory(inventory, ITEM_TYPES.BOMB);
      expect(result).toEqual({ [ITEM_TYPES.BOMB]: 1 });
    });

    test('removes item completely when count reaches 0', () => {
      const inventory = { [ITEM_TYPES.BOMB]: 1 };
      const result = removeItemFromInventory(inventory, ITEM_TYPES.BOMB);
      expect(result).toEqual({ [ITEM_TYPES.BOMB]: 0 });
    });

    test('returns null when trying to remove non-existent item', () => {
      const inventory = {};
      const result = removeItemFromInventory(inventory, ITEM_TYPES.BOMB);
      expect(result).toBeNull();
    });

    test('returns null when trying to remove item with count 0', () => {
      const inventory = { [ITEM_TYPES.BOMB]: 0 };
      const result = removeItemFromInventory(inventory, ITEM_TYPES.BOMB);
      expect(result).toBeNull();
    });

    test('does not mutate original inventory', () => {
      const inventory = { [ITEM_TYPES.BOMB]: 2 };
      const result = removeItemFromInventory(inventory, ITEM_TYPES.BOMB);
      expect(inventory).toEqual({ [ITEM_TYPES.BOMB]: 2 });
      expect(result).not.toBe(inventory);
    });
  });

  describe('hasItem', () => {
    test('returns true when item exists with count > 0', () => {
      const inventory = { [ITEM_TYPES.BOMB]: 1 };
      expect(hasItem(inventory, ITEM_TYPES.BOMB)).toBe(true);
    });

    test('returns false when item count is 0', () => {
      const inventory = { [ITEM_TYPES.BOMB]: 0 };
      expect(hasItem(inventory, ITEM_TYPES.BOMB)).toBe(false);
    });

    test('returns false when item does not exist', () => {
      const inventory = {};
      expect(hasItem(inventory, ITEM_TYPES.BOMB)).toBe(false);
    });

    test('returns true when item has multiple count', () => {
      const inventory = { [ITEM_TYPES.BOMB]: 5 };
      expect(hasItem(inventory, ITEM_TYPES.BOMB)).toBe(true);
    });
  });
});
