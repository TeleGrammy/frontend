// jest.config.cjs
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Transform files using babel-jest
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/src/tests'], // Specify the root directory for tests
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'], // Match test files
  extensionsToTreatAsEsm: ['.jsx'], // Treat .jsx files as ESM
};
