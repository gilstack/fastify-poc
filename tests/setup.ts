import type { Server } from 'http'

import { config } from 'dotenv'
import { setTestEnv, testEnvVars } from './__mocks__/environment.mock'

// Load environment variables
config()

// Set environment for tests
setTestEnv(testEnvVars)

// Store references to resources that need cleanup
const openHandles: Set<Server | NodeJS.Timeout> = new Set()

// Global settings for tests
beforeAll(() => {
  // Global timeout for tests
  jest.setTimeout(10000)
})

afterAll(async () => {
  // Cleanup open resources
  const handlePromises = Array.from(openHandles).map((handle) => {
    if ('close' in handle) {
      return new Promise<void>((resolve) => {
        handle.close(() => resolve())
      })
    } else {
      clearTimeout(handle)
      return Promise.resolve()
    }
  })

  await Promise.all(handlePromises)
  openHandles.clear()

  if (global.gc) global.gc()

  // Wait for a small delay to ensure complete cleanup
  await new Promise((resolve) => setTimeout(resolve, 100))
})

// Mock global console to reduce noise in tests
if (process.env['SILENT_TESTS'] === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    // Keep error for debugging
    // eslint-disable-next-line no-console
    error: console.error
  }
}

// Helper function to register handles that need cleanup
export function registerHandle(handle: Server | NodeJS.Timeout): void {
  openHandles.add(handle)
}

// Helper function to remove handles after manual cleanup
export function unregisterHandle(handle: Server | NodeJS.Timeout): void {
  openHandles.delete(handle)
}

// Extend expect with useful custom matchers
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(floor: number, ceiling: number): R
    }
  }
}

expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true
      }
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false
      }
    }
  }
})
