import { BaseError } from '@/shared/errors/base-error'
import { isDevelopment } from '@/shared/config/env'

import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import type { ApiError } from '@/shared/types/utilities.type'

export function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  // Log error
  request.log.error({
    err: error,
    request: {
      method: request.method,
      url: request.url,
      params: request.params,
      query: request.query,
      headers: request.headers
    }
  })

  // Prepare error response
  let statusCode = 500
  let errorResponse: ApiError & { stack?: string } = {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    path: request.url
  }

  // Handle BaseError instances
  if (error instanceof BaseError) {
    statusCode = error.statusCode
    errorResponse = {
      code: error.code,
      message: error.message,
      timestamp: error.timestamp.toISOString(),
      path: request.url,
      ...(isDevelopment && { stack: error.stack })
    }

    // Add details if available (e.g., validation errors)
    if ('details' in error && error.details) {
      errorResponse.details = error.details
    }
  }
  // Handle Fastify errors
  else if ('statusCode' in error && error.statusCode) {
    statusCode = error.statusCode
    errorResponse = {
      code: error.code || 'FASTIFY_ERROR',
      message: error.message,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(isDevelopment && { stack: error.stack })
    }
  }
  // Handle unknown errors
  else {
    // In production, don't expose internal error details
    if (!isDevelopment) {
      errorResponse.message = 'An unexpected error occurred'
    } else {
      errorResponse.message = error.message
      if (error.stack) {
        errorResponse.stack = error.stack
      }
    }
  }

  // Send error response
  void reply.status(statusCode).send({
    success: false,
    error: errorResponse
  })
}
