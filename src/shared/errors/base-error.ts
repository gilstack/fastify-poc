export abstract class BaseError extends Error {
  public readonly code: string
  public readonly isOperational: boolean
  public readonly statusCode: number
  public readonly timestamp: Date

  constructor(message: string, statusCode: number, code: string, isOperational = true) {
    super(message)

    this.statusCode = statusCode
    this.code = code
    this.timestamp = new Date()
    this.isOperational = isOperational

    // Keep the appropriate stack trace
    Error.captureStackTrace(this, this.constructor)

    // Define the name of the class as the error name
    this.name = this.constructor.name
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack
    }
  }
}
