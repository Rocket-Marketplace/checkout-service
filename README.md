# Checkout Service

Microserviço responsável pelo gerenciamento de carrinho de compras e processamento de pedidos do marketplace.

## Funcionalidades

- Gerenciamento de carrinho de compras
- Criação e processamento de pedidos
- Integração com microserviços de produtos e pagamentos
- Validação de estoque em tempo real
- Cálculo de totais e impostos
- Eventos assíncronos com RabbitMQ
- Health checks e monitoramento
- Distributed tracing com Jaeger

## Tecnologias

- NestJS
- TypeORM
- PostgreSQL
- JWT (JSON Web Tokens)
- RabbitMQ
- OpenTelemetry + Jaeger
- Prometheus + Grafana
- Circuit Breaker

## Instalação

```bash
npm install
```

## Configuração

Configure as variáveis de ambiente:

```env
# Database
CHECKOUT_DB_HOST=localhost
CHECKOUT_DB_PORT=5434
CHECKOUT_DB_USERNAME=postgres
CHECKOUT_DB_PASSWORD=postgres
CHECKOUT_DB_NAME=checkout_db

# Service URLs
PRODUCTS_SERVICE_URL=http://localhost:3001
PAYMENTS_SERVICE_URL=http://localhost:3004

# JWT
JWT_SECRET=your-secret-key

# RabbitMQ
RABBITMQ_URL=amqp://admin:admin@localhost:5672

# Jaeger
JAEGER_ENDPOINT=http://localhost:14268/api/traces
SERVICE_NAME=checkout-service
SERVICE_VERSION=1.0.0

# Port
PORT=3003
NODE_ENV=development
```

## Execução

### Desenvolvimento

```bash
# Iniciar com monitoramento
./scripts/start.sh

# Ou manualmente
npm run start:dev
```

### Monitoramento

```bash
# Iniciar apenas monitoramento
docker-compose -f docker-compose.monitoring.yml up -d

# Parar monitoramento
docker-compose -f docker-compose.monitoring.yml down
```

### Health Check

```bash
# Verificar saúde do serviço
./scripts/health-check.sh

# Ou manualmente
curl http://localhost:3003/health
```

## URLs

- **Serviço**: http://localhost:3003
- **Health Check**: http://localhost:3003/health
- **Swagger**: http://localhost:3003/api
- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Jaeger**: http://localhost:16686

## API Endpoints

### Carrinho

- `POST /cart/add` - Adicionar item ao carrinho
- `GET /cart` - Obter itens do carrinho
- `GET /cart/total` - Calcular total do carrinho
- `PATCH /cart/:productId` - Atualizar quantidade de item
- `DELETE /cart/:productId` - Remover item do carrinho
- `DELETE /cart` - Limpar carrinho

### Pedidos

- `POST /orders` - Criar novo pedido
- `GET /orders` - Listar pedidos do usuário
- `GET /orders/:id` - Buscar pedido por ID
- `PATCH /orders/:id/status` - Atualizar status do pedido

## Eventos Publicados

- `order.created` - Pedido criado
- `order.confirmed` - Pedido confirmado
- `order.cancelled` - Pedido cancelado

## Dependências

- Products Service (validação de produtos e estoque)
- Payments Service (processamento de pagamentos)
- RabbitMQ (eventos assíncronos)
- PostgreSQL (dados do carrinho e pedidos)

## Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## Scripts Disponíveis

- `./scripts/start.sh` - Iniciar serviço com monitoramento
- `./scripts/stop.sh` - Parar serviço
- `./scripts/health-check.sh` - Verificar saúde do serviço