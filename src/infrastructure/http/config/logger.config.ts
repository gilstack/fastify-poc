import { env, isDevelopment } from '@/shared/config/env'

import type { FastifyLoggerOptions } from 'fastify'
import type { PinoLoggerOptions } from 'fastify/types/logger'

type LoggerConfig = FastifyLoggerOptions & PinoLoggerOptions

export function getLoggerConfig(): LoggerConfig {
  if (process.env['NODE_ENV'] === 'test') return { level: 'silent' }

  if (isDevelopment) {
    return {
      level: env.LOG_LEVEL,
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          colorize: true
        }
      }
    }
  }

  return {
    level: env.LOG_LEVEL,
    serializers: {
      req(request) {
        return {
          method: request.method,
          url: request.url,
          path: request.routeOptions?.url || request.url,
          parameters: request.params,
          headers: request.headers
        }
      },
      res(reply) {
        return {
          statusCode: reply.statusCode
        }
      }
    }
  }
}
