module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Use Babel to transform JS/JSX files
  },
  transformIgnorePatterns: ['/node_modules/'], // Ensure node_modules are ignored
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1', // Correct mapping for `src/` alias
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/mocks/fileMock.js', // Mock image files
    '\\.(css|scss)$': 'identity-obj-proxy', // Mock CSS modules
  },
};
