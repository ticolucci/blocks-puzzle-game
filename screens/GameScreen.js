import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import GameBoard from '../components/GameBoard';
import ScoreCounter from '../components/ScoreCounter';
import PieceSelector from '../components/PieceSelector';
import { GAME_CONFIG } from '../constants/gameConfig';
import { initializeGamePieces } from '../utils/pieceLibrary';
import { createEmptyGrid } from '../utils/gridHelpers';
import { useDragHandlers } from '../hooks/useDragHandlers';
import { usePiecePlacement } from '../hooks/usePiecePlacement';

export default function GameScreen() {
  const [score, setScore] = useState(GAME_CONFIG.INITIAL_SCORE);
  const [pieces, setPieces] = useState(() => initializeGamePieces(3));
  const [gridState, setGridState] = useState(() => createEmptyGrid(GAME_CONFIG.BOARD_SIZE));
  const [boardLayout, setBoardLayout] = useState(null);

  const {
    dragState,
    previewCells,
    previewValid,
    handleDragStart,
    handleDragMove,
    handleDragEnd: handleDragEndFromHook,
  } = useDragHandlers(boardLayout, gridState, GAME_CONFIG.BOARD_SIZE);

  const placePiece = usePiecePlacement(setGridState, setPieces);

  const getBoardLayout = useCallback((event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setBoardLayout({
      x,
      y,
      width,
      height,
      cellSize: GAME_CONFIG.CELL_SIZE,
    });
  }, []);

  const handleDragEnd = useCallback((piece) => {
    const finalDragState = handleDragEndFromHook(piece);
    placePiece(finalDragState, piece);
  }, [handleDragEndFromHook, placePiece]);

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <ScoreCounter score={score} />
      </View>

      <View style={styles.boardContainer}>
        <GameBoard
          size={GAME_CONFIG.BOARD_SIZE}
          gridState={gridState}
          previewCells={previewCells}
          previewValid={previewValid}
          onLayout={getBoardLayout}
        />
      </View>

      <View style={styles.pieceSelectorContainer}>
        <PieceSelector
          pieces={pieces}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
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
