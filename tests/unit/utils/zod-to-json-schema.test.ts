import { z } from 'zod'

import { zodToSchema } from '@/shared/utils/zod-to-json-schema'

describe('zodToSchema', () => {
  it('should convert string schema to JSON schema', () => {
    const schema = z.string()
    const result = zodToSchema(schema)

    expect(result).toEqual({
      type: 'string'
    })
  })

  it('should convert number schema to JSON schema', () => {
    const schema = z.number()
    const result = zodToSchema(schema)

    expect(result).toEqual({
      type: 'number'
    })
  })

  it('should convert object schema to JSON schema', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number()
    })
    const result = zodToSchema(schema)

    expect(result).toMatchObject({
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' }
      },
      required: ['name', 'age'],
      additionalProperties: false
    })
  })

  it('should convert array schema to JSON schema', () => {
    const schema = z.array(z.string())
    const result = zodToSchema(schema)

    expect(result).toMatchObject({
      type: 'array',
      items: { type: 'string' }
    })
  })

  it('should convert enum schema to JSON schema', () => {
    const schema = z.enum(['option1', 'option2', 'option3'])
    const result = zodToSchema(schema)

    expect(result).toMatchObject({
      type: 'string',
      enum: ['option1', 'option2', 'option3']
    })
  })

  it('should convert optional schema to JSON schema', () => {
    const schema = z.object({
      required: z.string(),
      optional: z.string().optional()
    })
    const result = zodToSchema(schema)

    expect(result).toMatchObject({
      type: 'object',
      properties: {
        required: { type: 'string' },
        optional: { type: 'string' }
      },
      required: ['required'],
      additionalProperties: false
    })
  })

  it('should handle complex nested schemas', () => {
    const schema = z.object({
      user: z.object({
        name: z.string(),
        contacts: z.array(
          z.object({
            type: z.enum(['email', 'phone']),
            value: z.string()
          })
        )
      }),
      metadata: z.record(z.unknown()).optional()
    })

    const result = zodToSchema(schema)

    expect(result).toMatchObject({
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            contacts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['email', 'phone'] },
                  value: { type: 'string' }
                },
                required: ['type', 'value'],
                additionalProperties: false
              }
            }
          },
          required: ['name', 'contacts'],
          additionalProperties: false
        },
        metadata: {
          type: 'object',
          additionalProperties: {}
        }
      },
      required: ['user'],
      additionalProperties: false
    })
  })
})
