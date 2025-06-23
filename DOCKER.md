# Docker Setup para Front-AI

Este projeto inclui configuração Docker para desenvolvimento e produção.

## Arquivos Docker

- `Dockerfile` - Imagem de produção otimizada
- `Dockerfile.dev` - Imagem para desenvolvimento
- `docker-compose.yml` - Configuração de produção
- `docker-compose.dev.yml` - Configuração de desenvolvimento
- `nginx.conf` - Configuração do Nginx (opcional)
- `.dockerignore` - Arquivos a serem ignorados no build

## Executando em Desenvolvimento

```bash
# Build e execução em modo desenvolvimento
docker-compose -f docker-compose.dev.yml up --build

# Executar em background
docker-compose -f docker-compose.dev.yml up -d --build

# Parar os serviços
docker-compose -f docker-compose.dev.yml down
```

A aplicação estará disponível em: http://localhost:3000

## Executando em Produção

```bash
# Build e execução em modo produção
docker-compose up --build

# Executar em background
docker-compose up -d --build

# Parar os serviços
docker-compose down
```

Com Nginx (proxy reverso):
- Aplicação: http://localhost:3000
- Nginx: http://localhost:80

## Comandos Úteis

```bash
# Ver logs dos containers
docker-compose logs -f

# Executar comandos dentro do container
docker-compose exec front-ai sh

# Rebuild apenas a aplicação
docker-compose build front-ai

# Limpar volumes e containers
docker-compose down -v
docker system prune -a
```

## Variáveis de Ambiente

Você pode criar um arquivo `.env` na raiz do projeto para definir variáveis de ambiente:

```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
# Adicione outras variáveis conforme necessário
```

## Estrutura dos Serviços

### Produção
- **front-ai**: Aplicação Next.js otimizada
- **nginx**: Proxy reverso (opcional)

### Desenvolvimento
- **front-ai-dev**: Aplicação Next.js com hot reload

## Notas

- O Dockerfile de produção usa multi-stage build para otimizar o tamanho da imagem
- O modo desenvolvimento monta o código fonte para hot reload
- A configuração standalone do Next.js é necessária para Docker
- O Nginx é opcional mas recomendado para produção
