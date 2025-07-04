# Docker Setup

Este documento descreve como usar o Docker para executar o projeto localmente.

## Pré-requisitos

- Docker Engine 20.10+
- Docker Compose v2.0+

## Arquivos Docker

### Dockerfile

- **Multi-stage build** com três estágios:
  - `builder`: Compila o TypeScript
  - `production`: Imagem otimizada para produção
  - `development`: Imagem para desenvolvimento com hot-reload

### docker-compose.yml

Orquestra os seguintes serviços:

- **api**: Aplicação backend (porta 3000)
- **postgres**: PostgreSQL 16 (porta 5432)
- **redis**: Redis 7 (porta 6379)
- **mailhog**: Servidor SMTP para testes (porta 1025 e Web UI na 8025)

### docker-compose.test.yml

Ambiente isolado para testes:

- **postgres-test**: PostgreSQL em memória (porta 5433)
- **redis-test**: Redis em memória (porta 6380)

## Comandos Disponíveis

### Desenvolvimento

```bash
# Construir as imagens
pnpm docker:build

# Subir os containers
pnpm docker:up

# Ver logs da API
pnpm docker:logs

# Acessar shell do container
pnpm docker:shell

# Parar os containers
pnpm docker:down

# Limpar volumes e containers
pnpm docker:clean
```

### Testes

```bash
# Subir ambiente de testes
pnpm docker:test:up

# Executar testes
pnpm test

# Parar ambiente de testes
pnpm docker:test:down
```

## Variáveis de Ambiente

O projeto usa um único arquivo `.env` para todos os ambientes:

```bash
# Copiar o exemplo
cp .env.example .env
```

### Configuração Unificada

- **Desenvolvimento**: Sempre roda com Docker (hosts: postgres, redis, mailhog)
- **Testes**: Usa o mesmo .env com NODE_ENV=test
- **Produção**: Ajustar hosts conforme deploy

### Serviços Disponíveis no Docker

- **PostgreSQL**: porta 5432
- **Redis**: porta 6379
- **Mailhog SMTP**: porta 1025
- **Mailhog Web UI**: http://localhost:8025

## Volumes

### Desenvolvimento

- Código fonte é montado como volume para hot-reload
- `node_modules` e `dist` são isolados em volumes anônimos

### Produção

- `postgres_data`: Dados do PostgreSQL
- `redis_data`: Dados do Redis

## Redes

- `storagie-network`: Rede para desenvolvimento
- `storagie-test-network`: Rede isolada para testes

## Troubleshooting

### Porta já em uso

```bash
# Verificar processos usando as portas
lsof -i :3000
lsof -i :5432
lsof -i :6379
```

### Limpar cache do Docker

```bash
docker system prune -a --volumes
```

### Rebuild forçado

```bash
docker compose build --no-cache
```

## Performance

### Otimizações implementadas:

- Alpine Linux para imagens menores
- Multi-stage build para reduzir tamanho final
- Layer caching otimizado
- Instalação apenas de dependências de produção
- Usuário não-root para segurança
- Health checks para todos os serviços
