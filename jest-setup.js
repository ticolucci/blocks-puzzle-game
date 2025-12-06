// @testing-library/react-native v12.4+ includes built-in matchers (no need to import extend-expect)

// Mock expo modules
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));
