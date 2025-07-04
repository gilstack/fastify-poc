import { BaseError } from './base-error'

export class ValidationError extends BaseError {
  public readonly details?: unknown

  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR')
    this.details = details
  }
}

export class NotFoundError extends BaseError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`
    super(message, 404, 'NOT_FOUND')
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = 'Access forbidden') {
    super(message, 403, 'FORBIDDEN')
  }
}

export class ConflictError extends BaseError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT')
  }
}

export class InternalServerError extends BaseError {
  constructor(message = 'Internal server error', isOperational = false) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', isOperational)
  }
}

export class BadRequestError extends BaseError {
  constructor(message: string) {
    super(message, 400, 'BAD_REQUEST')
  }
}

export class TooManyRequestsError extends BaseError {
  constructor(message = 'Too many requests') {
    super(message, 429, 'TOO_MANY_REQUESTS')
  }
}

export class ServiceUnavailableError extends BaseError {
  constructor(message = 'Service temporarily unavailable') {
    super(message, 503, 'SERVICE_UNAVAILABLE')
  }
}

export class CorsError extends BaseError {
  constructor(message = 'Not allowed by CORS') {
    super(message, 403, 'CORS_ERROR')
  }
}
