const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  {
    ignores: ['node_modules/**', 'lib/**', 'coverage/**', 'dist/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
    },
    rules: {
      ...tseslint.configs['eslint-recommended']?.rules,
      ...tseslint.configs['recommended']?.rules,
      ...prettierConfig.rules,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/no-explicit-any': 1,
      'no-console': 0,
      'prettier/prettier': 1,
    },
  },
  {
    files: ['src/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/application/**', '**/application'],
              message: 'Domain must not import from the Application layer.',
            },
            {
              group: ['**/infrastructure/**', '**/infrastructure'],
              message: 'Domain must not import from the Infrastructure layer.',
            },
            {
              group: ['axios', 'node-fetch', 'cheerio'],
              message: 'Domain is strictly forbidden from importing third-party infrastructure packages.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/application/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/infrastructure/**', '**/infrastructure'],
              message: 'Application must not import from the Infrastructure layer.',
            },
          ],
        },
      ],
    },
  },
];
