# Blocks Puzzle Game - Architecture Documentation

## Overview

This is a puzzle game where players place tetris-like pieces on a canvas until no more pieces can fit. The application is built with React Native using Expo for cross-platform mobile development.

## Application Structure

### Entry Point

- **index.js**: The application entry point that loads the Expo app
- **App.js**: Main application component that sets up navigation

### Navigation Architecture

The app uses a stack-based navigation pattern with two main screens:

```
NavigationContainer
└── Stack Navigator
    ├── Home Screen (initial route)
    └── Game Screen
```

**Navigation Flow:**
1. App starts at Home Screen
2. User taps "New Game" button
3. Navigates to Game Screen

### Screens

#### HomeScreen (`screens/HomeScreen.js`)

The landing screen of the application.

**Responsibilities:**
- Display the main menu
- Provide entry point to start a new game
- Currently contains a single "New Game" button centered on screen

**Navigation:**
- Navigates to GameScreen when "New Game" is pressed

#### GameScreen (`screens/GameScreen.js`)

The main game screen (currently empty).

**Responsibilities:**
- Will contain the game canvas
- Will handle piece placement logic
- Will manage game state (score, remaining moves, etc.)
- Currently displays an empty view as a placeholder

**Future Implementation:**
- Game board/canvas component
- Piece selection UI
- Game state management
- Score display
- Game over detection

## File Structure

```
blocks-puzzle-game/
├── App.js                    # Navigation setup and app configuration
├── screens/                  # All screen components
│   ├── HomeScreen.js        # Main menu screen
│   └── GameScreen.js        # Game play screen
├── package.json             # Project dependencies
├── babel.config.js          # Babel configuration
├── app.json                 # Expo app metadata
├── index.js                 # App entry point
└── docs/                    # Documentation
    └── architecture.md      # This file
```

## Component Communication

### Current Flow

```
App.js
  └── Provides navigation context
      ├── HomeScreen
      │   └── Uses navigation.navigate('Game') to transition
      └── GameScreen
          └── Receives navigation prop for future back navigation
```

## Future Extension Points

### Game Logic (Not Yet Implemented)

The following components/features will need to be added:

1. **Game Board Component**
   - Render grid/canvas for piece placement
   - Handle touch interactions for piece positioning
   - Validate piece placement

2. **Piece Generator**
   - Generate random tetris-like pieces
   - Define piece shapes and rotations
   - Manage piece queue

3. **Game State Management**
   - Track placed pieces on board
   - Calculate remaining valid moves
   - Detect game over condition
   - Score calculation

4. **UI Components**
   - Current piece preview
   - Next pieces queue
   - Score display
   - Game over modal
   - Reset/new game functionality

### Suggested Directory Structure for Future

```
blocks-puzzle-game/
├── screens/              # Screen components
├── components/           # Reusable UI components
│   ├── GameBoard.js
│   ├── Piece.js
│   └── ScoreDisplay.js
├── utils/               # Game logic utilities
│   ├── pieceGenerator.js
│   ├── boardValidator.js
│   └── scoreCalculator.js
└── context/            # State management
    └── GameContext.js
```

## Design Patterns

### Navigation Pattern
- **Stack Navigation**: Allows users to navigate forward to game screen and back to home
- **Screen Props**: Navigation object passed to each screen for routing control

### Component Pattern
- **Functional Components**: All components use React functional components with hooks
- **StyleSheet**: React Native StyleSheet API for consistent styling

## Development Guidelines

### Adding New Screens

1. Create new screen component in `screens/` directory
2. Import screen in `App.js`
3. Add new `Stack.Screen` component in the navigator
4. Update navigation calls in existing screens as needed

### Adding Game Features

1. Game logic should be separated from UI components
2. Consider using Context API or state management library for game state
3. Keep components focused on single responsibilities
4. Place reusable game logic in `utils/` directory (to be created)

## Configuration

- **app.json**: Contains app name and display name
- **babel.config.js**: Babel preset for React Native
- **package.json**:
  - Uses Expo SDK ~50.0.0
  - React Navigation for screen management
  - Safe area context for proper mobile rendering
