import type { FastifyReply, FastifyRequest } from 'fastify'

export function notFoundHandler(request: FastifyRequest, reply: FastifyReply): void {
  request.log.info({
    method: request.method,
    url: request.url,
    message: 'Route not found'
  })

  void reply.status(404).send({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Route ${request.method}:${request.url} not found`,
      timestamp: new Date().toISOString(),
      path: request.url
    }
  })
}
