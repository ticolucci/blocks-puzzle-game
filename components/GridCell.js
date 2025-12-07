import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { GAME_CONFIG, COLORS } from '../constants/gameConfig';
import { renderSVG } from '../constants/svgRegistry';

/**
 * Individual grid cell component with preview support
 * Memoized to prevent unnecessary re-renders during drag operations
 */
function GridCell({ row, col, filled = false, svgRef = null, isPreview = false, previewValid = true, isClearing = false, isItemPreview = false }) {
  return (
    <View
      testID={`grid-cell-${row}-${col}`}
      accessibilityState={{ selected: filled }}
      style={[
        styles.cell,
        isPreview && previewValid && styles.previewValid,
        isPreview && !previewValid && styles.previewInvalid,
        isClearing && styles.clearing,
        isItemPreview && styles.itemPreview,
      ]}
    >
      {/* Render SVG if cell is filled and has svgRef */}
      {filled && svgRef && renderSVG(svgRef, GAME_CONFIG.CELL_SIZE)}
    </View>
  );
}

GridCell.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  filled: PropTypes.bool,
  svgRef: PropTypes.string,
  isPreview: PropTypes.bool,
  previewValid: PropTypes.bool,
  isClearing: PropTypes.bool,
  isItemPreview: PropTypes.bool,
};

// Memoize to prevent unnecessary re-renders of 100 cells during drag operations
export default memo(GridCell);

const styles = StyleSheet.create({
  cell: {
    width: GAME_CONFIG.CELL_SIZE,
    height: GAME_CONFIG.CELL_SIZE,
    borderWidth: 1,
    borderColor: COLORS.CELL_BORDER,
    backgroundColor: COLORS.CELL_BACKGROUND,
  },
  previewValid: {
    backgroundColor: COLORS.PREVIEW_VALID,
  },
  previewInvalid: {
    backgroundColor: COLORS.PREVIEW_INVALID,
  },
  clearing: {
    backgroundColor: COLORS.CELL_CLEARING,
  },
  itemPreview: {
    backgroundColor: '#FFE0B2', // Orange tint for bomb preview
    opacity: 0.7,
  },
});
