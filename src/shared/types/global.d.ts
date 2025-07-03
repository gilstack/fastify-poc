declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // App
      NODE_ENV: 'development' | 'test' | 'production'
      HOST: string
      PORT: string
      PREFIX: string
      ALLOWED_ORIGINS: string

      // JWT
      JWT_SECRET: string
      JWT_EXPIRES_IN: string

      // Database
      DATABASE_URL: string

      // Redis
      REDIS_HOST: string
      REDIS_PORT: string
      REDIS_PASSWORD?: string

      // Email
      EMAIL_HOST: string
      EMAIL_PORT: string
      EMAIL_USER: string
      EMAIL_PASS: string
      EMAIL_FROM: string

      // BullMQ
      QUEUE_REDIS_HOST: string
      QUEUE_REDIS_PORT: string
      QUEUE_REDIS_PASSWORD?: string

      // Logging
      LOG_LEVEL?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

      // Tests
      SILENT_TESTS?: string
    }
  }
}
