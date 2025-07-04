# Test Organization

Este diretório contém todos os testes do projeto organizados de forma clara e funcional.

## 📁 Estrutura de Diretórios

```
tests/
├── __helpers__/           # Utilitários e helpers para testes
│   └── mocks/            # Mocks centralizados reutilizáveis
│       ├── environment.mock.ts
│       └── app.mock.ts
├── __fixtures__/         # Dados de teste fixos (JSON, arquivos, etc.)
├── unit/                 # Testes unitários organizados por funcionalidade
│   ├── config/          # Testes de configuração
│   ├── errors/          # Testes de classes de erro
│   ├── handlers/        # Testes de handlers HTTP
│   ├── middleware/      # Testes de middlewares
│   ├── plugins/         # Testes de plugins HTTP
│   ├── routes/          # Testes de rotas
│   ├── schemas/         # Testes de schemas de validação
│   └── utils/           # Testes de utilitários
├── integration/         # Testes de integração
└── e2e/                # Testes end-to-end (futuro)
```

## 🎯 Organização por Funcionalidade

### ✅ **Vantagens desta Organização:**

1. **Fácil Localização**: Encontre testes rapidamente pela funcionalidade
2. **Mocks Centralizados**: Reutilização de mocks sem duplicação
3. **Helpers Compartilhados**: Utilitários comuns para todos os testes
4. **Separação Clara**: Unit, Integration e E2E bem definidos
5. **Escalabilidade**: Fácil adição de novos tipos de teste

### 🔧 **Mocks Centralizados**

#### `__helpers__/mocks/environment.mock.ts`

- Configurações de ambiente pré-definidas
- Helpers para manipulação de env vars
- Mocks para diferentes ambientes (dev, prod, test)

#### `__helpers__/mocks/app.mock.ts`

- Mocks para configuração da aplicação
- Helpers para setup/cleanup de mocks
- Configurações de console e process

### 📝 **Convenções de Nomenclatura**

- **Arquivos de teste**: `*.test.ts`
- **Mocks**: `*.mock.ts`
- **Fixtures**: `*.fixture.ts` ou `*.json`
- **Helpers**: `*.helper.ts`

### 🚀 **Como Usar os Mocks**

```typescript
// Importar mocks centralizados
import { setTestEnv, restoreEnv, validEnvVars } from '../../__helpers__/mocks/environment.mock'
import { setupCommonMocks, cleanupMocks } from '../../__helpers__/mocks/app.mock'

describe('Meu Teste', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    restoreEnv()
  })

  it('should test something', async () => {
    setTestEnv(validEnvVars)

    const { env } = await import('@/shared/config/env')

    expect(env.NODE_ENV).toBe('development')
  })
})
```

### 🧪 **Tipos de Teste**

#### **Unit Tests** (`tests/unit/`)

- Testam componentes isolados
- Usam mocks para dependências
- Focam em lógica específica

#### **Integration Tests** (`tests/integration/`)

- Testam interação entre componentes
- Podem usar banco de dados de teste
- Verificam fluxos completos

#### **E2E Tests** (`tests/e2e/`)

- Testam aplicação completa
- Simulam interação real do usuário
- Ambiente mais próximo da produção

## 🛠️ **Scripts de Teste**

```bash
# Todos os testes
pnpm test

# Apenas testes unitários
pnpm test tests/unit

# Testes com cobertura
pnpm test:coverage

# Testes em modo watch
pnpm test:watch

# Testes de integração
pnpm test tests/integration
```

## 📊 **Cobertura de Testes**

O projeto mantém **>85%** de cobertura em:

- Statements
- Branches
- Functions
- Lines

## 🔄 **Adicionando Novos Testes**

1. **Identifique o tipo**: Unit, Integration ou E2E
2. **Escolha a categoria**: config, errors, middleware, etc.
3. **Reutilize mocks**: Use helpers centralizados quando possível
4. **Siga convenções**: Nomenclatura e organização estabelecidas
5. **Mantenha cobertura**: Garanta que novos códigos tenham testes

---

Esta organização garante **manutenibilidade**, **reutilização** e **clareza** nos testes do projeto! 🎉
