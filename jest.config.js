module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|expo|@expo|react-native-gesture-handler|react-native-reanimated|react-native-worklets)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: [
    'screens/**/*.{js,jsx}',
    'components/**/*.{js,jsx}',
    'utils/**/*.{js,jsx}',
    '!**/__tests__/**',
    '!**/node_modules/**',
  ],
  testMatch: [
    '**/__tests__/**/*.(test|spec).js?(x)',
    '**/?(*.)+(spec|test).js?(x)',
  ],
};
