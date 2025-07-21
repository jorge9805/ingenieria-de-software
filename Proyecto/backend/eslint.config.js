import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    },
    rules: {
      // Reglas de calidad de código
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'no-console': 'off', // Permitir console.log en desarrollo
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'warn',
      'prefer-template': 'warn',

      // Reglas de estilo
      'indent': ['error', 2],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'eol-last': ['error', 'always'],
      'no-trailing-spaces': 'error',

      // Reglas específicas para Node.js
      'no-process-exit': 'warn',
      'handle-callback-err': 'warn',

      // Reglas de seguridad
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',

      // Mejores prácticas
      'curly': 'error',
      'eqeqeq': ['error', 'always'],
      'no-alert': 'warn',
      'no-caller': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-iterator': 'error',
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',
      'no-multi-str': 'error',
      'no-new': 'error',
      'no-proto': 'error',
      'no-script-url': 'error',
      'no-sequences': 'error',
      'wrap-iife': 'error',
      'yoda': 'error'
    }
  },
  {
    // Configuración específica para archivos de prueba
    files: ['**/__tests__/**/*.js', '**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    rules: {
      // Relajar algunas reglas para tests
      'no-unused-expressions': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off'
    }
  },
  {
    // Ignorar ciertos archivos
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.min.js'
    ]
  }
];
