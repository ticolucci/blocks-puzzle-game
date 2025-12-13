import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import Piece from './Piece';
import { GAME_CONFIG } from '../constants/gameConfig';

// Animation timing constants for return-to-origin animation
const ANIMATION_FRICTION = 8;
const ANIMATION_TENSION = 40;

// Vertical offset in grid blocks - piece is displayed this many blocks above the finger
const VERTICAL_OFFSET_BLOCKS = 5;
const VERTICAL_OFFSET_PIXELS = VERTICAL_OFFSET_BLOCKS * GAME_CONFIG.CELL_SIZE;

// Animation configuration for spring animation
const SPRING_CONFIG = {
  damping: ANIMATION_FRICTION * 2.5,
  stiffness: ANIMATION_TENSION * 2.5,
};

// Quick animation for centering piece under finger after pickup
const CENTER_ANIMATION_CONFIG = {
  damping: 40 * 2.5,
  stiffness: 300 * 2.5,
};

/**
 * A draggable wrapper for the Piece component with gesture handling
 * Provides smooth drag-and-drop interaction with return-to-origin animation
 *
 * When dragged, the piece is positioned 5 blocks above the finger to prevent
 * the finger from obscuring the piece. The onDragMove callback receives the
 * piece center coordinates (not the finger position).
 *
 * @component
 * @example
 * const piece = { shape: [[1, 1], [1, 1]], runtimeId: 1 };
 *
 * <DraggablePiece
 *   piece={piece}
 *   onDragStart={(p) => console.log('Started dragging', p)}
 *   onDragMove={(p, x, y) => console.log('Piece center at', x, y)}
 *   onDragEnd={(p) => console.log('Finished dragging', p)}
 *   isPlaced={false}
 *   selectorScale={0.65}
 * />
 *
 * @param {object} piece - The piece data with shape and metadata
 * @param {function} onDragStart - Callback when drag starts, receives piece
 * @param {function} onDragMove - Callback during drag movement, receives piece and piece center coordinates (x, y)
 * @param {function} onDragEnd - Callback when drag ends, receives piece
 * @param {boolean} isPlaced - Whether the piece has been placed (disables dragging)
 * @param {boolean} disabled - Whether dragging is disabled
 * @param {number} selectorScale - Scale factor for piece preview in selector (0.0-1.0)
 * @param {string} testID - Test ID for testing purposes
 */
