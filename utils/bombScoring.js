import { GAME_CONFIG } from '../constants/gameConfig';

/**
 * Calculates the score awarded for blocks destroyed by a bomb explosion.
 * Awards points based on the number of blocks destroyed.
 *
 * @param {number} destroyedBlockCount - Number of blocks destroyed by the bomb
 * @returns {number} The score to award (10 points per block destroyed)
 */
export const calculateBombDestructionScore = (destroyedBlockCount) => {
  return destroyedBlockCount * GAME_CONFIG.PLACEMENT_POINTS_PER_BLOCK;
};
