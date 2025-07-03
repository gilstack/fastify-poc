/* eslint-disable no-console */

import { config } from 'dotenv'
import { z } from 'zod'

config()

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().positive().default(3000),
  PREFIX: z.string().default('/api/v1'),

  // CORS
  ALLOWED_ORIGINS: z.string().transform((val) => val.split(',').map((origin) => origin.trim())),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().positive().default(6379),
  REDIS_PASSWORD: z.string().optional().default(''),

  // Email
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.coerce.number().positive(),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
  EMAIL_FROM: z.string().email(),

  // BullMQ
  QUEUE_REDIS_HOST: z.string().default('localhost'),
  QUEUE_REDIS_PORT: z.coerce.number().positive().default(6379),
  QUEUE_REDIS_PASSWORD: z.string().optional().default(''),

  // Logging
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info')
})

//* Type inferred from the schema
export type Env = z.infer<typeof envSchema>

//* Validate and export the environment variables
const parseResult = envSchema.safeParse(process.env)
if (!parseResult.success) {
  console.error('❌ Invalid environment variables:')
  console.error(parseResult.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parseResult.data

//* Helper to check environment
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'
