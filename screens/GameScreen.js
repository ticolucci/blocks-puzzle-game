import { useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import GameBoard from '../components/GameBoard';
import ScoreCounter from '../components/ScoreCounter';
import PieceSelector from '../components/PieceSelector';
import GameOverModal from '../components/GameOverModal';
import NyanCat from '../components/NyanCat';
import ItemInventory from '../components/ItemInventory';
import { GAME_CONFIG, PIECE_TYPES, SVG_IDS } from '../constants/gameConfig';
import { ITEM_TYPES } from '../constants/itemTypes';
import { initializeGamePieces, getRandomPieces, areAllPiecesPlaced, createBombPiece } from '../utils/pieceLibrary';
import { createEmptyGrid } from '../utils/gridHelpers';
import { touchToPlacement } from '../utils/gridCoordinates';
import { canPlacePiece, getAffectedCells, isPossibleToPlace } from '../utils/placementValidation';
import { getFilledRows, getFilledColumns, clearLines, calculateClearScore } from '../utils/gridClearing';
import { clearBombRadius, getCellsInRadius, useBombItem } from '../utils/bombClearing';
import { getMaxScore } from '../utils/highScores';
import { calculatePlacementScore } from '../utils/placementScoring';
import { isRedPiece, addItemToInventory, removeItemFromInventory, hasItem } from '../utils/itemGeneration';

export default function GameScreen() {
  const [score, setScore] = useState(GAME_CONFIG.INITIAL_SCORE);
  const [maxScore, setMaxScore] = useState(0);
  const [pieces, setPieces] = useState(() => initializeGamePieces(3));
  const [gridState, setGridState] = useState(() => createEmptyGrid(GAME_CONFIG.BOARD_SIZE));
  const [boardLayout, setBoardLayout] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [redPiecesPlaced, setRedPiecesPlaced] = useState(0);

  const [dragState, setDragState] = useState(null);
  const [previewCells, setPreviewCells] = useState(null);
  const [previewValid, setPreviewValid] = useState(true);
  const [clearingCells, setClearingCells] = useState(null);
  const [showNyanCat, setShowNyanCat] = useState(false);

  // Inventory state
  const [inventory, setInventory] = useState({ [ITEM_TYPES.BOMB]: 0 });
  const [itemDragState, setItemDragState] = useState(null);
  const [itemPreviewCells, setItemPreviewCells] = useState(null);

  // Ref to GameBoard component for measuring absolute screen position
  const gameBoardRef = useRef(null);

  // Use refs to always access the latest values
  const boardLayoutRef = useRef(boardLayout);
  const gridStateRef = useRef(gridState);
  const dragStateRef = useRef(dragState);
  const draggingPieceRef = useRef(null);

  useEffect(() => {
    boardLayoutRef.current = boardLayout;
    gridStateRef.current = gridState;
    dragStateRef.current = dragState;
  }, [boardLayout, gridState, dragState]);

  const getBoardLayout = useCallback(() => {
    if (gameBoardRef.current) {
      gameBoardRef.current.measureInWindow((x, y, width, height) => {
        const newLayout = {
          x: x + GAME_CONFIG.CELL_BORDER_WIDTH, // Account for outer border
          y: y + GAME_CONFIG.CELL_BORDER_WIDTH,
          width: width - 2 * GAME_CONFIG.CELL_BORDER_WIDTH,
          height: height - 2 * GAME_CONFIG.CELL_BORDER_WIDTH,
          cellSize: GAME_CONFIG.CELL_SIZE, // Use cell content size (29px, borders are visual only)
        };
        console.log('Setting board layout (measureInWindow):', newLayout);
        setBoardLayout(newLayout);
        boardLayoutRef.current = newLayout;
      });
    }
  }, []);

  // Measure board position on mount and when layout changes
  useEffect(() => {
    // Small delay to ensure the board has been rendered
    const timer = setTimeout(() => {
      getBoardLayout();
    }, 100);
    return () => clearTimeout(timer);
  }, [getBoardLayout]);

  // Load max score on mount
  useEffect(() => {
    const loadMaxScore = async () => {
      const max = await getMaxScore();
      setMaxScore(max);
    };
    loadMaxScore();
  }, []);

  // Check if all pieces are placed and generate new ones
  useEffect(() => {
    if (areAllPiecesPlaced(pieces)) {
      const newPieces = getRandomPieces(3);
      setPieces(newPieces);
    }
  }, [pieces]);

  // Check for game over when pieces or grid state changes
  useEffect(() => {
    // Get all unplaced pieces
    const unplacedPieces = pieces.filter(piece => !piece.isPlaced);

    // If no unplaced pieces, game is not over yet (new pieces will be generated)
    if (unplacedPieces.length === 0) {
      return;
    }

    // Check if any unplaced piece can be placed on the board
    const canPlaceAny = unplacedPieces.some(piece =>
      isPossibleToPlace(piece, gridState, GAME_CONFIG.BOARD_SIZE)
    );

    // If no piece can be placed, game is over
    if (!canPlaceAny) {
      setIsGameOver(true);
    }
  }, [pieces, gridState]);

  const placePiece = useCallback((piece) => {
    const currentDragState = dragStateRef.current;
    // Check if placement was valid
    if (!currentDragState || !currentDragState.isValid || !currentDragState.affectedCells) {
      return false;
    }

    // Update grid state with placed piece
    setGridState(prevGrid => {
      const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
      currentDragState.affectedCells.forEach(({ row, col }, index) => {
        newGrid[row][col].filled = true;
        newGrid[row][col].svgRef = piece.svgRefs[index];
      });

      // Check if piece is a bomb
      if (piece.type === PIECE_TYPES.BOMB) {
        // Award points for placing the bomb piece (10 points per block)
        const placementPoints = calculatePlacementScore(piece);
        setScore(prevScore => prevScore + placementPoints);

        // Get bomb position (first affected cell)
        const bombPosition = currentDragState.affectedCells[0];

        // Get cells to clear in square area
        const cellsToAnimate = getCellsInRadius(
          bombPosition.row,
          bombPosition.col,
          GAME_CONFIG.BOMB_SIZE,
          GAME_CONFIG.BOARD_SIZE,
          newGrid,
          true // Only animate filled cells
        );

        // Show clearing animation
        setClearingCells(cellsToAnimate);

        // After animation delay, clear the cells
        setTimeout(() => {
          const clearedGrid = clearBombRadius(newGrid, bombPosition.row, bombPosition.col, GAME_CONFIG.BOMB_SIZE);
          setGridState(clearedGrid);
          setClearingCells(null);
        }, 400); // 400ms animation duration

        return newGrid;
      }

      // Award points for placing the piece (10 points per block)
      const placementPoints = calculatePlacementScore(piece);
      setScore(prevScore => prevScore + placementPoints);

      // Check for filled rows and columns (normal pieces)
      const filledRows = getFilledRows(newGrid, GAME_CONFIG.BOARD_SIZE);
      const filledColumns = getFilledColumns(newGrid, GAME_CONFIG.BOARD_SIZE);

      // If lines need to be cleared, show animation first
      if (filledRows.length > 0 || filledColumns.length > 0) {
        // Build array of cells to animate
        const cellsToAnimate = [];
        filledRows.forEach(rowIndex => {
          for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
            cellsToAnimate.push({ row: rowIndex, col });
          }
        });
        filledColumns.forEach(colIndex => {
          for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
            // Avoid duplicates if a cell is in both a row and column
            if (!cellsToAnimate.some(cell => cell.row === row && cell.col === colIndex)) {
              cellsToAnimate.push({ row, col: colIndex });
            }
          }
        });

        // Show clearing animation
        setClearingCells(cellsToAnimate);

        // After animation delay, clear the lines
        setTimeout(() => {
          const clearedGrid = clearLines(newGrid, filledRows, filledColumns);
          const points = calculateClearScore(filledRows.length, filledColumns.length);
          setScore(prevScore => prevScore + points);
          setGridState(clearedGrid);
          setClearingCells(null);
        }, 400); // 400ms animation duration
      }

      return newGrid;
    });

    // Mark piece as placed
    setPieces(prevPieces =>
      prevPieces.map(p =>
        p.runtimeId === piece.runtimeId ? { ...p, isPlaced: true } : p
      )
    );

    // Trigger nyan cat animation if rainbow piece is placed
    if (piece.type === PIECE_TYPES.RAINBOW) {
      setShowNyanCat(true);
      setTimeout(() => {
        setShowNyanCat(false);
      }, GAME_CONFIG.NYAN_CAT_ANIMATION_DURATION);
    }

    // Check if placed piece is red and add bomb to inventory
    if (isRedPiece(piece)) {
      setRedPiecesPlaced(prevCount => {
        const newCount = prevCount + 1;
        // When required red pieces are placed, add bomb to inventory
        if (newCount === GAME_CONFIG.RED_PIECES_FOR_BOMB) {
          setInventory(prevInv => addItemToInventory(prevInv, ITEM_TYPES.BOMB, 1));
          return 0; // Reset counter
        }
        return newCount;
      });
    }

    return true;
  }, [setGridState, setPieces, dragState]);

  // Drag handlers (inlined from useDragHandlers)
  const handleDragStart = useCallback((piece) => {
    console.log('Drag started for piece:', piece);
    draggingPieceRef.current = piece;
    setDragState({ piece });
    setPreviewCells(null);
    setPreviewValid(true);
  }, []);

  const handleDragMove = useCallback((piece, screenX, screenY) => {
    // Access current values from refs
    const currentBoardLayout = boardLayoutRef.current;
    const currentGridState = gridStateRef.current;
    const currentDraggingPiece = draggingPieceRef.current;

    if (!currentBoardLayout || !currentGridState) {
      return;
    }

    if (!currentDraggingPiece || currentDraggingPiece.runtimeId !== piece.runtimeId) {
      return;
    }

    // Direct conversion from touch to anchor position
    const anchorPosition = touchToPlacement(screenX, screenY, piece.shape, currentBoardLayout);

    if (!anchorPosition) {
      // Outside grid bounds or invalid position
      setPreviewCells([]);
      setPreviewValid(false);
      dragStateRef.current = { isValid: false, affectedCells: [] };
      return;
    }

    // Validate placement using the anchor position
    const validation = canPlacePiece(piece, anchorPosition.row, anchorPosition.col, currentGridState, GAME_CONFIG.BOARD_SIZE);

    // Update preview
    if (validation.valid) {
      setPreviewCells(validation.affectedCells);
      setPreviewValid(true);
      dragStateRef.current = { isValid: true, affectedCells: validation.affectedCells };
    } else {
      const invalidCells = getAffectedCells(piece, anchorPosition.row, anchorPosition.col);
      setPreviewCells(invalidCells);
      setPreviewValid(false);
      dragStateRef.current = { isValid: false, affectedCells: [] };
    }

    // Update drag state
    setDragState({
      piece,
      currentX: screenX,
      currentY: screenY,
      isValid: validation.valid,
      targetGridPosition: anchorPosition,
      affectedCells: validation.affectedCells,
    });
  }, []); // Empty deps - function never recreated, always uses refs

  const handleDragEnd = useCallback((piece) => {
    const finalDragState = dragState;
    // Clear drag state and preview
    setDragState(null);
    setPreviewCells(null);
    setPreviewValid(true);

    // Place the piece
    placePiece(piece);
  }, [dragState, placePiece]);

  // Item drag handlers
  const handleItemDragStart = useCallback((itemType) => {
    console.log('Item drag started for item:', itemType, " inventory:", inventory);
    if (!hasItem(inventory, itemType)) return;

    setItemDragState({ itemType });
    setItemPreviewCells(null);
  }, [inventory]);

  const handleItemDragMove = useCallback((itemType, screenX, screenY) => {
    const currentBoardLayout = boardLayoutRef.current;
    const currentGridState = gridStateRef.current;

    if (!currentBoardLayout || !currentGridState) return;

    // Convert touch to grid position (center cell)
    const gridPos = touchToPlacement(screenX, screenY, [[1]], currentBoardLayout);

    if (!gridPos) {
      setItemPreviewCells([]);
      return;
    }

    // Get cells in bomb radius for preview
    const previewCells = getCellsInRadius(
      gridPos.row,
      gridPos.col,
      GAME_CONFIG.BOMB_SIZE,
      GAME_CONFIG.BOARD_SIZE,
      currentGridState,
      false // Show all cells in radius
    );

    setItemPreviewCells(previewCells);
  }, []);

  const handleItemDragEnd = useCallback((itemType, screenX, screenY) => {
    const currentBoardLayout = boardLayoutRef.current;
    const currentGridState = gridStateRef.current;

    setItemDragState(null);
    setItemPreviewCells(null);

    if (!currentBoardLayout || !currentGridState) return;

    // Get drop position
    const gridPos = touchToPlacement(screenX, screenY, [[1]], currentBoardLayout);

    if (!gridPos) return; // Invalid drop position

    // Use the item
    if (itemType === ITEM_TYPES.BOMB) {
      // Remove from inventory
      const newInventory = removeItemFromInventory(inventory, ITEM_TYPES.BOMB);
      if (!newInventory) return; // Safety check

      // Get cells to clear and animate using utility
      const { cellsToAnimate, clearedGrid } = useBombItem(
        currentGridState,
        gridPos.row,
        gridPos.col,
        GAME_CONFIG.BOMB_SIZE,
        GAME_CONFIG.BOARD_SIZE
      );

      setClearingCells(cellsToAnimate);

      // Clear after animation
      setTimeout(() => {
        setGridState(clearedGrid);
        setClearingCells(null);
      }, 400);

      setInventory(newInventory);
    }
  }, [inventory]);

  const handleRestart = useCallback(async () => {
    // Reset game state
    setScore(GAME_CONFIG.INITIAL_SCORE);
    setGridState(createEmptyGrid(GAME_CONFIG.BOARD_SIZE));
    setPieces(initializeGamePieces(3));
    setIsGameOver(false);
    setDragState(null);
    setPreviewCells(null);
    setPreviewValid(true);
    setClearingCells(null);
    setInventory({ [ITEM_TYPES.BOMB]: 0 });
    setItemDragState(null);
    setItemPreviewCells(null);
    setRedPiecesPlaced(0);

    // Reload max score in case it was updated
    const max = await getMaxScore();
    setMaxScore(max);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <ScoreCounter score={score} maxScore={maxScore} />
      </View>

      <View style={styles.gameAreaContainer}>
        <View style={styles.boardContainer}>
          <GameBoard
            ref={gameBoardRef}
            size={GAME_CONFIG.BOARD_SIZE}
            gridState={gridState}
            previewCells={previewCells}
            previewValid={previewValid}
            clearingCells={clearingCells}
            itemPreviewCells={itemPreviewCells}
            onLayout={getBoardLayout}
          />
        </View>

        <View style={styles.inventoryContainer}>
          <ItemInventory
            inventory={inventory}
            onItemDragStart={handleItemDragStart}
            onItemDragMove={handleItemDragMove}
            onItemDragEnd={handleItemDragEnd}
          />
        </View>
      </View>

      <View style={styles.pieceSelectorContainer}>
        <PieceSelector
          pieces={pieces}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        />
      </View>

      <NyanCat visible={showNyanCat} />

      <GameOverModal visible={isGameOver} score={score} onRestart={handleRestart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scoreContainer: {
    width: '100%',
    paddingHorizontal: 20,
    zIndex: 10,
    marginTop: 15,
    marginBottom: 40,
  },
  gameAreaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 40,
    width: '100%',
    paddingHorizontal: 10,
  },
  boardContainer: {
    // marginBottom moved to gameAreaContainer
  },
  inventoryContainer: {
    marginLeft: 15,
  },
  pieceSelectorContainer: {
    width: '100%',
  },
});
