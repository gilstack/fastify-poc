import rateLimit from '@fastify/rate-limit'
import { TooManyRequestsError } from '@/shared/errors/app-errors'

import type { FastifyInstance } from 'fastify'

export async function configureRateLimit(app: FastifyInstance): Promise<void> {
  await app.register(rateLimit, {
    max: 100, // Maximum 100 requests
    cache: 10000, // Cache up to 10k IPs
    timeWindow: '1 minute', // Per 1 minute
    allowList: ['127.0.0.1'], // Whitelist localhost
    skipOnError: false,
    keyGenerator: (request) => {
      const ip =
        request.headers['x-real-ip'] ||
        request.headers['x-forwarded-for'] ||
        request.ip ||
        request.socket.remoteAddress

      const clientIp = Array.isArray(ip) ? ip[0] : ip
      return clientIp || '127.0.0.1'
    },
    errorResponseBuilder: (request, context) => {
      throw new TooManyRequestsError(
        `Rate limit exceeded. Max ${context.max} requests per ${context.after}`
      )
    }
  })
}
