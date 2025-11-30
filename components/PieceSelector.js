import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Piece from './Piece';

export default function PieceSelector({
  pieces = [],
  selectedPieceId,
  onPieceSelect,
}) {
  return (
    <View style={styles.container}>
      {pieces.map((piece, index) => {
        // Use runtimeId if available (from library), otherwise fall back to id
        const pieceId = piece.runtimeId ?? piece.id;
        const isSelected = pieceId === selectedPieceId;
        return (
          <TouchableOpacity
            key={pieceId}
            testID={`piece-slot-${index}`}
            accessibilityState={{ selected: isSelected }}
            style={[styles.slot, isSelected && styles.selectedSlot]}
            onPress={() => onPieceSelect && onPieceSelect(piece)}
          >
            <Piece shape={piece.shape} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  slot: {
    padding: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  selectedSlot: {
    borderColor: '#4A90E2',
    backgroundColor: '#E3F2FD',
  },
});
