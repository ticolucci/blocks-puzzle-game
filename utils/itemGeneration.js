import { SVG_IDS } from '../constants/gameConfig';

/**
 * Check if a piece has red SVG references
 * @param {Object} piece - The piece to check
 * @returns {boolean} True if piece contains red SVG ref
 */
export function isRedPiece(piece) {
  if (!piece.svgRefs || !Array.isArray(piece.svgRefs)) {
    return false;
  }
  return piece.svgRefs.some(ref => ref === SVG_IDS.SOLID_RED);
}

/**
 * Add items to inventory (pure function)
 * @param {Object} inventory - Current inventory state
 * @param {string} itemType - Type of item to add
 * @param {number} count - Number of items to add
 * @returns {Object} New inventory object with updated count
 */
export function addItemToInventory(inventory, itemType, count) {
  const currentCount = inventory[itemType] || 0;
  return {
    ...inventory,
    [itemType]: currentCount + count,
  };
}

/**
 * Remove one item from inventory (pure function)
 * @param {Object} inventory - Current inventory state
 * @param {string} itemType - Type of item to remove
 * @returns {Object|null} New inventory object with decremented count, or null if item unavailable
 */
export function removeItemFromInventory(inventory, itemType) {
  const currentCount = inventory[itemType] || 0;

  if (currentCount <= 0) {
    return null;
  }

  return {
    ...inventory,
    [itemType]: currentCount - 1,
  };
}

/**
 * Check if inventory has an item available
 * @param {Object} inventory - Current inventory state
 * @param {string} itemType - Type of item to check
 * @returns {boolean} True if item is available (count > 0)
 */
export function hasItem(inventory, itemType) {
  const count = inventory[itemType] || 0;
  return count > 0;
}
