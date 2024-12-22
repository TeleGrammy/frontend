export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Use Babel to transform JS/JSX files
  },
  extensionsToTreatAsEsm: ['.jsx'], // Treat these file extensions as ESM
  transformIgnorePatterns: ['/node_modules/'], // Ignore transforming node_modules
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1', // Correct mapping for `src/` alias
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/mocks/fileMock.js', // Mock image files
    '\\.(css|scss)$': 'identity-obj-proxy', // Mock CSS modules
  },
};
