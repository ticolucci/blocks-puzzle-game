import React, { useRef, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Animated, PanResponder, View } from 'react-native';
import Piece from './Piece';

// Animation timing constants for return-to-origin animation
const ANIMATION_FRICTION = 8;
const ANIMATION_TENSION = 40;

// Animation configuration for spring animation
const SPRING_CONFIG = {
  friction: ANIMATION_FRICTION,
  tension: ANIMATION_TENSION,
  useNativeDriver: true,
};

/**
 * A draggable wrapper for the Piece component with PanResponder gesture handling
 * Provides smooth drag-and-drop interaction with return-to-origin animation
 *
 * @component
 * @example
 * const piece = { shape: [[1, 1], [1, 1]], runtimeId: 1 };
 *
 * <DraggablePiece
 *   piece={piece}
 *   onDragStart={(p) => console.log('Started dragging', p)}
 *   onDragMove={(p, x, y) => console.log('Dragging at', x, y)}
 *   onDragEnd={(p) => console.log('Finished dragging', p)}
 *   isPlaced={false}
 * />
 *
 * @param {object} piece - The piece data with shape and metadata
 * @param {function} onDragStart - Callback when drag starts, receives piece
 * @param {function} onDragMove - Callback during drag movement, receives piece, pageX, pageY
 * @param {function} onDragEnd - Callback when drag ends, receives piece
 * @param {boolean} isPlaced - Whether the piece has been placed (disables dragging)
 * @param {boolean} disabled - Whether dragging is disabled
 * @param {string} testID - Test ID for testing purposes
 */
function DraggablePiece({
  piece,
  onDragStart,
  onDragMove,
  onDragEnd,
  isPlaced = false,
  disabled = false,
  testID,
}) {
  // Animated value for smooth dragging
  const pan = useRef(new Animated.ValueXY()).current;

  // PanResponder for gesture handling
  const panResponder = useRef(
    PanResponder.create({
      // Should this component respond to pan gestures?
      onStartShouldSetPanResponder: () => !isPlaced && !disabled,
      onMoveShouldSetPanResponder: () => !isPlaced && !disabled,

      // Gesture started
      onPanResponderGrant: () => {
        if (!isPlaced && !disabled && onDragStart) {
          onDragStart(piece);
        }
      },

      // Gesture moving
      onPanResponderMove: (event, gestureState) => {
        if (!isPlaced && !disabled) {
          // Update animated position
          pan.setValue({ x: gestureState.dx, y: gestureState.dy });

          // Call onDragMove with screen coordinates
          if (onDragMove) {
            onDragMove(piece, event.nativeEvent.pageX, event.nativeEvent.pageY);
          }
        }
      },

      // Gesture released
      onPanResponderRelease: () => {
        if (!isPlaced && !disabled) {
          if (onDragEnd) {
            onDragEnd(piece);
          }

          // Return to origin with spring animation
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            ...SPRING_CONFIG,
          }).start();
        }
      },

      // Gesture terminated (interrupted by another gesture)
      onPanResponderTerminate: () => {
        if (!isPlaced && !disabled) {
          // Return to origin with spring animation
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            ...SPRING_CONFIG,
          }).start();
        }
      },
    })
  ).current;

  // Reset position when piece is placed
  useEffect(() => {
    if (isPlaced) {
      pan.setValue({ x: 0, y: 0 });
    }
  }, [isPlaced, pan]);

  return (
    <Animated.View
      testID={testID}
      {...panResponder.panHandlers}
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
      }}
    >
      <Piece shape={piece.shape} />
    </Animated.View>
  );
}

DraggablePiece.propTypes = {
  piece: PropTypes.shape({
    runtimeId: PropTypes.number,
    id: PropTypes.string,
    shape: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    shapeName: PropTypes.string,
    rotation: PropTypes.number,
    rotationIndex: PropTypes.number,
  }).isRequired,
  onDragStart: PropTypes.func,
  onDragMove: PropTypes.func,
  onDragEnd: PropTypes.func,
  isPlaced: PropTypes.bool,
  disabled: PropTypes.bool,
  testID: PropTypes.string,
};

// Memoize component to prevent unnecessary re-renders during drag operations
export default memo(DraggablePiece);
