export const PIECE_TYPES = {
  NORMAL: 'normal',
  BOMB: 'bomb',
  RAINBOW: 'rainbow',
};

export const GAME_CONFIG = {
  BOARD_SIZE: 10,
  CELL_SIZE: 29,
  MAX_PIECE_SIZE: 5,
  SELECTOR_SCALE: 0.65, // Scale factor for piece previews in selector (% of gameplay size)
  INITIAL_SCORE: 0,
  LINE_CLEAR_BASE_POINTS: 1000,
  PLACEMENT_POINTS_PER_BLOCK: 10,
  HIGH_SCORES_KEY: 'high_scores',
  MAX_HIGH_SCORES: 3,
  PLAYER_NAME_LENGTH: 3,
  BOMB_SIZE: 5, // Size of square area for bomb clearing (odd numbers only - e.g., 3=3x3, 5=5x5)
  RED_PIECES_FOR_BOMB: 1, // Number of red pieces needed to generate a bomb
  RAINBOW_PROBABILITY: 0.1, // 10% chance to generate a rainbow piece
  NYAN_CAT_ANIMATION_DURATION: 2000, // Nyan cat animation duration in milliseconds
  NYAN_CAT_START_POSITION: -200, // Starting X position (off-screen left)
  NYAN_CAT_END_POSITION: 500, // Ending X position (off-screen right)
  NYAN_CAT_VERTICAL_POSITION: '40%', // Vertical position on screen
};

export const COLORS = {
  GRID_BORDER: '#333',
  CELL_BORDER: '#ccc',
  CELL_BACKGROUND: '#fff',
  CELL_FILLED: '#4A90E2',
  CELL_CLEARING: '#FFD700', // Gold color for clearing animation
  PREVIEW_VALID: 'rgba(76, 175, 80, 0.3)', // Green with 30% opacity
  PREVIEW_INVALID: 'rgba(244, 67, 54, 0.3)', // Red with 30% opacity
  RED: '#FF0000',
  BLUE: '#0000FF',
  GREEN: '#00FF00',
  YELLOW: '#FFFF00',
  PURPLE: '#800080',
  PINK: '#FFC0CB',
};

export const COLOR_POOL = [
  COLORS.RED,
  COLORS.BLUE,
  '#00FF00', // green
  '#FFFF00', // yellow
  '#800080', // purple
  '#FFC0CB', // pink
];

export const RAINBOW_COLORS = [
  '#FF0000', // Red
  '#FFA500', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#0000FF', // Blue
  '#4B0082', // Indigo
];

// SVG IDs for piece rendering
export const SVG_IDS = {
  // Normal piece colors
  SOLID_RED: 'solid-red',
  SOLID_BLUE: 'solid-blue',
  SOLID_GREEN: 'solid-green',
  SOLID_YELLOW: 'solid-yellow',
  SOLID_PURPLE: 'solid-purple',
  SOLID_PINK: 'solid-pink',

  // Rainbow colors
  RAINBOW_RED: 'rainbow-red',
  RAINBOW_ORANGE: 'rainbow-orange',
  RAINBOW_YELLOW: 'rainbow-yellow',
  RAINBOW_GREEN: 'rainbow-green',
  RAINBOW_BLUE: 'rainbow-blue',

  // Special pieces
  SOLID_GREY: 'solid-grey',
};

// Pool of SVG IDs for random piece generation
export const SVG_ID_POOL = [
  SVG_IDS.SOLID_RED,
  SVG_IDS.SOLID_BLUE,
  SVG_IDS.SOLID_GREEN,
  SVG_IDS.SOLID_YELLOW,
  SVG_IDS.SOLID_PURPLE,
  SVG_IDS.SOLID_PINK,
];

// Rainbow piece SVG sequence (5x1 piece uses these in order)
export const RAINBOW_SVG_SEQUENCE = [
  SVG_IDS.RAINBOW_RED,
  SVG_IDS.RAINBOW_ORANGE,
  SVG_IDS.RAINBOW_YELLOW,
  SVG_IDS.RAINBOW_GREEN,
  SVG_IDS.RAINBOW_BLUE,
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
