import cors from '@fastify/cors'
import { env } from '@/shared/config/env'
import { CorsError } from '@/shared/errors/app-errors'

import type { FastifyInstance } from 'fastify'

export async function configureCors(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (like Postman, curl, etc)
      if (!origin) {
        cb(null, true)
        return
      }

      const allowedOrigins = env.ALLOWED_ORIGINS

      if (allowedOrigins.includes(origin)) {
        cb(null, true)
      } else {
        cb(new CorsError(`Origin ${origin} is not allowed by CORS`), false)
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Limit']
  })
}
