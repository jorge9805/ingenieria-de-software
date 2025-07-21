import { testUtils } from './testUtils.js';

// Configuración global para todos los tests
beforeAll(async () => {
  console.log('🧪 Configurando entorno de pruebas...');
});

afterAll(async () => {
  console.log('🧹 Limpiando entorno de pruebas...');
  await testUtils.closeDatabase();
});

// Jest configuration para manejar módulos ES6
export const jestConfig = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testMatch: [
    '**/__tests__/**/*.test.js'
  ],
  collectCoverageFrom: [
    '../routes/*.js',
    '../middleware/*.js',
    '!**/__tests__/**',
    '!**/node_modules/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  verbose: true,
  forceExit: true,
  detectOpenHandles: true
};
