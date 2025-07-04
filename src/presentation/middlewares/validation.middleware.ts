import { z } from 'zod'
import { ValidationError } from '@/shared/errors/app-errors'

import type { FastifyReply, FastifyRequest } from 'fastify'

export interface ValidationSchema {
  body?: z.ZodSchema
  params?: z.ZodSchema
  query?: z.ZodSchema
  headers?: z.ZodSchema
}

export function validateRequest(schema: ValidationSchema) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    // Validate body
    if (schema.body) {
      const result = schema.body.safeParse(request.body)
      if (!result.success) {
        throw new ValidationError('Invalid request body', result.error.flatten())
      }
      request.body = result.data
    }

    // Validate params
    if (schema.params) {
      const result = schema.params.safeParse(request.params)
      if (!result.success) {
        throw new ValidationError('Invalid request params', result.error.flatten())
      }
      request.params = result.data
    }

    // Validate query
    if (schema.query) {
      const result = schema.query.safeParse(request.query)
      if (!result.success) {
        throw new ValidationError('Invalid query params', result.error.flatten())
      }
      request.query = result.data
    }

    // Validate headers
    if (schema.headers) {
      const result = schema.headers.safeParse(request.headers)
      if (!result.success) {
        throw new ValidationError('Invalid request headers', result.error.flatten())
      }
    }
  }
}
