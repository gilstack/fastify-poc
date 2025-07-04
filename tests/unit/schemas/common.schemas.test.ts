import { z } from 'zod'
import {
  paginationQuerySchema,
  idParamSchema,
  emailSchema,
  passwordSchema,
  dateSchema,
  uuidSchema,
  successResponseSchema,
  errorResponseSchema,
  paginatedResponseSchema
} from '@/presentation/schemas/common.schemas'

describe('Common Schemas', () => {
  describe('paginationQuerySchema', () => {
    it('should validate valid pagination query', () => {
      const validData = {
        page: '1',
        limit: '10',
        orderBy: 'name',
        order: 'asc' as const
      }

      const result = paginationQuerySchema.parse(validData)
      expect(result).toEqual({
        page: 1,
        limit: 10,
        orderBy: 'name',
        order: 'asc'
      })
    })

    it('should use default values when not provided', () => {
      const result = paginationQuerySchema.parse({})
      expect(result).toEqual({
        page: 1,
        limit: 10,
        order: 'asc'
      })
    })

    it('should reject invalid page number', () => {
      expect(() => {
        paginationQuerySchema.parse({ page: '0' })
      }).toThrow()
    })

    it('should reject limit exceeding maximum', () => {
      expect(() => {
        paginationQuerySchema.parse({ limit: '101' })
      }).toThrow()
    })
  })

  describe('idParamSchema', () => {
    it('should validate valid UUID', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000'
      const result = idParamSchema.parse({ id: validUUID })
      expect(result).toEqual({ id: validUUID })
    })

    it('should reject invalid UUID format', () => {
      expect(() => {
        idParamSchema.parse({ id: 'invalid-uuid' })
      }).toThrow()
    })
  })

  describe('emailSchema', () => {
    it('should validate valid email', () => {
      const result = emailSchema.parse('user@example.com')
      expect(result).toBe('user@example.com')
    })

    it('should convert email to lowercase', () => {
      const result = emailSchema.parse('USER@EXAMPLE.COM')
      expect(result).toBe('user@example.com')
    })

    it('should reject invalid email format', () => {
      expect(() => {
        emailSchema.parse('invalid-email')
      }).toThrow()
    })
  })

  describe('passwordSchema', () => {
    it('should validate strong password', () => {
      const strongPassword = 'StrongPass123!'
      const result = passwordSchema.parse(strongPassword)
      expect(result).toBe(strongPassword)
    })

    it('should reject password without uppercase letter', () => {
      expect(() => {
        passwordSchema.parse('weakpass123!')
      }).toThrow()
    })

    it('should reject password without lowercase letter', () => {
      expect(() => {
        passwordSchema.parse('STRONGPASS123!')
      }).toThrow()
    })

    it('should reject password without number', () => {
      expect(() => {
        passwordSchema.parse('StrongPass!')
      }).toThrow()
    })

    it('should reject password without special character', () => {
      expect(() => {
        passwordSchema.parse('StrongPass123')
      }).toThrow()
    })

    it('should reject password less than 8 characters', () => {
      expect(() => {
        passwordSchema.parse('Str0ng!')
      }).toThrow()
    })
  })

  describe('dateSchema', () => {
    it('should validate valid date string', () => {
      const result = dateSchema.parse('2023-01-01')
      expect(result).toBeInstanceOf(Date)
    })

    it('should validate Date object', () => {
      const date = new Date()
      const result = dateSchema.parse(date)
      expect(result).toEqual(date)
    })
  })

  describe('uuidSchema', () => {
    it('should validate valid UUID', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000'
      const result = uuidSchema.parse(validUUID)
      expect(result).toBe(validUUID)
    })

    it('should reject invalid UUID', () => {
      expect(() => {
        uuidSchema.parse('invalid-uuid')
      }).toThrow()
    })
  })

  describe('successResponseSchema', () => {
    it('should validate success response with data', () => {
      const dataSchema = z.object({ name: z.string() })
      const schema = successResponseSchema(dataSchema)

      const validResponse = {
        success: true as const,
        data: { name: 'John' }
      }

      const result = schema.parse(validResponse)
      expect(result).toEqual(validResponse)
    })

    it('should validate success response with meta', () => {
      const dataSchema = z.string()
      const schema = successResponseSchema(dataSchema)

      const validResponse = {
        success: true as const,
        data: 'test',
        meta: { total: 1 }
      }

      const result = schema.parse(validResponse)
      expect(result).toEqual(validResponse)
    })
  })

  describe('errorResponseSchema', () => {
    it('should validate error response', () => {
      const validError = {
        success: false as const,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          timestamp: '2023-01-01T00:00:00.000Z',
          path: '/api/test'
        }
      }

      const result = errorResponseSchema.parse(validError)
      expect(result).toEqual(validError)
    })

    it('should validate error response with details', () => {
      const validError = {
        success: false as const,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: { fields: ['name'] },
          timestamp: '2023-01-01T00:00:00.000Z',
          path: '/api/test'
        }
      }

      const result = errorResponseSchema.parse(validError)
      expect(result).toEqual(validError)
    })
  })

  describe('paginatedResponseSchema', () => {
    it('should validate paginated response', () => {
      const itemSchema = z.object({ id: z.string(), name: z.string() })
      const schema = paginatedResponseSchema(itemSchema)

      const validResponse = {
        success: true as const,
        data: [
          { id: '1', name: 'Item 1' },
          { id: '2', name: 'Item 2' }
        ],
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false
        }
      }

      const result = schema.parse(validResponse)
      expect(result).toEqual(validResponse)
    })

    it('should reject invalid pagination meta', () => {
      const itemSchema = z.string()
      const schema = paginatedResponseSchema(itemSchema)

      expect(() => {
        schema.parse({
          success: true,
          data: ['item1'],
          meta: {
            total: 'invalid', // Should be number
            page: 1,
            limit: 10,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false
          }
        })
      }).toThrow()
    })
  })
})
