import crypto from 'crypto'

import type { FastifyInstance } from 'fastify'

export function configureRequestId(app: FastifyInstance): void {
  app.addHook('onRequest', async (request, reply) => {
    // Generate unique request ID
    const requestId = request.headers['x-request-id'] || crypto.randomUUID()

    // Set request ID in request object
    request.id = requestId as string

    // Add to response headers
    void reply.header('x-request-id', requestId)
  })
}
