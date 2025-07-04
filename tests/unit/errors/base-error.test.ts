import { BaseError } from '@/shared/errors/base-error'

class TestError extends BaseError {
  constructor(message: string, statusCode: number, code: string, isOperational = true) {
    super(message, statusCode, code, isOperational)
  }
}

describe('BaseError', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create error with correct properties', () => {
    const error = new TestError('Test message', 400, 'TEST_ERROR')

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Test message')
    expect(error.statusCode).toBe(400)
    expect(error.code).toBe('TEST_ERROR')
    expect(error.isOperational).toBe(true)
    expect(error.name).toBe('TestError')
    expect(error.timestamp).toBeInstanceOf(Date)
    expect(error.stack).toBeDefined()
  })

  it('should set isOperational to false when specified', () => {
    const error = new TestError('Test message', 500, 'INTERNAL_ERROR', false)

    expect(error.isOperational).toBe(false)
  })

  it('should serialize to JSON correctly', () => {
    const error = new TestError('Test message', 400, 'TEST_ERROR')
    const json = error.toJSON()

    expect(json).toEqual({
      name: 'TestError',
      message: 'Test message',
      code: 'TEST_ERROR',
      statusCode: 400,
      timestamp: error.timestamp.toISOString(),
      stack: error.stack
    })
  })

  it('should have different timestamps for different instances', () => {
    const error1 = new TestError('Message 1', 400, 'ERROR_1')

    // Wait a small amount to ensure different timestamps
    setTimeout(() => {
      const error2 = new TestError('Message 2', 500, 'ERROR_2')
      expect(error1.timestamp.getTime()).toBeLessThan(error2.timestamp.getTime())
    }, 1)
  })

  it('should capture stack trace correctly', () => {
    const error = new TestError('Test message', 400, 'TEST_ERROR')

    expect(error.stack).toContain('TestError')
    expect(error.stack).toContain('Test message')
  })
})
