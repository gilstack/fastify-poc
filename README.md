# Storagie Backend

Uma API REST robusta e escalável construída com **Fastify**, **TypeScript** e **Clean Architecture** para máxima flexibilidade e manutenibilidade.

## 🚀 Tecnologias

- **Framework:** Fastify
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL + Prisma
- **Cache:** Redis
- **Filas:** BullMQ
- **Email:** Nodemailer
- **Testes:** Jest
- **Qualidade:** ESLint + Prettier

## 📁 Estrutura do Projeto

```
src/
├── application/          # Casos de uso
│   ├── use-cases/
│   └── interfaces/
├── domain/              # Entidades e regras de negócio
│   ├── entities/
│   ├── repositories/
│   └── services/
├── infrastructure/      # Implementações externas
│   ├── database/
│   ├── cache/
│   ├── email/
│   ├── queue/
│   └── http/
├── presentation/        # Controllers e rotas
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   └── schemas/
└── shared/             # Utilitários compartilhados
    ├── errors/
    ├── types/
    └── utils/
```

## 🛠️ Comandos Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia o servidor em modo de desenvolvimento
pnpm build            # Compila o TypeScript
pnpm start            # Inicia o servidor em produção

# Qualidade de Código
pnpm lint             # Executa ESLint
pnpm format           # Executa Prettier
pnpm type-check       # Verifica tipos TypeScript

# Testes
pnpm test             # Executa todos os testes
pnpm test:watch       # Executa testes em modo watch
pnpm test:coverage    # Executa testes com coverage
pnpm test:e2e         # Executa testes E2E

# Banco de Dados
pnpm db:migrate       # Executa migrations
pnpm db:generate      # Gera cliente Prisma
pnpm db:push          # Push schema para o banco
pnpm db:studio        # Abre Prisma Studio
pnpm db:seed          # Executa seeds
```

## 🔧 Configuração

1. Copie o arquivo `.env.example` para `.env`
2. Configure as variáveis de ambiente
3. Execute as migrations do banco de dados

## 🏗️ Arquitetura

O projeto segue os princípios da **Arquitetura Limpa** (Clean Architecture):

- **Separação de responsabilidades**
- **Inversão de dependências**
- **Independência de frameworks**
- **Testabilidade**
- **Facilidade de manutenção**

## 🧪 Testes

- **Unitários:** Testam casos de uso isoladamente
- **Integração:** Testam integração entre camadas
- **E2E:** Testam fluxos completos da API

## 📝 Padrões de Código

- **Zero uso de `any`** - Tipagem forte em todo o projeto
- **Imports consistentes** - Uso de type imports quando apropriado
- **Código limpo** - Seguindo princípios SOLID
- **Documentação** - JSDoc em funções complexas
