import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  globals: {
    'process.env.NODE_ENV': 'test',
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.spec.json'
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    "^uuid$": "<rootDir>/__mocks__/uuid.js",
    "^react-date-picker$": "<rootDir>/__mocks__/react-date-picker.js",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(uuid|nanoid|@?react|@?redux|@?testing-library)/)',
  ],
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
