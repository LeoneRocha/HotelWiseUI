import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.spec.json' // Referência ao tsconfig.spec.json
    }],
    '^.+\\.jsx?$': 'babel-jest'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx',
    // Excluir
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.tsx',
    '!src/**/reportWebVitals.ts',
    '!src/**/setupTests.ts',
    '!src/**/*.{service,constant,interface,model}.ts',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  coverageReporters: ['html', 'lcov', 'text-summary'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/',
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '<rootDir>/coverage/junit',
      outputName: 'test-results.xml'
    }],
    ['jest-html-reporter', {
      pageTitle: 'Test Report',
      outputPath: '<rootDir>/coverage/html/test-report.html',
      includeFailureMsg: true,
      includeConsoleLog: true
    }]
  ],
};

export default config;
