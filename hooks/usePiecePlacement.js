import { useCallback } from 'react';

/**
 * Custom hook to manage piece placement on the grid
 * @param {Function} setGridState - State setter for the grid
 * @param {Function} setPieces - State setter for pieces array
 * @returns {Function} placePiece function that handles placement logic
 */
export const usePiecePlacement = (setGridState, setPieces) => {
  /**
   * Place a piece on the grid if placement is valid
   * @param {object} dragState - Final drag state with validity and affected cells
   * @param {object} piece - The piece being placed
   */
  const placePiece = useCallback((dragState, piece) => {
    // Check if placement was valid
    if (!dragState || !dragState.isValid || !dragState.affectedCells) {
      return false;
    }

    // Update grid state with placed piece
    setGridState(prevGrid => {
      const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
      dragState.affectedCells.forEach(({ row, col }) => {
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
  }, [setGridState, setPieces]);

  return placePiece;
};
