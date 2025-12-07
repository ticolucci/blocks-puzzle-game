import { useMemo, useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import GridCell from './GridCell';
import { GAME_CONFIG, COLORS } from '../constants/gameConfig';
import { createEmptyGrid } from '../utils/gridHelpers';

/**
 * Custom hook to create optimized preview cell lookup
 * Uses Set for O(1) lookup instead of O(n) array search
 * @param {Array<{row: number, col: number}>} previewCells - Array of preview cell positions
 * @returns {Function} Function to check if a cell is in preview
 */
const usePreviewCells = (previewCells) => {
  const previewSet = useMemo(() => {
    if (!previewCells || previewCells.length === 0) {
      return null;
    }
    // Create Set of "row-col" strings for O(1) lookup
    return new Set(previewCells.map(cell => `${cell.row}-${cell.col}`));
  }, [previewCells]);

  const isPreviewCell = (row, col) => {
    if (!previewSet) return false;
    return previewSet.has(`${row}-${col}`);
  };

  return isPreviewCell;
};

/**
 * Game board component that renders the grid with preview support
 * @component
 * @example
 * const gridState = createEmptyGrid(10);
 * const previewCells = [{ row: 5, col: 5 }, { row: 5, col: 6 }];
 * const boardRef = useRef(null);
 *
 * <GameBoard
 *   ref={boardRef}
 *   size={10}
 *   gridState={gridState}
 *   previewCells={previewCells}
 *   previewValid={true}
 * />
 *
 * // Measure board position
 * boardRef.current.measureInWindow((x, y, width, height) => {
 *   console.log('Board position:', { x, y, width, height });
 * });
 */
const GameBoard = forwardRef(({
  size = GAME_CONFIG.BOARD_SIZE,
  onLayout,
  gridState,
  previewCells = null,
  previewValid = true,
  clearingCells = null,
  itemPreviewCells = null,
}, ref) => {
  // Ref to the View component for measuring
  const viewRef = useRef(null);

  // Expose measureInWindow method to parent components
  useImperativeHandle(ref, () => ({
    measureInWindow: (callback) => {
      if (viewRef.current) {
        viewRef.current.measureInWindow(callback);
      }
    },
  }));

  // Use provided gridState or create empty grid
  const gridData = gridState || createEmptyGrid(size);

  // Optimized preview cell lookup
  const isPreviewCell = usePreviewCells(previewCells);

  // Optimized clearing cell lookup
  const isClearingCell = usePreviewCells(clearingCells);

  // Optimized item preview cell lookup
  const isItemPreviewCell = usePreviewCells(itemPreviewCells);

  return (
    <View ref={viewRef} style={styles.container} onLayout={onLayout}>
      {gridData.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((cell) => (
            <GridCell
              key={`cell-${cell.row}-${cell.col}`}
              row={cell.row}
              col={cell.col}
              filled={cell.filled}
              svgRef={cell.svgRef}
              isPreview={isPreviewCell(cell.row, cell.col)}
              previewValid={previewValid}
              isClearing={isClearingCell(cell.row, cell.col)}
              isItemPreview={isItemPreviewCell(cell.row, cell.col)}
            />
          ))}
        </View>
      ))}
    </View>
  );
});

GameBoard.displayName = 'GameBoard';

GameBoard.propTypes = {
  size: PropTypes.number,
  onLayout: PropTypes.func,
  gridState: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        row: PropTypes.number,
        col: PropTypes.number,
        filled: PropTypes.bool,
        svgRef: PropTypes.string,
      })
    )
  ),
  previewCells: PropTypes.arrayOf(
    PropTypes.shape({
      row: PropTypes.number,
      col: PropTypes.number,
    })
  ),
  previewValid: PropTypes.bool,
  clearingCells: PropTypes.arrayOf(
    PropTypes.shape({
      row: PropTypes.number,
      col: PropTypes.number,
    })
  ),
  itemPreviewCells: PropTypes.arrayOf(
    PropTypes.shape({
      row: PropTypes.number,
      col: PropTypes.number,
    })
  ),
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.GRID_BORDER,
  },
  row: {
    flexDirection: 'row',
  },
});

export default GameBoard;
