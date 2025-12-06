import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import DraggablePiece from './DraggablePiece';
import { GAME_CONFIG } from '../constants/gameConfig';

function PieceSelector({
  pieces = [],
  onDragStart,
  onDragMove,
  onDragEnd,
  selectorScale = 0.65,
}) {
  return (
    <View style={styles.container}>
      {pieces.map((piece, index) => {
        // Use runtimeId if available (from library), otherwise fall back to id
        const pieceId = piece.runtimeId ?? piece.id;
        const isPlaced = piece.isPlaced || false;

        return (
          <View
            key={pieceId}
            testID={`piece-slot-${index}`}
            accessibilityState={{ selected: false }}
            style={[
              styles.slot,
              isPlaced && styles.placedSlot,
            ]}
          >
            {!isPlaced ? (
              <DraggablePiece
                piece={piece}
                onDragStart={onDragStart}
                onDragMove={onDragMove}
                onDragEnd={onDragEnd}
                isPlaced={isPlaced}
                selectorScale={selectorScale}
              />
            ) : (
              <View style={styles.emptySlot} />
            )}
          </View>
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
  onDragStart: PropTypes.func,
  onDragMove: PropTypes.func,
  onDragEnd: PropTypes.func,
  selectorScale: PropTypes.number,
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
    minWidth: (GAME_CONFIG.CELL_SIZE + 1) * 5,
    minHeight: (GAME_CONFIG.CELL_SIZE + 1) * 5,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placedSlot: {
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
    opacity: 0.5,
  },
  emptySlot: {
    width: 60,
    height: 60,
  },
});

export default PieceSelector;
