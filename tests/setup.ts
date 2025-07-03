import type { Server } from 'http'

import { config } from 'dotenv'

// Carrega variáveis de ambiente para testes
config({ path: '.env.test' })

// Armazena referências de recursos que precisam cleanup
const openHandles: Set<Server | NodeJS.Timeout> = new Set()

// Configurações globais para testes
beforeAll(() => {
  // Setup global para todos os testes
  process.env['NODE_ENV'] = 'test'
  process.env['LOG_LEVEL'] = 'error'

  // Timeout global para testes
  jest.setTimeout(10000)
})

afterAll(async () => {
  // Cleanup de recursos abertos
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

  // Aguarda um pequeno delay para garantir cleanup completo
  await new Promise((resolve) => setTimeout(resolve, 100))
})

// Mock global do console para reduzir ruído nos testes
if (process.env['SILENT_TESTS'] === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    // Mantém error para debugging
    // eslint-disable-next-line no-console
    error: console.error
  }
}

// Função helper para registrar handles que precisam cleanup
export function registerHandle(handle: Server | NodeJS.Timeout): void {
  openHandles.add(handle)
}

// Função helper para remover handles após cleanup manual
export function unregisterHandle(handle: Server | NodeJS.Timeout): void {
  openHandles.delete(handle)
}

// Extend expect com matchers customizados úteis
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
