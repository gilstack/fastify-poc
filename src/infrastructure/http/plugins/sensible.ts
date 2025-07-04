import sensible from '@fastify/sensible'

import type { FastifyInstance } from 'fastify'

export async function configureSensible(app: FastifyInstance): Promise<void> {
  await app.register(sensible, {
    sharedSchemaId: 'HttpError'
  })
}
