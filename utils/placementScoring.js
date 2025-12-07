import { GAME_CONFIG } from '../constants/gameConfig';

/**
 * Calculates the score awarded for placing a piece on the board.
 * Awards points based on the number of blocks in the piece.
 *
 * @param {Object} piece - The piece being placed
 * @param {number[][]} piece.shape - 2D array where 1 = filled block, 0 = empty
 * @returns {number} The score to award (10 points per block)
 */
export const calculatePlacementScore = (piece) => {
  let blockCount = 0;

  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col] === 1) {
        blockCount++;
      }
    }
  }

  return blockCount * GAME_CONFIG.PLACEMENT_POINTS_PER_BLOCK;
};
