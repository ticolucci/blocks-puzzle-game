import { useState } from 'react';
import { screenToGridPosition } from '../utils/gridCoordinates';
import { canPlacePiece, getAffectedCells } from '../utils/placementValidation';

/**
 * Custom hook to manage drag and drop state and handlers with full validation
 * @param {object} boardLayout - Board layout with position and dimensions
 * @param {Array} gridState - Current grid state
 * @param {number} boardSize - Size of the board
 * @returns {{
 *   dragState: object | null,
 *   previewCells: Array | null,
 *   previewValid: boolean,
 *   handleDragStart: Function,
 *   handleDragMove: Function,
 *   handleDragEnd: Function
 * }}
 */
export const useDragHandlers = (boardLayout, gridState, boardSize) => {
  const [dragState, setDragState] = useState(null);
  const [previewCells, setPreviewCells] = useState(null);
  const [previewValid, setPreviewValid] = useState(true);

  /**
   * Handle the start of a drag operation
   * @param {object} piece - The piece being dragged
   */
  const handleDragStart = (piece) => {
    setDragState({ piece });
    setPreviewCells(null);
    setPreviewValid(true);
  };

  /**
   * Handle drag movement with coordinate conversion and validation
   * @param {object} piece - The piece being dragged
   * @param {number} screenX - The X coordinate on screen
   * @param {number} screenY - The Y coordinate on screen
   */
  const handleDragMove = (piece, screenX, screenY) => {
    if (!boardLayout || !gridState) {
      return;
    }

    // Convert screen coordinates to grid position
    const gridPosition = screenToGridPosition(screenX, screenY, boardLayout);

    if (!gridPosition) {
      // Outside grid bounds
      setPreviewCells(null);
      setPreviewValid(false);
      setDragState({ piece, currentX: screenX, currentY: screenY, isValid: false });
      return;
    }

    // Validate placement
    const validation = canPlacePiece(piece, gridPosition.row, gridPosition.col, gridState, boardSize);

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
  };

  /**
   * Handle the end of a drag operation
   * Returns the drag state for the caller to process placement
   * @param {object} piece - The piece being dragged
   * @returns {object | null} Final drag state with placement info
   */
  const handleDragEnd = (piece) => {
    const finalDragState = dragState;

    // Clear drag state and preview
    setDragState(null);
    setPreviewCells(null);
    setPreviewValid(true);

    return finalDragState;
  };

  return {
    dragState,
    previewCells,
    previewValid,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
};
