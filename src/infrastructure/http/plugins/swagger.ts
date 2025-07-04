import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { env } from '@/shared/config/env'

import type { FastifyInstance } from 'fastify'

export async function configureSwagger(app: FastifyInstance): Promise<void> {
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Storagie API',
        description: 'Backend API for the Storagie',
        version: '1.0.0',
        contact: {
          name: 'Storagie Team',
          email: 'admin@storagie.com',
          url: 'https://storagie.com'
        },
        license: {
          name: 'ISC',
          url: 'https://opensource.org/licenses/ISC'
        }
      },
      externalDocs: {
        url: 'https://docs.storagie.com',
        description: 'Find more info here'
      },
      servers: [
        {
          url: `http://${env.HOST}:${env.PORT}${env.PREFIX}`,
          description: 'Development server'
        }
      ],
      tags: [
        { name: 'health', description: 'Health check endpoints' },
        { name: 'users', description: 'User management endpoints' },
        { name: 'auth', description: 'Authentication endpoints' }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  })

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => {
      return swaggerObject
    },
    transformSpecificationClone: true
  })
}
