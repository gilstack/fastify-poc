import crypto from 'node:crypto'

// Configuration
import { getLoggerConfig } from './logger.config'

// Types
import type { FastifyServerOptions } from 'fastify'

export function getServerConfig(): FastifyServerOptions {
  return {
    logger: getLoggerConfig(),
    disableRequestLogging: false,
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'reqId',
    genReqId: (req) => (req.headers['x-request-id'] as string) || crypto.randomUUID(),
    trustProxy: true
  }
}
