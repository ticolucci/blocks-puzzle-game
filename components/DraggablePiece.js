import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Animated, PanResponder, View } from 'react-native';
import Piece from './Piece';
import { GAME_CONFIG } from '../constants/gameConfig';

// Animation timing constants for return-to-origin animation
const ANIMATION_FRICTION = 8;
const ANIMATION_TENSION = 40;

// Animation configuration for spring animation
const SPRING_CONFIG = {
  friction: ANIMATION_FRICTION,
  tension: ANIMATION_TENSION,
  useNativeDriver: true,
};

// Quick animation for centering piece under finger after pickup
const CENTER_ANIMATION_CONFIG = {
  friction: 12,
  tension: 150,
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

  // Ref to the View component for measuring
  const viewRef = useRef(null);

  // Store the piece's layout information (measured on layout)
  const pieceLayout = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Store the initial centering offset applied when picking up the piece
  const initialOffset = useRef({ x: 0, y: 0 });

  // PanResponder for gesture handling
  const panResponder = useRef(
    PanResponder.create({
      // Should this component respond to pan gestures?
      onStartShouldSetPanResponder: () => !isPlaced && !disabled,
      onMoveShouldSetPanResponder: () => !isPlaced && !disabled,

      // Gesture started
      onPanResponderGrant: (event) => {
        if (!isPlaced && !disabled) {
          console.log(`\n[${piece.runtimeId}] === DRAG START ===`);
          console.log(`[${piece.runtimeId}] pieceLayout:`, pieceLayout.current);
          console.log(`[${piece.runtimeId}] touch position:`, {
            pageX: event.nativeEvent.pageX,
            pageY: event.nativeEvent.pageY
          });

          // Check if we have valid pre-measured layout (width > 0 means measurement completed)
          if (pieceLayout.current.width > 0) {
            console.log(`[${piece.runtimeId}] Using pre-measured layout (fast path)`);

            // Calculate piece center from pre-measured layout
            const pieceCenterX = pieceLayout.current.x + (pieceLayout.current.width / 2);
            const pieceCenterY = pieceLayout.current.y + (pieceLayout.current.height / 2);

            console.log(`[${piece.runtimeId}] calculated piece center:`, { pieceCenterX, pieceCenterY });

            // Calculate the offset needed to center the piece under the finger
            initialOffset.current = {
              x: event.nativeEvent.pageX - pieceCenterX,
              y: event.nativeEvent.pageY - pieceCenterY,
            };

            console.log(`[${piece.runtimeId}] initialOffset:`, initialOffset.current);

            // Animate piece to center under the finger
            Animated.spring(pan, {
              toValue: initialOffset.current,
              ...CENTER_ANIMATION_CONFIG,
            }).start();
          } else {
            console.log(`[${piece.runtimeId}] Layout not ready, measuring now (fallback path)`);

            // Fallback: measure now if layout hasn't been captured yet
            if (viewRef.current) {
              event.persist();
              viewRef.current.measureInWindow((x, y, width, height) => {
                console.log(`[${piece.runtimeId}] measureInWindow fallback complete:`, { x, y, width, height });

                // Calculate piece center
                const pieceCenterX = x + (width / 2);
                const pieceCenterY = y + (height / 2);

                console.log(`[${piece.runtimeId}] calculated piece center (fallback):`, { pieceCenterX, pieceCenterY });

                // Calculate the offset needed to center the piece under the finger
                initialOffset.current = {
                  x: event.nativeEvent.pageX - pieceCenterX,
                  y: event.nativeEvent.pageY - pieceCenterY,
                };

                console.log(`[${piece.runtimeId}] initialOffset (fallback):`, initialOffset.current);

                // Animate piece to center under the finger
                Animated.spring(pan, {
                  toValue: initialOffset.current,
                  ...CENTER_ANIMATION_CONFIG,
                }).start();
              });
            }
          }

          if (onDragStart) {
            onDragStart(piece);
          }
        }
      },

      // Gesture moving
      onPanResponderMove: (event, gestureState) => {
        if (!isPlaced && !disabled) {
          // Update animated position, adding the initial centering offset
          // to the gesture displacement so the piece stays centered under the finger
          pan.setValue({
            x: initialOffset.current.x + gestureState.dx,
            y: initialOffset.current.y + gestureState.dy
          });

          // Call onDragMove with current touch position (piece is centered under finger)
          if (onDragMove) {
            onDragMove(
              piece,
              event.nativeEvent.pageX,
              event.nativeEvent.pageY
            );
          }
        }
      },

      // Gesture released
      onPanResponderRelease: () => {
        if (!isPlaced && !disabled) {
          if (onDragEnd) {
            onDragEnd(piece);
          }

          // Reset initial offset for next drag
          initialOffset.current = { x: 0, y: 0 };

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
          // Reset initial offset for next drag
          initialOffset.current = { x: 0, y: 0 };

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

  // Handler to measure piece position when layout changes
  const handleLayout = (event) => {
    console.log(`[${piece.runtimeId}] onLayout called`);
    if (viewRef.current) {
      viewRef.current.measureInWindow((x, y, width, height) => {
        pieceLayout.current = { x, y, width, height };
        console.log(`[${piece.runtimeId}] measureInWindow complete:`, { x, y, width, height });
      });
    }
  };

  return (
    <Animated.View
      ref={viewRef}
      testID={testID}
      onLayout={handleLayout}
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
export default DraggablePiece;
