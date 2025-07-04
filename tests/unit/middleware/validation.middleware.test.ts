import { z } from 'zod'

import { ValidationError } from '@/shared/errors/app-errors'

import {
  validateRequest,
  type ValidationSchema
} from '@/presentation/middlewares/validation.middleware'

import type { FastifyRequest, FastifyReply } from 'fastify'

describe('Validation Middleware', () => {
  let mockRequest: Partial<FastifyRequest>
  let mockReply: Partial<FastifyReply>

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {},
      headers: {}
    }
    mockReply = {}
  })

  describe('Body Validation', () => {
    it('should validate valid body data', async () => {
      const schema: ValidationSchema = {
        body: z.object({
          name: z.string(),
          age: z.number()
        })
      }

      mockRequest.body = { name: 'John', age: 30 }

      const middleware = validateRequest(schema)
      await expect(
        middleware(mockRequest as FastifyRequest, mockReply as FastifyReply)
      ).resolves.toBeUndefined()

      expect(mockRequest.body).toEqual({ name: 'John', age: 30 })
    })

    it('should throw ValidationError for invalid body data', async () => {
      const schema: ValidationSchema = {
        body: z.object({
          name: z.string(),
          age: z.number()
        })
      }

      mockRequest.body = { name: 'John', age: 'invalid' }

      const middleware = validateRequest(schema)
      await expect(
        middleware(mockRequest as FastifyRequest, mockReply as FastifyReply)
      ).rejects.toThrow(ValidationError)
    })
  })

  describe('Params Validation', () => {
    it('should validate valid params data', async () => {
      const schema: ValidationSchema = {
        params: z.object({
          id: z.string().uuid()
        })
      }

      mockRequest.params = { id: '123e4567-e89b-12d3-a456-426614174000' }

      const middleware = validateRequest(schema)
      await expect(
        middleware(mockRequest as FastifyRequest, mockReply as FastifyReply)
      ).resolves.toBeUndefined()

      expect(mockRequest.params).toEqual({ id: '123e4567-e89b-12d3-a456-426614174000' })
    })

    it('should throw ValidationError for invalid params data', async () => {
      const schema: ValidationSchema = {
        params: z.object({
          id: z.string().uuid()
        })
      }

      mockRequest.params = { id: 'invalid-uuid' }

      const middleware = validateRequest(schema)
      await expect(
        middleware(mockRequest as FastifyRequest, mockReply as FastifyReply)
      ).rejects.toThrow(ValidationError)
    })
  })

  describe('Query Validation', () => {
    it('should validate valid query data', async () => {
      const schema: ValidationSchema = {
        query: z.object({
          limit: z.coerce.number().positive(),
          offset: z.coerce.number().min(0)
        })
      }

      mockRequest.query = { limit: '10', offset: '0' }

      const middleware = validateRequest(schema)
      await expect(
        middleware(mockRequest as FastifyRequest, mockReply as FastifyReply)
      ).resolves.toBeUndefined()

      expect(mockRequest.query).toEqual({ limit: 10, offset: 0 })
    })

    it('should throw ValidationError for invalid query data', async () => {
      const schema: ValidationSchema = {
        query: z.object({
          limit: z.coerce.number().positive()
        })
      }

      mockRequest.query = { limit: '-1' }

      const middleware = validateRequest(schema)
      await expect(
        middleware(mockRequest as FastifyRequest, mockReply as FastifyReply)
      ).rejects.toThrow(ValidationError)
    })
  })

  describe('Headers Validation', () => {
    it('should validate valid headers data', async () => {
      const schema: ValidationSchema = {
        headers: z.object({
          authorization: z.string().startsWith('Bearer ')
        })
      }

      mockRequest.headers = { authorization: 'Bearer token123' }

      const middleware = validateRequest(schema)
      await expect(
        middleware(mockRequest as FastifyRequest, mockReply as FastifyReply)
      ).resolves.toBeUndefined()
    })

    it('should throw ValidationError for invalid headers data', async () => {
      const schema: ValidationSchema = {
        headers: z.object({
          authorization: z.string().startsWith('Bearer ')
        })
      }

      mockRequest.headers = { authorization: 'Basic token123' }

      const middleware = validateRequest(schema)
      await expect(
        middleware(mockRequest as FastifyRequest, mockReply as FastifyReply)
      ).rejects.toThrow(ValidationError)
    })
  })

  describe('Multiple Validations', () => {
    it('should validate all schemas when provided', async () => {
      const schema: ValidationSchema = {
        body: z.object({ name: z.string() }),
        params: z.object({ id: z.string() }),
        query: z.object({ limit: z.coerce.number() }),
        headers: z.object({ 'content-type': z.string() })
      }

      mockRequest.body = { name: 'John' }
      mockRequest.params = { id: 'test-id' }
      mockRequest.query = { limit: '10' }
      mockRequest.headers = { 'content-type': 'application/json' }

      const middleware = validateRequest(schema)
      await expect(
        middleware(mockRequest as FastifyRequest, mockReply as FastifyReply)
      ).resolves.toBeUndefined()
    })

    it('should handle empty schema object', async () => {
      const schema: ValidationSchema = {}

      const middleware = validateRequest(schema)
      await expect(
        middleware(mockRequest as FastifyRequest, mockReply as FastifyReply)
      ).resolves.toBeUndefined()
    })
  })

  describe('Error Details', () => {
    it('should include validation details in ValidationError', async () => {
      const schema: ValidationSchema = {
        body: z.object({
          email: z.string().email(),
          age: z.number().positive()
        })
      }

      mockRequest.body = { email: 'invalid-email', age: -1 }

      const middleware = validateRequest(schema)

      try {
        await middleware(mockRequest as FastifyRequest, mockReply as FastifyReply)
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError)
        expect((error as ValidationError).details).toBeDefined()
        expect((error as ValidationError).message).toBe('Invalid request body')
      }
    })
  })
})
