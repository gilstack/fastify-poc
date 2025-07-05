import { buildApp } from '@/infrastructure/http/app'
import {
  developmentEnvVars,
  productionEnvVars,
  restoreEnv,
  setTestEnv
} from '../../__mocks__/environment.mock'

import type { FastifyInstance } from 'fastify'

describe('HTTP Plugins', () => {
  let app: FastifyInstance

  beforeEach(async () => {
    app = await buildApp()
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  describe('Rate Limiting Plugin', () => {
    it('should register rate limiting plugin', () => {
      expect(app.hasPlugin('@fastify/rate-limit')).toBe(true)
    })

    it('should allow requests within rate limit', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/health',
        headers: {
          'x-real-ip': '192.168.1.1'
        }
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['x-ratelimit-limit']).toBeDefined()
      expect(response.headers['x-ratelimit-remaining']).toBeDefined()
    })

    it('should handle rate limit key generation for different IP sources', async () => {
      // Test x-real-ip header
      const response1 = await app.inject({
        method: 'GET',
        url: '/api/v1/health',
        headers: {
          'x-real-ip': '192.168.1.100'
        }
      })

      // Test x-forwarded-for header
      const response2 = await app.inject({
        method: 'GET',
        url: '/api/v1/health',
        headers: {
          'x-forwarded-for': '192.168.1.200'
        }
      })

      expect(response1.statusCode).toBe(200)
      expect(response2.statusCode).toBe(200)
    })

    it('should allow localhost in allowlist', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/health',
        remoteAddress: '127.0.0.1'
      })

      expect(response.statusCode).toBe(200)
    })

    it('should handle array IP in x-forwarded-for header', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/health',
        headers: {
          'x-forwarded-for': '192.168.1.100,10.0.0.1,172.16.0.1'
        }
      })

      expect(response.statusCode).toBe(200)
    })

    it('should fallback to default IP when no IP is available', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/health'
        // No IP headers, socket remoteAddress, or ip property
      })

      expect(response.statusCode).toBe(200)
    })
  })

  describe('Swagger Plugin', () => {
    it('should register swagger plugin', () => {
      expect(app.hasPlugin('@fastify/swagger')).toBe(true)
      expect(app.hasPlugin('@fastify/swagger-ui')).toBe(true)
    })

    it('should serve swagger documentation', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/docs'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    it('should serve swagger JSON spec', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/docs/json'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('application/json')

      const spec = JSON.parse(response.payload)
      expect(spec.openapi).toBeDefined()
      expect(spec.info.title).toBe('Storagie API')
      expect(spec.info.version).toBe('1.0.0')
    })

    it('should include security schemes in spec', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/docs/json'
      })

      const spec = JSON.parse(response.payload)
      expect(spec.components.securitySchemes.bearerAuth).toEqual({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      })
    })

    it('should include predefined tags in spec', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/docs/json'
      })

      const spec = JSON.parse(response.payload)
      const tagNames = spec.tags.map((tag: { name: string }) => tag.name)

      expect(tagNames).toContain('health')
      expect(tagNames).toContain('users')
      expect(tagNames).toContain('auth')
    })
  })

  describe('Helmet Plugin', () => {
    it('should register helmet plugin', () => {
      expect(app.hasPlugin('@fastify/helmet')).toBe(true)
    })

    it('should add security headers in production mode', async () => {
      // Mock production environment
      setTestEnv(productionEnvVars)
      jest.resetModules() // Invalidate cache to reload env

      const { buildApp: buildProdApp } = await import('@/infrastructure/http/app')

      // Create new app with production config
      const prodApp = await buildProdApp()
      await prodApp.ready()

      const response = await prodApp.inject({
        method: 'GET',
        url: '/api/v1/health'
      })

      expect(response.headers['x-frame-options']).toBeDefined()
      expect(response.headers['x-content-type-options']).toBeDefined()

      await prodApp.close()
      restoreEnv()
      jest.resetModules() // Restore original env for other tests
    })

    it('should disable CSP in development mode', async () => {
      setTestEnv(developmentEnvVars)
      jest.resetModules()

      const { buildApp: buildDevApp } = await import('@/infrastructure/http/app')
      const devApp = await buildDevApp()
      await devApp.ready()

      const response = await devApp.inject({
        method: 'GET',
        url: '/api/v1/health'
      })

      // In development, CSP should be disabled (false)
      expect(response.headers['content-security-policy']).toBeUndefined()

      await devApp.close()
      restoreEnv()
      jest.resetModules()
    })
  })

  describe('CORS Plugin', () => {
    it('should register cors plugin', () => {
      expect(app.hasPlugin('@fastify/cors')).toBe(true)
    })

    it('should handle preflight requests', async () => {
      const response = await app.inject({
        method: 'OPTIONS',
        url: '/api/v1/health',
        headers: {
          'origin': 'http://localhost:3000',
          'access-control-request-method': 'GET'
        }
      })

      expect(response.statusCode).toBe(204)
      expect(response.headers['access-control-allow-origin']).toBeDefined()
      expect(response.headers['access-control-allow-methods']).toBeDefined()
    })

    it('should allow requests from allowed origins', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/health',
        headers: {
          origin: 'http://localhost:3000'
        }
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000')
    })
  })

  describe('Sensible Plugin', () => {
    it('should register sensible plugin', () => {
      expect(app.hasPlugin('@fastify/sensible')).toBe(true)
    })

    it('should provide http errors decorators', () => {
      expect(app.httpErrors).toBeDefined()
      expect(app.httpErrors.badRequest).toBeInstanceOf(Function)
      expect(app.httpErrors.notFound).toBeInstanceOf(Function)
      expect(app.httpErrors.internalServerError).toBeInstanceOf(Function)
    })

    it('should provide assert decorator', () => {
      expect(app.assert).toBeDefined()
      expect(app.assert).toBeInstanceOf(Function)
    })
  })
})
