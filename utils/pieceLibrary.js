import { PIECE_TYPES, GAME_CONFIG, SVG_ID_POOL } from '../constants/gameConfig';
import { getRandomElement } from './arrayHelpers';

// Hardcoded piece library with all rotations pre-calculated
const PIECE_LIBRARY = [
  {
    "id": "L_LEFT_0",
    "shapeName": "L_LEFT",
    "shape": [[1, 0, 0], [1, 1, 1]],
  },
  {
    "id": "L_LEFT_90",
    "shapeName": "L_LEFT",
    "shape": [[1, 1], [1, 0], [1, 0]],
  },
  {
    "id": "L_RIGHT_0",
    "shapeName": "L_RIGHT",
    "shape": [[0, 0, 1], [1, 1, 1]],
  },
  {
    "id": "L_RIGHT_90",
    "shapeName": "L_RIGHT",
    "shape": [[1, 0], [1, 0], [1, 1]],
  },
  {
    "id": "L_SHAPE_2X2_0",
    "shapeName": "L_SHAPE_2X2",
    "shape": [[1, 0], [0, 1]],
  },
  {
    "id": "L_SHAPE_2X2_90",
    "shapeName": "L_SHAPE_2X2",
    "shape": [[0, 1], [1, 0]],
  },
  {
    "id": "LINE_2_0",
    "shapeName": "LINE_2",
    "shape": [[1, 1]],
  },
  {
    "id": "LINE_2_90",
    "shapeName": "LINE_2",
    "shape": [[1], [1]],
  },
  {
    "id": "LINE_4_0",
    "shapeName": "LINE_4",
    "shape": [[1, 1, 1, 1]],
  },
  {
    "id": "LINE_4_90",
    "shapeName": "LINE_4",
    "shape": [[1], [1], [1], [1]],
  },
  {
    "id": "LINE_4_180",
    "shapeName": "LINE_4",
    "shape": [[1, 1, 1, 1]],
  },
  {
    "id": "LINE_5_0",
    "shapeName": "LINE_5",
    "shape": [[1, 1, 1, 1, 1]],
  },
  {
    "id": "LINE_5_90",
    "shapeName": "LINE_5",
    "shape": [[1], [1], [1], [1], [1]],
  },
  {
    "id": "LINE_5_180",
    "shapeName": "LINE_5",
    "shape": [[1, 1, 1, 1, 1]],
  },
  {
    "id": "RECT_3X2_0",
    "shapeName": "RECT_3X2",
    "shape": [[1, 1], [1, 1], [1, 1]],
  },
  {
    "id": "RECT_3X2_90",
    "shapeName": "RECT_3X2",
    "shape": [[1, 1, 1], [1, 1, 1]],
  },
  {
    "id": "RECT_3X2_180",
    "shapeName": "RECT_3X2",
    "shape": [[1, 1], [1, 1], [1, 1]],
  },
  {
    "id": "RECT_3X2_270",
    "shapeName": "RECT_3X2",
    "shape": [[1, 1, 1], [1, 1, 1]],
  },
  {
    "id": "SINGLE_0",
    "shapeName": "SINGLE",
    "shape": [[1]],
  },
  {
    "id": "SINGLE_90",
    "shapeName": "SINGLE",
    "shape": [[1]],
  },
  {
    "id": "SQUARE_2X2_0",
    "shapeName": "SQUARE_2X2",
    "shape": [[1, 1], [1, 1]],
  },
  {
    "id": "SQUARE_2X2_90",
    "shapeName": "SQUARE_2X2",
    "shape": [[1, 1], [1, 1]],
  },
  {
    "id": "SQUARE_2X2_180",
    "shapeName": "SQUARE_2X2",
    "shape": [[1, 1], [1, 1]],
  },
  {
    "id": "SQUARE_2X2_270",
    "shapeName": "SQUARE_2X2",
    "shape": [[1, 1], [1, 1]],
  },
  {
    "id": "SQUARE_3X3_0",
    "shapeName": "SQUARE_3X3",
    "shape": [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
  },
  {
    "id": "SQUARE_3X3_90",
    "shapeName": "SQUARE_3X3",
    "shape": [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
  },
  {
    "id": "T_SHAPE_0",
    "shapeName": "T_SHAPE",
    "shape": [[0, 1, 0], [1, 1, 1]],
  },
  {
    "id": "T_SHAPE_90",
    "shapeName": "T_SHAPE",
    "shape": [[1, 0], [1, 1], [1, 0]],
  },
  {
    "id": "T_SHAPE_180",
    "shapeName": "T_SHAPE",
    "shape": [[1, 1, 1], [0, 1, 0]],
  },
  {
    "id": "T_SHAPE_270",
    "shapeName": "T_SHAPE",
    "shape": [[0, 1], [1, 1], [0, 1]],
  },
  {
    "id": "Z_LEFT_0",
    "shapeName": "Z_LEFT",
    "shape": [[1, 0], [1, 1], [0, 1]],
  },
  {
    "id": "Z_LEFT_270",
    "shapeName": "Z_LEFT",
    "shape": [[0, 1, 1], [1, 1, 0]],
  },
  {
    "id": "Z_RIGHT_0",
    "shapeName": "Z_RIGHT",
    "shape": [[0, 1], [1, 1], [1, 0]],
  },
  {
    "id": "Z_RIGHT_90",
    "shapeName": "Z_RIGHT",
    "shape": [[1, 1, 0], [0, 1, 1]],
  },
  {
    "id": "Z_RIGHT_180",
    "shapeName": "Z_RIGHT",
    "shape": [[0, 1], [1, 1], [1, 0]],
  },
  {
    "id": "Z_RIGHT_270",
    "shapeName": "Z_RIGHT",
    "shape": [[1, 1, 0], [0, 1, 1]],
  }
];

// Cache for the piece library (not used with hardcoded library, but kept for API compatibility)
let cachedLibrary = null;

// Counter for unique runtime IDs
let nextRuntimeId = 0;

/**
 * Gets a random SVG ID from the SVG_ID_POOL
 * @returns {string} A random SVG ID
 */
function getRandomSvgId() {
  return getRandomElement(SVG_ID_POOL);
}

/**
 * Generates SVG reference array for a piece shape
 * For normal pieces: all cells get the same SVG ID
 * @param {number[][]} shape - 2D shape array
 * @param {string} svgId - SVG ID to use for all cells
 * @returns {string[]} Array of SVG IDs (one per filled cell)
 */
function generateSvgRefsForShape(shape, svgId) {
  const svgRefs = [];
  shape.forEach(row => {
    row.forEach(cell => {
      if (cell === 1) {
        svgRefs.push(svgId);
      }
    });
  });
  return svgRefs;
}

/**
 * Gets the piece library (hardcoded for performance)
 * @returns {Array} Piece library
 */
export function getPieceLibrary() {
  return PIECE_LIBRARY;
}

/**
 * Gets N random pieces from the library with unique runtime IDs
 * @param {number} count - Number of random pieces to select
 * @param {number} rainbowProbability - Probability (0-1) of generating a rainbow piece (defaults to GAME_CONFIG.RAINBOW_PROBABILITY)
 * @returns {Array} Array of random pieces with runtime IDs
 */
export function getRandomPieces(count, rainbowProbability = GAME_CONFIG.RAINBOW_PROBABILITY) {
  const library = getPieceLibrary();

  // Pick randomly for each piece
  return Array.from({ length: count }, () => {
    // Decide if this piece should be a rainbow piece
    if (Math.random() < rainbowProbability) {
      return createRainbowPiece();
    }

    const randomIndex = Math.floor(Math.random() * library.length);
    const libraryPiece = library[randomIndex];
    const svgId = getRandomSvgId();

    return {
      ...libraryPiece,
      shape: libraryPiece.shape.map(row => [...row]), // Deep clone shape array
      runtimeId: nextRuntimeId++,
      svgRefs: generateSvgRefsForShape(libraryPiece.shape, svgId),
      type: PIECE_TYPES.NORMAL,
    };
  });
}

/**
 * Initialize pieces for game with placement tracking
 * @param {number} count - Number of pieces to generate
 * @param {number} rainbowProbability - Probability (0-1) of generating a rainbow piece (defaults to GAME_CONFIG.RAINBOW_PROBABILITY)
 * @returns {Array} Array of pieces with isPlaced set to false
 */
export function initializeGamePieces(count, rainbowProbability = GAME_CONFIG.RAINBOW_PROBABILITY) {
  return getRandomPieces(count, rainbowProbability).map(piece => ({
    ...piece,
    isPlaced: false,
  }));
}

/**
 * Checks if all pieces in the array have been placed
 * @param {Array} pieces - Array of piece objects
 * @returns {boolean} True if all pieces are placed, false otherwise
 */
export function areAllPiecesPlaced(pieces) {
  return pieces.every(piece => piece.isPlaced);
}

/**
 * Creates a bomb piece
 * @returns {Object} A bomb piece object
 */
export function createBombPiece() {
  const { SVG_IDS } = require('../constants/gameConfig');
  return {
    runtimeId: nextRuntimeId++,
    id: 'BOMB_1X1_0',
    shapeName: 'BOMB',
    shape: [[1]],
    svgRefs: [SVG_IDS.SOLID_GREY],
    type: PIECE_TYPES.BOMB,
  };
}

/**
 * Creates a rainbow piece (5x1 horizontal line)
 * @returns {Object} A rainbow piece object
 */
export function createRainbowPiece() {
  const { RAINBOW_SVG_SEQUENCE } = require('../constants/gameConfig');
  return {
    runtimeId: nextRuntimeId++,
    id: 'RAINBOW_5X1_0',
    shapeName: 'RAINBOW',
    shape: [[1, 1, 1, 1, 1]],
    svgRefs: [...RAINBOW_SVG_SEQUENCE],
    type: PIECE_TYPES.RAINBOW,
  };
}
