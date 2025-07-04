import helmet from '@fastify/helmet'
import { isDevelopment } from '@/shared/config/env'

import type { FastifyInstance } from 'fastify'

export async function configureHelmet(app: FastifyInstance): Promise<void> {
  await app.register(helmet, {
    contentSecurityPolicy: isDevelopment
      ? false
      : {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            fontSrc: ["'self'", 'https:', 'data:']
          }
        },
    crossOriginEmbedderPolicy: !isDevelopment
  })
}
