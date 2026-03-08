/**
 * Jest configuration for monorepo
 * Uses projects to delegate testing to each workspace
 */
module.exports = {
  projects: ['<rootDir>/apps/*/jest.config.js'],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'apps/**/src/**/*.{ts,tsx}',
    '!apps/**/src/**/*.d.ts',
    '!apps/**/src/**/*.test.ts',
    '!apps/**/src/**/*.spec.ts',
  ],
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/lib/', '<rootDir>/node_modules/'],
  verbose: true,
};