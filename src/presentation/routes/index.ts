import { env } from '@/shared/config/env'
import { healthRoutes } from './health.routes'

import type { FastifyInstance } from 'fastify'

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  // Register all routes with API prefix
  await app.register(
    async (app) => {
      // Health routes
      await app.register(healthRoutes)

      // TODO: Add more routes here
      // await app.register(userRoutes, { prefix: '/users' })
      // await app.register(authRoutes, { prefix: '/auth' })
    },
    { prefix: env.PREFIX }
  )
}
