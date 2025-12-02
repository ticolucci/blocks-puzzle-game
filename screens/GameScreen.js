import { useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import GameBoard from '../components/GameBoard';
import ScoreCounter from '../components/ScoreCounter';
import PieceSelector from '../components/PieceSelector';
import { GAME_CONFIG } from '../constants/gameConfig';
import { initializeGamePieces } from '../utils/pieceLibrary';
import { createEmptyGrid } from '../utils/gridHelpers';
import { screenToGridPosition } from '../utils/gridCoordinates';
import { canPlacePiece, getAffectedCells } from '../utils/placementValidation';

export default function GameScreen() {
  const [score, setScore] = useState(GAME_CONFIG.INITIAL_SCORE);
  const [pieces, setPieces] = useState(() => initializeGamePieces(3));
  const [gridState, setGridState] = useState(() => createEmptyGrid(GAME_CONFIG.BOARD_SIZE));
  const [boardLayout, setBoardLayout] = useState(null);

  const [dragState, setDragState] = useState(null);
  const [previewCells, setPreviewCells] = useState(null);
  const [previewValid, setPreviewValid] = useState(true);

  // Use refs to always access the latest values
  const boardLayoutRef = useRef(boardLayout);
  const gridStateRef = useRef(gridState);
  const dragStateRef = useRef(dragState);

  useEffect(() => {
    boardLayoutRef.current = boardLayout;
    gridStateRef.current = gridState;
    dragStateRef.current = dragState;
  }, [boardLayout, gridState, dragState]);

  const placePiece = useCallback((piece) => {
    const currentDragState = dragStateRef.current;
    // Check if placement was valid
    if (!currentDragState || !currentDragState.isValid || !currentDragState.affectedCells) {
      return false;
    }

    // Update grid state with placed piece
    setGridState(prevGrid => {
      const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
      currentDragState.affectedCells.forEach(({ row, col }) => {
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

    return true;
  }, [setGridState, setPieces, dragState]);

  const getBoardLayout = useCallback((event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    const newLayout = {
      x,
      y,
      width,
      height,
      cellSize: GAME_CONFIG.CELL_SIZE,
    };
    console.log('Setting board layout:', newLayout);
    setBoardLayout(newLayout);
  }, []);

  // Drag handlers (inlined from useDragHandlers)
  const handleDragStart = useCallback((piece) => {
    console.log('Drag started for piece:', piece);
    setDragState({ piece });
    setPreviewCells(null);
    setPreviewValid(true);
  }, []);

  const handleDragMove = useCallback((piece, screenX, screenY) => {
    // Access current values from refs
    const currentBoardLayout = boardLayoutRef.current;
    const currentGridState = gridStateRef.current;

    console.log('Screen coords:', screenX, screenY);

    if (!currentBoardLayout || !currentGridState) {
      return;
    }

    // Convert screen coordinates to grid position
    const gridPosition = screenToGridPosition(screenX, screenY, currentBoardLayout);
    if (!gridPosition) {
      // Outside grid bounds
      setPreviewCells(null);
      setPreviewValid(false);
      setDragState({ piece, currentX: screenX, currentY: screenY, isValid: false });
      return;
    }

    // Validate placement
    const validation = canPlacePiece(piece, gridPosition.row, gridPosition.col, currentGridState, GAME_CONFIG.BOARD_SIZE);

    // Update preview
    setPreviewCells(validation.valid ? validation.affectedCells : getAffectedCells(piece, gridPosition.row, gridPosition.col));
    setPreviewValid(validation.valid);

    // Update drag state
    setDragState({
      piece,
      currentX: screenX,
      currentY: screenY,
      isValid: validation.valid,
      targetGridPosition: gridPosition,
      affectedCells: validation.affectedCells,
    });
  }, []); // Empty deps - function never recreated, always uses refs

  const handleDragEnd = useCallback((piece) => {
    const finalDragState = dragState;
console.log('Drag ended for piece:', piece, 'Final drag state:', finalDragState);
    // Clear drag state and preview
    setDragState(null);
    setPreviewCells(null);
    setPreviewValid(true);

    // Place the piece
    placePiece(piece);
  }, [dragState, placePiece]);

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
