export const GAME_CONFIG = {
  BOARD_SIZE: 10,
  CELL_SIZE: 29,
  MAX_PIECE_SIZE: 5,
  SELECTOR_SCALE: 0.65, // Scale factor for piece previews in selector (% of gameplay size)
  INITIAL_SCORE: 0,
  LINE_CLEAR_BASE_POINTS: 1000,
  HIGH_SCORES_KEY: 'high_scores',
  MAX_HIGH_SCORES: 3,
  PLAYER_NAME_LENGTH: 3,
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

export const COLOR_POOL = [
  '#FF0000', // red
  '#0000FF', // blue
  '#00FF00', // green
  '#FFFF00', // yellow
  '#800080', // purple
  '#FFC0CB', // pink
];

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
