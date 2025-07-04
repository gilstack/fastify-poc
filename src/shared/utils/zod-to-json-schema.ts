import { zodToJsonSchema } from 'zod-to-json-schema'

import type { z } from 'zod'

export function zodToSchema<T extends z.ZodType>(schema: T) {
  return zodToJsonSchema(schema, {
    target: 'openApi3',
    $refStrategy: 'none'
  })
}
