/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'commonjs',
          target: 'ES2022'
        }
      }
    ]
  },
  moduleNameMapper: {
    // HTTP infrastructure aliases (must come before generic @/)
    '^@/http/handlers/(.*)$': '<rootDir>/src/infrastructure/http/handlers/$1',
    '^@/http/handlers$': '<rootDir>/src/infrastructure/http/handlers',
    '^@/http/hooks/(.*)$': '<rootDir>/src/infrastructure/http/hooks/$1',
    '^@/http/hooks$': '<rootDir>/src/infrastructure/http/hooks',
    '^@/http/plugins/(.*)$': '<rootDir>/src/infrastructure/http/plugins/$1',
    '^@/http/plugins$': '<rootDir>/src/infrastructure/http/plugins',
    '^@/http/config/(.*)$': '<rootDir>/src/infrastructure/http/config/$1',
    '^@/http/config$': '<rootDir>/src/infrastructure/http/config',
    // Domain-specific aliases
    '^@/application/(.*)$': '<rootDir>/src/application/$1',
    '^@/domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@/infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@/presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1',
    // Generic alias (must come last)
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/**/index.ts',
    '!src/server.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
  testTimeout: 10000,
  detectOpenHandles: true,
  forceExit: true,
  maxWorkers: 1,
  workerIdleMemoryLimit: '512MB'
}

module.exports = config
