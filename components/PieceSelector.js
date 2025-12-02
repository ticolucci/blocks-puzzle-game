import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Piece from './Piece';

function PieceSelector({
  pieces = [],
  selectedPieceId,
  onPieceSelect,
  onDragStart,
  onDragMove,
  onDragEnd,
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

PieceSelector.propTypes = {
  pieces: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      runtimeId: PropTypes.number,
      shape: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
      shapeName: PropTypes.string,
      rotation: PropTypes.number,
      rotationIndex: PropTypes.number,
    })
  ),
  selectedPieceId: PropTypes.number,
  onPieceSelect: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragMove: PropTypes.func,
  onDragEnd: PropTypes.func,
};

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

export default PieceSelector;
