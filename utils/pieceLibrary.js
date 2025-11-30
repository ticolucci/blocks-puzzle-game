import { rotateMatrix } from './pieceRotation';

const ROTATION_ANGLES = [0, 90, 180, 270];

/**
 * Generates all 4 rotation variants for a given shape
 * @param {string} shapeName - Name of the shape
 * @param {number[][]} shape - 2D array representing the shape
 * @returns {Array} Array of 4 pieces with rotation metadata
 */
export function generateRotations(shapeName, shape) {
  return ROTATION_ANGLES.map((degrees, index) => ({
    id: `${shapeName}_${degrees}`,
    shapeName,
    shape: rotateMatrix(shape, degrees),
    rotation: degrees,
    rotationIndex: index,
  }));
}
