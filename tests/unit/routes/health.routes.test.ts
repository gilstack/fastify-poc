import { buildApp } from '@/infrastructure/http/app'
import type { FastifyInstance } from 'fastify'

// Mock environment variables
jest.mock('@/shared/config/env', () => ({
  env: {
    HOST: 'localhost',
    PORT: 3000,
    PREFIX: '/api/v1',
    ALLOWED_ORIGINS: ['http://localhost:3000']
  },
  isDevelopment: true
}))

describe('Health Routes', () => {
  let app: FastifyInstance

  beforeEach(async () => {
    app = await buildApp()
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  describe('Health Check Endpoint', () => {
    it('should return health status with all required fields', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/health'
      })

      expect(response.statusCode).toBe(200)

      const body = JSON.parse(response.payload)
      expect(body).toHaveProperty('status', 'healthy')
      expect(body).toHaveProperty('timestamp')
      expect(body).toHaveProperty('uptime')
      expect(body).toHaveProperty('environment')
      expect(body).toHaveProperty('version')

      // Validate timestamp format
      expect(new Date(body.timestamp)).toBeInstanceOf(Date)

      // Validate uptime is a number
      expect(typeof body.uptime).toBe('number')
      expect(body.uptime).toBeGreaterThan(0)
    })

    it('should include valid timestamp and uptime', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/health'
      })

      const body = JSON.parse(response.payload)
      expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      expect(typeof body.uptime).toBe('number')
      expect(body.uptime).toBeGreaterThan(0)
    })
  })

  describe('Readiness Check Endpoint', () => {
    it('should return readiness status with service checks', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/health/ready'
      })

      expect(response.statusCode).toBe(200)

      const body = JSON.parse(response.payload)
      expect(body).toHaveProperty('ready', true)
      expect(body).toHaveProperty('services')
      expect(body.services).toHaveProperty('database')
      expect(body.services).toHaveProperty('redis')
    })

    it('should check database connectivity status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/health/ready'
      })

      const body = JSON.parse(response.payload)

      // Database service should be checked (returns boolean in simple implementation)
      expect(typeof body.services.database).toBe('boolean')
    })

    it('should check redis connectivity status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/health/ready'
      })

      const body = JSON.parse(response.payload)

      // Redis service should be checked (returns boolean in simple implementation)
      expect(typeof body.services.redis).toBe('boolean')
    })

    it('should return overall ready status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/health/ready'
      })

      const body = JSON.parse(response.payload)

      // Ready status should be boolean
      expect(typeof body.ready).toBe('boolean')
      expect(body.ready).toBe(true) // Services should be available in test
    })
  })

  describe('Response Headers', () => {
    it('should include proper content-type headers', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/health'
      })

      expect(response.headers['content-type']).toContain('application/json')
    })

    it('should include security headers from helmet', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/health'
      })

      // Security headers from helmet
      expect(response.headers).toHaveProperty('x-content-type-options')
      expect(response.headers).toHaveProperty('x-frame-options')
    })
  })

  describe('Error Scenarios', () => {
    it('should handle unsupported HTTP methods', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/health'
      })

      expect(response.statusCode).toBe(404)
    })

    it('should handle invalid health sub-routes', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/health/invalid'
      })

      expect(response.statusCode).toBe(404)
    })
  })
})
