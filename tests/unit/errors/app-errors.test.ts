import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InternalServerError,
  BadRequestError,
  TooManyRequestsError,
  ServiceUnavailableError,
  CorsError
} from '@/shared/errors/app-errors'

describe('App Errors', () => {
  describe('ValidationError', () => {
    it('should create error with correct properties', () => {
      const error = new ValidationError('Invalid input')

      expect(error.message).toBe('Invalid input')
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.isOperational).toBe(true)
      expect(error.details).toBeUndefined()
    })

    it('should include validation details when provided', () => {
      const details = { field: 'email', message: 'Invalid format' }
      const error = new ValidationError('Validation failed', details)

      expect(error.details).toEqual(details)
    })
  })

  describe('NotFoundError', () => {
    it('should create error with resource name only', () => {
      const error = new NotFoundError('User')

      expect(error.message).toBe('User not found')
      expect(error.statusCode).toBe(404)
      expect(error.code).toBe('NOT_FOUND')
      expect(error.isOperational).toBe(true)
    })

    it('should create error with resource name and identifier', () => {
      const error = new NotFoundError('User', '123')

      expect(error.message).toBe("User with identifier '123' not found")
      expect(error.statusCode).toBe(404)
      expect(error.code).toBe('NOT_FOUND')
    })
  })

  describe('UnauthorizedError', () => {
    it('should create error with default message', () => {
      const error = new UnauthorizedError()

      expect(error.message).toBe('Unauthorized access')
      expect(error.statusCode).toBe(401)
      expect(error.code).toBe('UNAUTHORIZED')
      expect(error.isOperational).toBe(true)
    })

    it('should create error with custom message', () => {
      const error = new UnauthorizedError('Invalid token')

      expect(error.message).toBe('Invalid token')
      expect(error.statusCode).toBe(401)
      expect(error.code).toBe('UNAUTHORIZED')
    })
  })

  describe('ForbiddenError', () => {
    it('should create error with default message', () => {
      const error = new ForbiddenError()

      expect(error.message).toBe('Access forbidden')
      expect(error.statusCode).toBe(403)
      expect(error.code).toBe('FORBIDDEN')
      expect(error.isOperational).toBe(true)
    })

    it('should create error with custom message', () => {
      const error = new ForbiddenError('Insufficient permissions')

      expect(error.message).toBe('Insufficient permissions')
      expect(error.statusCode).toBe(403)
      expect(error.code).toBe('FORBIDDEN')
    })
  })

  describe('ConflictError', () => {
    it('should create error with correct properties', () => {
      const error = new ConflictError('Email already exists')

      expect(error.message).toBe('Email already exists')
      expect(error.statusCode).toBe(409)
      expect(error.code).toBe('CONFLICT')
      expect(error.isOperational).toBe(true)
    })
  })

  describe('InternalServerError', () => {
    it('should create error with default message and operational flag', () => {
      const error = new InternalServerError()

      expect(error.message).toBe('Internal server error')
      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('INTERNAL_SERVER_ERROR')
      expect(error.isOperational).toBe(false)
    })

    it('should create error with custom message', () => {
      const error = new InternalServerError('Database connection failed')

      expect(error.message).toBe('Database connection failed')
      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('INTERNAL_SERVER_ERROR')
      expect(error.isOperational).toBe(false)
    })

    it('should create error with custom operational flag', () => {
      const error = new InternalServerError('Planned maintenance', true)

      expect(error.message).toBe('Planned maintenance')
      expect(error.isOperational).toBe(true)
    })
  })

  describe('BadRequestError', () => {
    it('should create error with correct properties', () => {
      const error = new BadRequestError('Invalid request format')

      expect(error.message).toBe('Invalid request format')
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('BAD_REQUEST')
      expect(error.isOperational).toBe(true)
    })
  })

  describe('TooManyRequestsError', () => {
    it('should create error with default message', () => {
      const error = new TooManyRequestsError()

      expect(error.message).toBe('Too many requests')
      expect(error.statusCode).toBe(429)
      expect(error.code).toBe('TOO_MANY_REQUESTS')
      expect(error.isOperational).toBe(true)
    })

    it('should create error with custom message', () => {
      const error = new TooManyRequestsError('Rate limit exceeded')

      expect(error.message).toBe('Rate limit exceeded')
      expect(error.statusCode).toBe(429)
      expect(error.code).toBe('TOO_MANY_REQUESTS')
    })
  })

  describe('ServiceUnavailableError', () => {
    it('should create error with default message', () => {
      const error = new ServiceUnavailableError()

      expect(error.message).toBe('Service temporarily unavailable')
      expect(error.statusCode).toBe(503)
      expect(error.code).toBe('SERVICE_UNAVAILABLE')
      expect(error.isOperational).toBe(true)
    })

    it('should create error with custom message', () => {
      const error = new ServiceUnavailableError('Maintenance in progress')

      expect(error.message).toBe('Maintenance in progress')
      expect(error.statusCode).toBe(503)
      expect(error.code).toBe('SERVICE_UNAVAILABLE')
    })
  })

  describe('CorsError', () => {
    it('should create error with default message', () => {
      const error = new CorsError()

      expect(error.message).toBe('Not allowed by CORS')
      expect(error.statusCode).toBe(403)
      expect(error.code).toBe('CORS_ERROR')
      expect(error.isOperational).toBe(true)
    })

    it('should create error with custom message', () => {
      const error = new CorsError('Origin not allowed')

      expect(error.message).toBe('Origin not allowed')
      expect(error.statusCode).toBe(403)
      expect(error.code).toBe('CORS_ERROR')
    })
  })
})
