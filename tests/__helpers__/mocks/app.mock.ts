//* Mock environment configuration for application tests
export const mockAppEnv = {
  env: {
    HOST: 'localhost',
    PORT: 3000,
    PREFIX: '/api/v1',
    ALLOWED_ORIGINS: ['http://localhost:3000'],
    NODE_ENV: 'test',
    LOG_LEVEL: 'error'
  },
  isDevelopment: false,
  isProduction: false,
  isTest: true
}

//* Mock environment configuration for development mode
export const mockDevelopmentEnv = {
  env: {
    HOST: 'localhost',
    PORT: 3000,
    PREFIX: '/api/v1',
    ALLOWED_ORIGINS: ['http://localhost:3000'],
    NODE_ENV: 'development',
    LOG_LEVEL: 'debug'
  },
  isDevelopment: true,
  isProduction: false,
  isTest: false
}

//* Mock environment configuration for production mode
export const mockProductionEnv = {
  env: {
    HOST: '0.0.0.0',
    PORT: 8000,
    PREFIX: '/api/v1',
    ALLOWED_ORIGINS: ['https://app.example.com'],
    NODE_ENV: 'production',
    LOG_LEVEL: 'warn'
  },
  isDevelopment: false,
  isProduction: true,
  isTest: false
}

//* Helper to mock the environment config module
export function mockEnvironmentConfig(config = mockAppEnv): void {
  jest.doMock('@/shared/config/env', () => config)
}

//* Mock console functions for testing
export const mockConsole = {
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}

//* Mock process functions for testing
export const mockProcess = {
  exit: jest.fn().mockImplementation(() => {
    throw new Error('Process exit')
  })
}

//* Helper to setup common mocks for tests
export function setupCommonMocks(): {
  mockExit: jest.SpyInstance
  mockConsoleError: jest.SpyInstance
} {
  const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('Process exit')
  })

  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation()

  return {
    mockExit,
    mockConsoleError
  }
}

//* Helper to cleanup mocks after tests
export function cleanupMocks(mocks: jest.SpyInstance[]): void {
  mocks.forEach((mock) => mock.mockRestore())
}