function DraggablePiece({
  piece,
  onDragStart,
  onDragMove,
  onDragEnd,
  isPlaced = false,
  disabled = false,
  selectorScale = 1.0,
  testID,
}) {
  // Animated values for smooth dragging
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(selectorScale);

  // Ref to the View component for measuring
  const viewRef = useRef(null);

  // Store the piece's layout information (measured on layout)
  const pieceLayout = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Store the initial centering offset applied when picking up the piece
  const initialOffset = useRef({ x: 0, y: 0 });

  // Callbacks that need to be called from the gesture
  const handleDragStart = () => {
    if (onDragStart) {
      onDragStart(piece);
    }
  };

  const handleDragMove = (pageX, pageY) => {
    if (onDragMove) {
      onDragMove(piece, pageX, pageY);
    }
  };

  const handleDragEnd = () => {
    if (onDragEnd) {
      onDragEnd(piece);
    }
  };

  // Pan gesture handler
  const panGesture = Gesture.Pan()
    .enabled(!isPlaced && !disabled)
    .onStart((event) => {
      // Animate scale to full size (1.0) when dragging starts
      scale.value = withSpring(1.0, CENTER_ANIMATION_CONFIG);

      // Check if we have valid pre-measured layout (width > 0 means measurement completed)
      if (pieceLayout.current.width > 0) {
        // Fast path: use pre-measured layout
        // Get scaled dimensions from measurement
        const scaledWidth = pieceLayout.current.width;
        const scaledHeight = pieceLayout.current.height;

        // Calculate piece center at current (scaled) position
        // When piece scales from center, the center position stays the same
        const pieceCenterX = pieceLayout.current.x + (scaledWidth / 2);
        const pieceCenterY = pieceLayout.current.y + (scaledHeight / 2);

        // Offset needed to center piece on finger horizontally, and VERTICAL_OFFSET_PIXELS above finger
        // This prevents the finger from obscuring the piece during drag
        initialOffset.current = {
          x: event.absoluteX - pieceCenterX,
          y: event.absoluteY - pieceCenterY - VERTICAL_OFFSET_PIXELS,
        };

        // Animate piece to center horizontally under the finger, but vertically above it
        translateX.value = withSpring(initialOffset.current.x, CENTER_ANIMATION_CONFIG);
        translateY.value = withSpring(initialOffset.current.y, CENTER_ANIMATION_CONFIG);
      }

      runOnJS(handleDragStart)();
    })
    .onUpdate((event) => {
      // Update animated position, adding the initial centering offset
      // to the gesture displacement so the piece stays centered under the finger
      translateX.value = initialOffset.current.x + event.translationX;
      translateY.value = initialOffset.current.y + event.translationY;

      // Call onDragMove with piece center position (not finger position)
      // Piece center is VERTICAL_OFFSET_PIXELS above the finger
      const pieceCenterX = event.absoluteX;
      const pieceCenterY = event.absoluteY - VERTICAL_OFFSET_PIXELS;
      runOnJS(handleDragMove)(pieceCenterX, pieceCenterY);
    })
    .onEnd(() => {
      runOnJS(handleDragEnd)();

      // Reset initial offset for next drag
      initialOffset.current = { x: 0, y: 0 };

      // Animate scale back to selector size
      scale.value = withSpring(selectorScale, SPRING_CONFIG);

      // Return to origin with spring animation
      translateX.value = withSpring(0, SPRING_CONFIG);
      translateY.value = withSpring(0, SPRING_CONFIG);
    })
    .onFinalize(() => {
      // Gesture terminated (interrupted by another gesture)
      // Reset initial offset for next drag
      initialOffset.current = { x: 0, y: 0 };

      // Animate scale back to selector size
      scale.value = withSpring(selectorScale, SPRING_CONFIG);

      // Return to origin with spring animation
      translateX.value = withSpring(0, SPRING_CONFIG);
      translateY.value = withSpring(0, SPRING_CONFIG);
    });

  // Animated style for transforms
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // Sync scale with selectorScale prop and reset position when placed
  useEffect(() => {
    // Always keep scale in sync with selectorScale
    scale.value = selectorScale;

    // Reset position when piece is placed
    if (isPlaced) {
      translateX.value = 0;
      translateY.value = 0;
    }
  }, [isPlaced, selectorScale, translateX, translateY, scale]);

  // Handler to measure piece position when layout changes
  const handleLayout = () => {
    if (viewRef.current) {
      viewRef.current.measureInWindow((x, y, width, height) => {
        pieceLayout.current = { x, y, width, height };
      });
    }
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        ref={viewRef}
        testID={testID}
        onLayout={handleLayout}
        style={animatedStyle}
      >
        <Piece shape={piece.shape} svgRefs={piece.svgRefs} type={piece.type} />
      </Animated.View>
    </GestureDetector>
  );
}

DraggablePiece.propTypes = {
  piece: PropTypes.shape({
    runtimeId: PropTypes.number,
    id: PropTypes.string,
    shape: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    shapeName: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  onDragStart: PropTypes.func,
  onDragMove: PropTypes.func,
  onDragEnd: PropTypes.func,
  isPlaced: PropTypes.bool,
  disabled: PropTypes.bool,
  selectorScale: PropTypes.number,
  testID: PropTypes.string,
};

// Memoize component to prevent unnecessary re-renders during drag operations
export default DraggablePiece;
