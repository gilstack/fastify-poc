//* Store original environment
export const originalEnv = process.env

//* Base environment variables required for all tests
export const baseEnvVars = {
  JWT_SECRET: 'super-secret-jwt-key-with-32-chars-minimum',
  DATABASE_URL: 'postgresql://user:pass@localhost:5432/testdb',
  EMAIL_HOST: 'smtp.example.com',
  EMAIL_PORT: '587',
  EMAIL_USER: 'test@example.com',
  EMAIL_PASS: 'test-password',
  EMAIL_FROM: 'noreply@example.com',
  ALLOWED_ORIGINS: 'http://localhost:3000'
}

//* Complete valid environment configuration
export const validEnvVars = {
  ...baseEnvVars,
  NODE_ENV: 'development',
  HOST: '0.0.0.0',
  PORT: '8000',
  PREFIX: '/api/v1',
  JWT_EXPIRES_IN: '7d',
  REDIS_HOST: 'localhost',
  REDIS_PORT: '6379',
  REDIS_PASSWORD: '',
  QUEUE_REDIS_HOST: 'localhost',
  QUEUE_REDIS_PORT: '6379',
  QUEUE_REDIS_PASSWORD: '',
  LOG_LEVEL: 'info'
}

//* Environment variables for development
export const developmentEnvVars = {
  ...baseEnvVars,
  NODE_ENV: 'development',
  LOG_LEVEL: 'debug'
}

//* Environment variables for production
export const productionEnvVars = {
  ...baseEnvVars,
  NODE_ENV: 'production',
  LOG_LEVEL: 'warn'
}

//* Environment variables for test
export const testEnvVars = {
  ...baseEnvVars,
  NODE_ENV: 'test',
  LOG_LEVEL: 'error'
}

//* Invalid environment variables for testing validation errors
export const invalidEnvVars = {
  JWT_SECRET: 'short', // Too short
  DATABASE_URL: 'invalid-url',
  EMAIL_HOST: '',
  ALLOWED_ORIGINS: 'http://localhost:3000'
}

//* Helper to set environment variables for testing
export function setTestEnv(envVars: Record<string, string>): void {
  process.env = {
    ...originalEnv,
    ...envVars
  }
}

//* Helper to restore original environment
export function restoreEnv(): void {
  process.env = originalEnv
}

//* Helper to create a clean environment for testing
export function createTestEnv(overrides: Record<string, string> = {}): Record<string, string> {
  return {
    ...originalEnv,
    ...baseEnvVars,
    ...overrides
  }
}
