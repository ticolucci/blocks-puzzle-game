import { rotateMatrix } from './pieceRotation';
import { PIECE_SHAPES } from '../constants/gameConfig';

const ROTATION_ANGLES = [0, 90, 180, 270];

// Cache for the piece library
let cachedLibrary = null;

// Counter for unique runtime IDs
let nextRuntimeId = 0;

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

/**
 * Gets the piece library with lazy initialization and caching
 * @returns {Array} Cached piece library
 */
export function getPieceLibrary() {
  if (!cachedLibrary) {
    cachedLibrary = generatePieceLibrary();
  }
  return cachedLibrary;
}

/**
 * Gets N random pieces from the library with unique runtime IDs
 * @param {number} count - Number of random pieces to select
 * @param {boolean} shuffle - If true, shuffle library once; if false, pick randomly (default: false)
 * @returns {Array} Array of random pieces with runtime IDs
 */
export function getRandomPieces(count, shuffle = false) {
  const library = getPieceLibrary();

  if (shuffle) {
    // Shuffle the entire library once, then take first N pieces (repeating if needed)
    const shuffled = [...library].sort(() => Math.random() - 0.5);
    return Array.from({ length: count }, (_, i) => {
      const libraryPiece = shuffled[i % shuffled.length];
      return {
        ...libraryPiece,
        shape: libraryPiece.shape.map(row => [...row]), // Deep clone shape array
        runtimeId: nextRuntimeId++,
      };
    });
  }

  // Pick randomly for each piece
  return Array.from({ length: count }, () => {
    const randomIndex = Math.floor(Math.random() * library.length);
    const libraryPiece = library[randomIndex];

    return {
      ...libraryPiece,
      shape: libraryPiece.shape.map(row => [...row]), // Deep clone shape array
      runtimeId: nextRuntimeId++,
    };
  });
}
