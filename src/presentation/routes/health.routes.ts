import type { FastifyInstance } from 'fastify'

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    '/health',
    {
      schema: {
        description: 'Health check endpoint',
        tags: ['health'],
        response: {
          200: {
            description: 'Health check response',
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'string' },
              uptime: { type: 'number' },
              environment: { type: 'string' },
              version: { type: 'string' }
            }
          }
        }
      }
    },
    async (request, reply) => {
      return reply.code(200).send({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env['NODE_ENV'],
        version: '1.0.0'
      })
    }
  )

  app.get(
    '/health/ready',
    {
      schema: {
        description: 'Readiness check endpoint',
        tags: ['health'],
        response: {
          200: {
            description: 'Service is ready',
            type: 'object',
            properties: {
              ready: { type: 'boolean' },
              services: {
                type: 'object',
                properties: {
                  database: { type: 'boolean' },
                  redis: { type: 'boolean' }
                }
              }
            }
          },
          503: {
            description: 'Service is not ready',
            type: 'object',
            properties: {
              ready: { type: 'boolean' },
              services: { type: 'object' }
            }
          }
        }
      }
    },
    async (request, reply) => {
      // TODO: Check database and redis connections
      const services = {
        database: true, // Placeholder
        redis: true // Placeholder
      }

      const ready = Object.values(services).every((status) => status)

      return reply.code(ready ? 200 : 503).send({
        ready,
        services
      })
    }
  )
}
