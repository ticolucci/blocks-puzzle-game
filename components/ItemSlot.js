import { useRef } from 'react';
import PropTypes from 'prop-types';
import { Animated, PanResponder, View, Text, StyleSheet } from 'react-native';
import { ITEM_CONFIG } from '../constants/itemTypes';
import { DRAG_ANIMATION, GAME_CONFIG } from '../constants/gameConfig';
import CountBadge from './CountBadge';

/**
 * A draggable item slot for the inventory system
 * Shows item icon and count badge
 *
 * @component
 * @param {string} itemType - Type of item from ITEM_TYPES
 * @param {number} count - Number of items available
 * @param {function} onDragStart - Callback when drag starts, receives itemType
 * @param {function} onDragMove - Callback during drag movement, receives itemType, pageX, pageY
 * @param {function} onDragEnd - Callback when drag ends, receives itemType, pageX, pageY
 */
function ItemSlot({
  itemType,
  count,
  onDragStart,
  onDragMove,
  onDragEnd,
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const isEnabled = count > 0;
  const itemConfig = ITEM_CONFIG[itemType];

  // PanResponder for gesture handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isEnabled,
      onMoveShouldSetPanResponder: () => isEnabled,

      onPanResponderGrant: (event) => {
        if (isEnabled && onDragStart) {
          onDragStart(itemType);
        }
      },

      onPanResponderMove: (event, gestureState) => {
        if (isEnabled) {
          pan.setValue({
            x: gestureState.dx,
            y: gestureState.dy
          });

          if (onDragMove) {
            onDragMove(
              itemType,
              event.nativeEvent.pageX,
              event.nativeEvent.pageY
            );
          }
        }
      },

      onPanResponderRelease: (event) => {
        if (isEnabled) {
          if (onDragEnd) {
            onDragEnd(
              itemType,
              event.nativeEvent.pageX,
              event.nativeEvent.pageY
            );
          }

          // Return to origin
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            ...DRAG_ANIMATION.SPRING_CONFIG,
          }).start();
        }
      },

      onPanResponderTerminate: () => {
        if (!isDisabled) {
          // Return to origin
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            ...DRAG_ANIMATION.SPRING_CONFIG,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      testID="item-slot"
      accessibilityLabel={`${itemConfig.name}, ${count} available`}
      accessibilityState={{ disabled: !isEnabled }}
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          opacity: isEnabled ? 1 : 0.4,
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
          ],
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{itemConfig.icon}</Text>
      </View>
      {isEnabled && (
        <CountBadge count={count} testID="item-count-badge" />
      )}
    </Animated.View>
  );
}

ItemSlot.propTypes = {
  itemType: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  onDragStart: PropTypes.func,
  onDragMove: PropTypes.func,
  onDragEnd: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    width: GAME_CONFIG.CELL_SIZE,
    height: GAME_CONFIG.CELL_SIZE,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 23,
  },
});

export default ItemSlot;
