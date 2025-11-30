import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import GameBoard from '../components/GameBoard';
import ScoreCounter from '../components/ScoreCounter';
import PieceSelector from '../components/PieceSelector';
import { GAME_CONFIG } from '../constants/gameConfig';
import { getRandomPieces } from '../utils/pieceLibrary';

export default function GameScreen() {
  const [score, setScore] = useState(GAME_CONFIG.INITIAL_SCORE);
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [pieces] = useState(() => getRandomPieces(3));

  const handlePieceSelect = (piece) => {
    setSelectedPieceId(piece.runtimeId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <ScoreCounter score={score} />
      </View>

      <View style={styles.boardContainer}>
        <GameBoard size={GAME_CONFIG.BOARD_SIZE} />
      </View>

      <View style={styles.pieceSelectorContainer}>
        <PieceSelector
          pieces={pieces}
          selectedPieceId={selectedPieceId}
          onPieceSelect={handlePieceSelect}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scoreContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieceSelectorContainer: {
    paddingBottom: 20,
  },
});
