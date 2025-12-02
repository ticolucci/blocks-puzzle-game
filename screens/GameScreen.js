import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import GameBoard from '../components/GameBoard';
import ScoreCounter from '../components/ScoreCounter';
import PieceSelector from '../components/PieceSelector';
import { GAME_CONFIG } from '../constants/gameConfig';
import { getRandomPieces } from '../utils/pieceLibrary';
import { createEmptyGrid } from '../utils/gridHelpers';
import { useDragHandlers } from '../hooks/useDragHandlers';

export default function GameScreen() {
  const [score, setScore] = useState(GAME_CONFIG.INITIAL_SCORE);
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [pieces, setPieces] = useState(() =>
    getRandomPieces(3).map(p => ({ ...p, isPlaced: false }))
  );
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

  const handlePieceSelect = (piece) => {
    setSelectedPieceId(piece.runtimeId);
  };

  const getBoardLayout = (event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setBoardLayout({
      x,
      y,
      width,
      height,
      cellSize: GAME_CONFIG.CELL_SIZE,
    });
  };

  const handleDragEnd = (piece) => {
    const finalDragState = handleDragEndFromHook(piece);

    // Check if placement was valid
    if (finalDragState && finalDragState.isValid && finalDragState.affectedCells) {
      // Update grid state with placed piece
      setGridState(prevGrid => {
        const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
        finalDragState.affectedCells.forEach(({ row, col }) => {
          newGrid[row][col].filled = true;
        });
        return newGrid;
      });

      // Mark piece as placed
      setPieces(prevPieces =>
        prevPieces.map(p =>
          p.runtimeId === piece.runtimeId ? { ...p, isPlaced: true } : p
        )
      );
    }
  };

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
          selectedPieceId={selectedPieceId}
          onPieceSelect={handlePieceSelect}
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
