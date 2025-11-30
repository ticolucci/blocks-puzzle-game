import React from 'react';
import { View, StyleSheet } from 'react-native';
import GridCell from './GridCell';
import { GAME_CONFIG, COLORS } from '../constants/gameConfig';

// Create initial empty grid data structure
const createEmptyGrid = (size) => {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => ({
      row,
      col,
      filled: false,
    }))
  );
};

export default function GameBoard({ size = GAME_CONFIG.BOARD_SIZE }) {
  const gridData = createEmptyGrid(size);

  return (
    <View style={styles.container}>
      {gridData.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((cell) => (
            <GridCell
              key={`cell-${cell.row}-${cell.col}`}
              row={cell.row}
              col={cell.col}
              filled={cell.filled}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.GRID_BORDER,
  },
  row: {
    flexDirection: 'row',
  },
});
