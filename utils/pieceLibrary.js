import { rotateMatrix } from './pieceRotation';
import { PIECE_SHAPES } from '../constants/gameConfig';

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

/**
 * Generates the complete piece library with all shapes and rotations
 * @returns {Array} Array of all pieces (13 shapes × 4 rotations = 52 pieces)
 */
export function generatePieceLibrary() {
  const library = Object.entries(PIECE_SHAPES).flatMap(([shapeName, shape]) =>
    generateRotations(shapeName, shape)
  );

  // Sort by shape name, then by rotation for predictable ordering
  return library.sort((a, b) => {
    if (a.shapeName !== b.shapeName) {
      return a.shapeName.localeCompare(b.shapeName);
    }
    return a.rotation - b.rotation;
  });
}
