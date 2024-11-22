import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/'
  ],

  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      configFile: true, 
      sourceMaps: true,
      tsconfig: '<rootDir>/tsconfig.spec.json' // Referencia ao tsconfig.spec.json
    }],
    '^.+\\.(js|jsx)$': ['babel-jest',{
      configFile: true, 
      sourceMaps: true,
      tsconfig: '<rootDir>/tsconfig.spec.json' // Referencia ao tsconfig.spec.json
    }],
  }, 
  collectCoverageFrom: [
    'src/**/*.ts', // Inclui todos os arquivos TypeScript na pasta src
    'src/**/*.tsx', // Inclui todos os arquivos TSX (React) na pasta src
    '!**/*.d.ts', // Exclui arquivos de definição de tipos
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
