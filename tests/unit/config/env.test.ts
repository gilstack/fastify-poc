import {
  validEnvVars,
  developmentEnvVars,
  productionEnvVars,
  testEnvVars,
  invalidEnvVars,
  setTestEnv,
  restoreEnv,
  createTestEnv
} from '../../__helpers__/mocks/environment.mock'
import { setupCommonMocks, cleanupMocks } from '../../__helpers__/mocks/app.mock'

describe('Environment Configuration', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    restoreEnv()
  })

  describe('Environment Validation', () => {
    it('should validate complete valid environment variables', async () => {
      setTestEnv(validEnvVars)

      // Dynamic import to avoid module caching issues
      const { env } = await import('@/shared/config/env')

      expect(env.NODE_ENV).toBe('development')
      expect(env.HOST).toBe('0.0.0.0')
      expect(env.PORT).toBe(8000)
      expect(env.PREFIX).toBe('/api/v1')
      expect(env.JWT_SECRET).toBe('super-secret-jwt-key-with-32-chars-minimum')
      expect(env.JWT_EXPIRES_IN).toBe('7d')
      expect(env.REDIS_HOST).toBe('localhost')
      expect(env.REDIS_PORT).toBe(6379)
      expect(env.LOG_LEVEL).toBe('info')
    })

    it('should parse ALLOWED_ORIGINS correctly', async () => {
      setTestEnv(
        createTestEnv({
          ALLOWED_ORIGINS: 'http://localhost:3000, http://example.com, https://app.com'
        })
      )

      const { env } = await import('@/shared/config/env')

      expect(env.ALLOWED_ORIGINS).toEqual([
        'http://localhost:3000',
        'http://example.com',
        'https://app.com'
      ])
    })

    it('should use default values when not provided', async () => {
      // Test with minimal required environment variables
      setTestEnv({
        NODE_ENV: 'test', // Jest sets this
        LOG_LEVEL: 'error' // Jest sets this for tests
      })

      const { env } = await import('@/shared/config/env')

      expect(env.NODE_ENV).toBe('test')
      expect(env.HOST).toBe('0.0.0.0')
      expect(env.PORT).toBe(8000)
      expect(env.PREFIX).toBe('/api/v1')
      expect(env.JWT_EXPIRES_IN).toBe('7d')
      expect(env.LOG_LEVEL).toBe('error')
    })

    it('should exit process on invalid environment variables', async () => {
      const { mockExit, mockConsoleError } = setupCommonMocks()

      setTestEnv(invalidEnvVars)

      await expect(async () => {
        await import('@/shared/config/env')
      }).rejects.toThrow('Process exit')

      expect(mockExit).toHaveBeenCalledWith(1)
      expect(mockConsoleError).toHaveBeenCalledWith('❌ Invalid environment variables:')

      cleanupMocks([mockExit, mockConsoleError])
    })
  })

  describe('Environment Helpers', () => {
    it('should provide correct environment flags for development', async () => {
      setTestEnv(developmentEnvVars)

      const { isDevelopment, isProduction, isTest } = await import('@/shared/config/env')

      expect(isDevelopment).toBe(true)
      expect(isProduction).toBe(false)
      expect(isTest).toBe(false)
    })

    it('should provide correct environment flags for production', async () => {
      setTestEnv(productionEnvVars)

      const { isDevelopment, isProduction, isTest } = await import('@/shared/config/env')

      expect(isDevelopment).toBe(false)
      expect(isProduction).toBe(true)
      expect(isTest).toBe(false)
    })

    it('should provide correct environment flags for test', async () => {
      setTestEnv(testEnvVars)

      const { isDevelopment, isProduction, isTest } = await import('@/shared/config/env')

      expect(isDevelopment).toBe(false)
      expect(isProduction).toBe(false)
      expect(isTest).toBe(true)
    })
  })

  describe('Type Safety', () => {
    it('should ensure correct types for numeric values', async () => {
      setTestEnv(
        createTestEnv({
          PORT: '9000',
          REDIS_PORT: '6380',
          EMAIL_PORT: '465',
          QUEUE_REDIS_PORT: '6381'
        })
      )

      const { env } = await import('@/shared/config/env')

      expect(typeof env.PORT).toBe('number')
      expect(typeof env.REDIS_PORT).toBe('number')
      expect(typeof env.EMAIL_PORT).toBe('number')
      expect(typeof env.QUEUE_REDIS_PORT).toBe('number')

      expect(env.PORT).toBe(9000)
      expect(env.REDIS_PORT).toBe(6380)
      expect(env.EMAIL_PORT).toBe(465)
      expect(env.QUEUE_REDIS_PORT).toBe(6381)
    })

    it('should validate enum values correctly', async () => {
      setTestEnv(
        createTestEnv({
          NODE_ENV: 'production',
          LOG_LEVEL: 'error'
        })
      )

      const { env } = await import('@/shared/config/env')

      expect(env.NODE_ENV).toBe('production')
      expect(env.LOG_LEVEL).toBe('error')
    })
  })
})
