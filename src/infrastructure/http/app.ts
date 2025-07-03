import fastify from 'fastify'
import { env, isDevelopment } from '@/shared/config/env'

import type { FastifyInstance, FastifyServerOptions } from 'fastify'

export async function buildApp(): Promise<FastifyInstance> {
  //* Logging Extended
  const loggerConfig: FastifyServerOptions['logger'] = isDevelopment
    ? {
        level: env.LOG_LEVEL,
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname'
          }
        }
      }
    : {
        level: env.LOG_LEVEL
      }

  //* Fastify Instance
  const app = fastify({
    logger: loggerConfig
  })

  return app
}
