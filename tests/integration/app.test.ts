import request from 'supertest'
import { buildApp } from '@/infrastructure/http/app'

import type { FastifyInstance } from 'fastify'

describe('App Configuration', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app.server).get('/api/v1/health').expect(200)

      expect(response.body).toHaveProperty('status', 'healthy')
      expect(response.body).toHaveProperty('timestamp')
      expect(response.body).toHaveProperty('uptime')
      expect(response.body).toHaveProperty('environment')
      expect(response.body).toHaveProperty('version')
    })

    it('should return readiness status', async () => {
      const response = await request(app.server).get('/api/v1/health/ready').expect(200)

      expect(response.body).toHaveProperty('ready', true)
      expect(response.body).toHaveProperty('services')
      expect(response.body.services).toHaveProperty('database')
      expect(response.body.services).toHaveProperty('redis')
    })
  })

  describe('CORS', () => {
    it('should handle CORS preflight requests', async () => {
      const response = await request(app.server)
        .options('/api/v1/health')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET')
        .expect(204)

      expect(response.headers).toHaveProperty('access-control-allow-origin')
      expect(response.headers).toHaveProperty('access-control-allow-methods')
    })

    it('should reject requests from non-allowed origins', async () => {
      const response = await request(app.server)
        .get('/api/v1/health')
        .set('Origin', 'http://malicious-site.com')
        .expect(403)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.error.code).toBe('CORS_ERROR')
      expect(response.body.error.message).toContain('is not allowed by CORS')
    })
  })

  describe('Error Handling', () => {
    it('should handle 404 errors', async () => {
      const response = await request(app.server).get('/api/v1/non-existent').expect(404)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toHaveProperty('code')
      expect(response.body.error).toHaveProperty('message')
    })
  })

  describe('Request ID', () => {
    it('should add request ID to response headers', async () => {
      const response = await request(app.server).get('/api/v1/health').expect(200)

      expect(response.headers).toHaveProperty('x-request-id')
    })

    it('should use provided request ID if present', async () => {
      const requestId = 'test-request-id-123'
      const response = await request(app.server)
        .get('/api/v1/health')
        .set('x-request-id', requestId)
        .expect(200)

      expect(response.headers['x-request-id']).toBe(requestId)
    })
  })
})
