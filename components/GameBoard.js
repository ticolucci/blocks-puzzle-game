import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import GridCell from './GridCell';
import { GAME_CONFIG, COLORS } from '../constants/gameConfig';
import { createEmptyGrid } from '../utils/gridHelpers';

function GameBoard({ size = GAME_CONFIG.BOARD_SIZE, onLayout }) {
  const gridData = createEmptyGrid(size);

  return (
    <View style={styles.container} onLayout={onLayout}>
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

GameBoard.propTypes = {
  size: PropTypes.number,
  onLayout: PropTypes.func,
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
