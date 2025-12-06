import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import PieceBlock from './PieceBlock';
import { COLORS, GAME_CONFIG, PIECE_TYPES } from '../constants/gameConfig';

export default function Piece({
  shape,
  svgRefs,
  onPress,
  blockSize = GAME_CONFIG.CELL_SIZE,
  type = PIECE_TYPES.NORMAL,
}) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => setIsPressed(true);
  const handlePressOut = () => setIsPressed(false);

  const content = (
    <View style={styles.container}>
      {shape.map((row, rowIndex) => {
        let cellIndex = 0; // Track index for svgRefs mapping

        return (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, colIndex) => {
              const currentIndex = cellIndex;
              if (cell === 1) cellIndex++; // Increment only for filled cells

              return (
                <View
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={[styles.cellContainer, { width: blockSize, height: blockSize }]}
                >
                  {cell === 1 && (
                    <View testID={`piece-block-${rowIndex}-${colIndex}`}>
                      <PieceBlock
                        svgRef={svgRefs[currentIndex]}
                        size={blockSize}
                        isPressed={isPressed}
                        icon={type === PIECE_TYPES.BOMB ? '💣' : null}
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );

  // If onPress is provided, wrap in Pressable for interaction
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  row: {
    flexDirection: 'row',
  },
  cellContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
