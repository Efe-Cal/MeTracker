// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(() => Promise.resolve({
    execAsync: jest.fn(),
    getAllAsync: jest.fn(() => Promise.resolve([])),
    getFirstAsync: jest.fn(),
    runAsync: jest.fn(),
    closeAsync: jest.fn(),
    closeSync: jest.fn(),
  })),
}));
