import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GAME_CONFIG, COLORS } from '../constants/gameConfig';

export default function GridCell({ row, col, filled = false }) {
  return (
    <View
      testID={`grid-cell-${row}-${col}`}
      accessibilityState={{ selected: filled }}
      style={[styles.cell, filled && styles.filled]}
    />
  );
}

const styles = StyleSheet.create({
  cell: {
    width: GAME_CONFIG.CELL_SIZE,
    height: GAME_CONFIG.CELL_SIZE,
    borderWidth: 1,
    borderColor: COLORS.CELL_BORDER,
    backgroundColor: COLORS.CELL_BACKGROUND,
  },
  filled: {
    backgroundColor: COLORS.CELL_FILLED,
  },
});
