export const GAME_CONFIG = {
  BOARD_SIZE: 10,
  CELL_SIZE: 22,
  MAX_PIECE_SIZE: 5,
  INITIAL_SCORE: 0,
  LINE_CLEAR_BASE_POINTS: 1000,
};

export const COLORS = {
  GRID_BORDER: '#333',
  CELL_BORDER: '#ccc',
  CELL_BACKGROUND: '#fff',
  CELL_FILLED: '#4A90E2',
  CELL_CLEARING: '#FFD700', // Gold color for clearing animation
  PREVIEW_VALID: 'rgba(76, 175, 80, 0.3)', // Green with 30% opacity
  PREVIEW_INVALID: 'rgba(244, 67, 54, 0.3)', // Red with 30% opacity
};

export const PIECE_SHAPES = {
  SQUARE_2X2: [[1, 1], [1, 1]],

  // L-shape (2x2)
  L_SHAPE_2X2: [
    [1, 0],
    [0, 1]
  ],

  // 3x3 Square
  SQUARE_3X3: [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
  ],

  // Vertical 3x2 rectangle
  RECT_3X2: [
    [1, 1],
    [1, 1],
    [1, 1]
  ],

  // Horizontal line (5 blocks)
  LINE_5: [[1, 1, 1, 1, 1]],

  // Horizontal line (4 blocks)
  LINE_4: [[1, 1, 1, 1]],

  // Horizontal line (2 blocks)
  LINE_2: [[1, 1]],

  // Single block
  SINGLE: [[1]],

  // Z-shape left
  Z_LEFT: [
    [1, 0],
    [1, 1],
    [0, 1]
  ],

  // Z-shape right
  Z_RIGHT: [
    [0, 1],
    [1, 1],
    [1, 0]
  ],

  // T-shape
  T_SHAPE: [
    [0, 1, 0],
    [1, 1, 1]
  ],

  // L-shape left
  L_LEFT: [
    [1, 0, 0],
    [1, 1, 1]
  ],

  // L-shape right
  L_RIGHT: [
    [0, 0, 1],
    [1, 1, 1]
  ],
};
