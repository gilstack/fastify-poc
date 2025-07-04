import { ValidationError, NotFoundError, InternalServerError } from '@/shared/errors/app-errors'

import { errorHandler } from '@/infrastructure/http/handlers/error.handler'

import type { FastifyRequest, FastifyReply, FastifyError } from 'fastify'

// Mock dependencies
jest.mock('@/shared/config/env', () => ({
  isDevelopment: false
}))

describe('Error Handler', () => {
  let mockRequest: Partial<FastifyRequest>
  let mockReply: Partial<FastifyReply>

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      url: '/test',
      params: {},
      query: {},
      headers: {},
      log: {
        error: jest.fn()
      } as unknown as FastifyRequest['log']
    }

    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('BaseError handling', () => {
    it('should handle ValidationError correctly', () => {
      const error = new ValidationError('Invalid data', { field: 'name' })

      errorHandler(error, mockRequest as FastifyRequest, mockReply as FastifyReply)

      expect(mockReply.status).toHaveBeenCalledWith(400)
      expect(mockReply.send).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid data',
          details: { field: 'name' },
          timestamp: error.timestamp.toISOString(),
          path: '/test'
        }
      })
    })

    it('should handle NotFoundError correctly', () => {
      const error = new NotFoundError('User', '123')

      errorHandler(error, mockRequest as FastifyRequest, mockReply as FastifyReply)

      expect(mockReply.status).toHaveBeenCalledWith(404)
      expect(mockReply.send).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: "User with identifier '123' not found",
          timestamp: error.timestamp.toISOString(),
          path: '/test'
        }
      })
    })

    it('should handle errors without stack trace in production mode', () => {
      const error = new InternalServerError('Server error')

      errorHandler(error, mockRequest as FastifyRequest, mockReply as FastifyReply)

      expect(mockReply.send).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Server error',
          timestamp: error.timestamp.toISOString(),
          path: '/test'
        }
      })
    })
  })

  describe('Fastify error handling', () => {
    it('should handle Fastify errors with statusCode', () => {
      const fastifyError: FastifyError = {
        name: 'FastifyError',
        message: 'Validation failed',
        code: 'FST_ERR_VALIDATION',
        statusCode: 400,
        stack: 'stack trace'
      }

      errorHandler(fastifyError, mockRequest as FastifyRequest, mockReply as FastifyReply)

      expect(mockReply.status).toHaveBeenCalledWith(400)
      expect(mockReply.send).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'FST_ERR_VALIDATION',
          message: 'Validation failed',
          timestamp: expect.any(String),
          path: '/test'
        }
      })
    })

    it('should handle Fastify errors without code', () => {
      const fastifyError: Partial<FastifyError> = {
        name: 'FastifyError',
        message: 'Some error',
        statusCode: 500,
        stack: 'stack trace'
      }

      errorHandler(
        fastifyError as FastifyError,
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      )

      expect(mockReply.status).toHaveBeenCalledWith(500)
      expect(mockReply.send).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'FASTIFY_ERROR',
          message: 'Some error',
          timestamp: expect.any(String),
          path: '/test'
        }
      })
    })
  })

  describe('Unknown error handling', () => {
    it('should handle unknown errors in production mode', () => {
      const unknownError = new Error('Unknown error')

      errorHandler(unknownError, mockRequest as FastifyRequest, mockReply as FastifyReply)

      expect(mockReply.status).toHaveBeenCalledWith(500)
      expect(mockReply.send).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
          timestamp: expect.any(String),
          path: '/test'
        }
      })
    })

    it('should handle unknown errors consistently', () => {
      const unknownError = new Error('Unknown error')

      errorHandler(unknownError, mockRequest as FastifyRequest, mockReply as FastifyReply)

      expect(mockReply.send).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
          timestamp: expect.any(String),
          path: '/test'
        }
      })
    })
  })

  describe('Request logging', () => {
    it('should log error with request details', () => {
      const error = new ValidationError('Test error')

      errorHandler(error, mockRequest as FastifyRequest, mockReply as FastifyReply)

      expect(mockRequest.log?.error).toHaveBeenCalledWith({
        err: error,
        request: {
          method: 'GET',
          url: '/test',
          params: {},
          query: {},
          headers: {}
        }
      })
    })
  })
})
