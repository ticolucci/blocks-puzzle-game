import { useRef } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
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
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isEnabled = count > 0;
  const itemConfig = ITEM_CONFIG[itemType];

  // Store the absolute position from the last event
  const lastEventRef = useRef({ pageX: 0, pageY: 0 });

  // Pan gesture handler
  const panGesture = Gesture.Pan()
    .enabled(isEnabled)
    .onStart(() => {
      if (onDragStart) {
        onDragStart(itemType);
      }
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;

      // Store absolute coordinates for callbacks
      lastEventRef.current = {
        pageX: event.absoluteX,
        pageY: event.absoluteY,
      };

      if (onDragMove) {
        onDragMove(
          itemType,
          event.absoluteX,
          event.absoluteY
        );
      }
    })
    .onEnd(() => {
      if (onDragEnd) {
        onDragEnd(
          itemType,
          lastEventRef.current.pageX,
          lastEventRef.current.pageY
        );
      }

      // Return to origin with spring animation
      translateX.value = withSpring(0, DRAG_ANIMATION.SPRING_CONFIG);
      translateY.value = withSpring(0, DRAG_ANIMATION.SPRING_CONFIG);
    })
    .onFinalize(() => {
      // Also reset on gesture cancellation
      translateX.value = withSpring(0, DRAG_ANIMATION.SPRING_CONFIG);
      translateY.value = withSpring(0, DRAG_ANIMATION.SPRING_CONFIG);
    });

  // Animated style for drag transformation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        testID="item-slot"
        accessibilityLabel={`${itemConfig.name}, ${count} available`}
        accessibilityRole="button"
        accessibilityState={{ disabled: !isEnabled }}
        style={[
          styles.container,
          {
            opacity: isEnabled ? 1 : 0.4,
          },
          animatedStyle,
        ]}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{itemConfig.icon}</Text>
        </View>
        {isEnabled && (
          <CountBadge count={count} testID="item-count-badge" />
        )}
      </Animated.View>
    </GestureDetector>
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
