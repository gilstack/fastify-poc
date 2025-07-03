import { env } from '@/shared/config/env'
import { buildApp } from '@/infrastructure/http/app'

let app: Awaited<ReturnType<typeof buildApp>> | null = null

async function start(): Promise<void> {
  try {
    app = await buildApp()

    await app.listen({ host: env.HOST, port: env.PORT })

    app.log.info(`Documentation: http://${env.HOST}:${env.PORT}/docs`)
  } catch (error) {
    app?.log.error('❌ Error starting server:', error)
    process.exit(1)
  }
}

//* Graceful Shutdown
process.on('SIGINT', async () => {
  if (app) {
    app.log.info('\n⏹️  Shutting down gracefully...')
    await app.close()
  }
  process.exit(0)
})

process.on('SIGTERM', async () => {
  if (app) {
    app.log.info('\n⏹️  Shutting down gracefully...')
    await app.close()
  }
  process.exit(0)
})

void start()
