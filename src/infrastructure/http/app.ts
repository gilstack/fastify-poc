import fastify from 'fastify'

// Configuration
import { getServerConfig } from '@/http/config'

// Plugins
import {
  configureCors,
  configureHelmet,
  configureRateLimit,
  configureSensible,
  configureSwagger
} from '@/http/plugins'

// Hooks
import { configureRequestId } from '@/http/hooks'

// Routes
import { registerRoutes } from '@/presentation/routes'

// Handlers
import { errorHandler, notFoundHandler } from '@/http/handlers'

// Types
import type { FastifyInstance } from 'fastify'

export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify(getServerConfig())

  //* Register Plugins
  await configureSensible(app)
  await configureCors(app)
  await configureHelmet(app)
  await configureRateLimit(app)
  await configureSwagger(app)

  //* Register Hooks
  configureRequestId(app)

  //* Error Handler
  app.setErrorHandler(errorHandler)

  //* Not Found Handler
  app.setNotFoundHandler(notFoundHandler)

  //* Register Routes
  await registerRoutes(app)

  //* Graceful shutdown
  app.addHook('onClose', async () => {
    app.log.info('Server is shutting down...')
    // TODO: Close database connections, redis, etc.
  })

  return app
}
