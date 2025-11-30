import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import PieceBlock from './PieceBlock';
import { COLORS } from '../constants/gameConfig';

export default function Piece({
  shape,
  color = COLORS.CELL_FILLED,
  onPress,
  blockSize = 20,
}) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => setIsPressed(true);
  const handlePressOut = () => setIsPressed(false);

  const content = (
    <View style={styles.container}>
      {shape.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((cell, colIndex) => (
            <View
              key={`cell-${rowIndex}-${colIndex}`}
              style={[styles.cellContainer, { width: blockSize, height: blockSize }]}
            >
              {cell === 1 && (
                <View testID={`piece-block-${rowIndex}-${colIndex}`}>
                  <PieceBlock
                    color={color}
                    size={blockSize}
                    isPressed={isPressed}
                  />
                </View>
              )}
            </View>
          ))}
        </View>
      ))}
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
