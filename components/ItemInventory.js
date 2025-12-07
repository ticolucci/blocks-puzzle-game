import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import ItemSlot from './ItemSlot';
import { ITEM_TYPES } from '../constants/itemTypes';
import { GAME_CONFIG } from '../constants/gameConfig';

/**
 * Inventory panel for items
 * Displays all available items with their counts
 * Always visible (even when empty)
 *
 * @component
 * @param {Object} inventory - Inventory state object { itemType: count }
 * @param {function} onItemDragStart - Callback when item drag starts
 * @param {function} onItemDragMove - Callback during item drag movement
 * @param {function} onItemDragEnd - Callback when item drag ends
 */
function ItemInventory({
  inventory,
  onItemDragStart,
  onItemDragMove,
  onItemDragEnd,
}) {
  // Always render all item types, even if not in inventory
  const allItemTypes = Object.values(ITEM_TYPES);

  return (
    <View style={styles.container} testID="inventory-container">
      <Text style={styles.label}>Items</Text>
      <View style={styles.itemsContainer}>
        {allItemTypes.map(itemType => (
          <ItemSlot
            key={itemType}
            itemType={itemType}
            count={inventory[itemType] || 0}
            onDragStart={onItemDragStart}
            onDragMove={onItemDragMove}
            onDragEnd={onItemDragEnd}
          />
        ))}
      </View>
    </View>
  );
}

ItemInventory.propTypes = {
  inventory: PropTypes.object.isRequired,
  onItemDragStart: PropTypes.func,
  onItemDragMove: PropTypes.func,
  onItemDragEnd: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: GAME_CONFIG.INVENTORY_WIDTH,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: GAME_CONFIG.INVENTORY_GAP,
    textAlign: 'center',
  },
  itemsContainer: {
    flexDirection: 'column',
    gap: GAME_CONFIG.INVENTORY_GAP,
  },
});

export default ItemInventory;
