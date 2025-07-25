// Jest Configuration for Colombia Raices
module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/helpers/testSetup.js'],
  
  // Coverage configuration
  collectCoverageFrom: [
    'main/**/*.js',
    '!main/electron.js',
    '!main/database/migrations/**',
    '!main/database/seeders/**',
    '!**/node_modules/**'
  ],
    // Module paths
  moduleFileExtensions: ['js', 'json', 'jsx'],
  
  // Module name mapping
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/renderer/src/$1',
    '^@utils/(.*)$': '<rootDir>/renderer/src/utils/$1',
    '^@hooks/(.*)$': '<rootDir>/renderer/src/hooks/$1',
    '^@components/(.*)$': '<rootDir>/renderer/src/components/$1'
  },
  
  // Transform files
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/data/',
    '/dist/',
    '/build/',
    '/ready-to-test/'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Verbose output
  verbose: true,
  
  // Test timeout
  testTimeout: 10000
};
