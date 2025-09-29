# 🛒 Checkout Service

Serviço responsável pelo gerenciamento de carrinho de compras, processamento de checkout e criação de pedidos no marketplace. Este serviço atua como orquestrador entre os demais serviços, garantindo uma experiência de compra fluida e segura.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Docker](#docker)
- [API Endpoints](#api-endpoints)
- [Contratos de Dados](#contratos-de-dados)
- [Monitoramento](#monitoramento)
- [Testes](#testes)
- [Deploy](#deploy)

## 🎯 Visão Geral

O Checkout Service é o núcleo do processo de compra no marketplace, responsável por:

- **Gerenciamento de Carrinho**: Adição, remoção e atualização de itens
- **Processamento de Checkout**: Validação e criação de pedidos
- **Orquestração de Serviços**: Comunicação com Users, Products e Payments
- **Autenticação e Autorização**: Validação de sessões de usuário
- **Circuit Breaker**: Resiliência em falhas de serviços externos
- **Eventos Assíncronos**: Comunicação via RabbitMQ

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Users Service │    │ Products Service│    │ Payments Service│
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │     Checkout Service      │
                    │  ┌─────────────────────┐  │
                    │  │   Cart Management   │  │
                    │  │   Order Processing  │  │
                    │  │   Session Auth      │  │
                    │  │   Circuit Breaker   │  │
                    │  └─────────────────────┘  │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │     Messaging Service     │
                    │      (RabbitMQ)           │
                    └───────────────────────────┘
```

## ⚡ Funcionalidades

### 🛒 Gerenciamento de Carrinho
- Adicionar produtos ao carrinho
- Atualizar quantidades
- Remover itens
- Limpar carrinho completo
- Calcular total do carrinho

### 📦 Processamento de Pedidos
- Criar pedidos a partir do carrinho
- Validar disponibilidade de produtos
- Processar checkout
- Atualizar status de pedidos
- Gerenciar status de pagamento

### 🔐 Autenticação e Segurança
- Validação de sessões JWT
- Guards de autenticação
- Autorização baseada em usuário
- Validação de dados de entrada

### 🔄 Resiliência e Comunicação
- Circuit Breaker para serviços externos
- Retry automático em falhas
- Fallback strategies
- Eventos assíncronos via RabbitMQ

## 🛠️ Tecnologias

- **Framework**: NestJS 11.x
- **Linguagem**: TypeScript 5.x
- **Banco de Dados**: PostgreSQL 15
- **ORM**: TypeORM
- **Autenticação**: JWT + Passport
- **Validação**: class-validator + class-transformer
- **Documentação**: Swagger/OpenAPI
- **Monitoramento**: Prometheus + Grafana
- **Tracing**: OpenTelemetry + Jaeger
- **Mensageria**: RabbitMQ (amqplib)
- **Containerização**: Docker + Docker Compose

## 📋 Pré-requisitos

- Node.js 18.x ou superior
- npm 9.x ou superior
- PostgreSQL 15
- Docker e Docker Compose (opcional)
- RabbitMQ (para eventos)

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd checkout-service
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
PORT=3003
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=checkout_db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Serviços Externos
USERS_SERVICE_URL=http://localhost:3000
PRODUCTS_SERVICE_URL=http://localhost:3001
PAYMENTS_SERVICE_URL=http://localhost:3002
MESSAGING_SERVICE_URL=http://localhost:3005

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_QUEUE_PAYMENTS=payment_queue
RABBITMQ_QUEUE_ORDERS=order_queue

# Monitoramento
JAEGER_ENDPOINT=http://localhost:14268/api/traces
PROMETHEUS_PORT=9090
```

### Configuração do Banco de Dados

1. **Crie o banco de dados**
```sql
CREATE DATABASE checkout_db;
```

2. **Execute as migrações**
```bash
npm run migration:run
```

## 🏃‍♂️ Execução

### Desenvolvimento

```bash
# Modo desenvolvimento com hot reload
npm run start:dev

# Modo debug
npm run start:debug

# Build e execução
npm run build
npm run start:prod
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Inicia com watch mode
npm run start:debug        # Inicia em modo debug

# Build
npm run build              # Compila TypeScript
npm run start:prod         # Executa versão compilada

# Testes
npm run test               # Executa testes unitários
npm run test:watch         # Executa testes em watch mode
npm run test:cov           # Executa testes com coverage
npm run test:e2e           # Executa testes end-to-end

# Qualidade de Código
npm run lint               # Executa ESLint
npm run format             # Formata código com Prettier
```

## 🐳 Docker

### Docker Compose (Recomendado)

```bash
# Inicia todos os serviços
docker-compose up -d

# Inicia apenas o serviço
docker-compose up checkout-service

# Para os serviços
docker-compose down

# Rebuild da imagem
docker-compose up --build
```

### Docker Manual

```bash
# Build da imagem
docker build -t checkout-service .

# Executa o container
docker run -p 3003:3003 \
  -e DB_HOST=host.docker.internal \
  -e USERS_SERVICE_URL=http://host.docker.internal:3000 \
  checkout-service
```

### Serviços Incluídos no Docker Compose

- **checkout-service**: Aplicação principal (porta 3003)
- **checkout-db**: PostgreSQL (porta 5434)
- **Prometheus**: Monitoramento (porta 9090)
- **Grafana**: Dashboards (porta 3000)

## 📡 API Endpoints

### 🛒 Carrinho

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/cart/add` | Adiciona item ao carrinho | ✅ |
| GET | `/cart` | Obtém carrinho do usuário | ✅ |
| GET | `/cart/total` | Calcula total do carrinho | ✅ |
| POST | `/cart/checkout` | Processa checkout | ✅ |
| PATCH | `/cart/:productId` | Atualiza quantidade | ✅ |
| DELETE | `/cart/:productId` | Remove item do carrinho | ✅ |
| DELETE | `/cart` | Limpa carrinho | ✅ |

### 📦 Pedidos

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/orders` | Cria novo pedido | ✅ |
| GET | `/orders` | Lista pedidos do usuário | ✅ |
| GET | `/orders/:id` | Obtém pedido por ID | ✅ |
| PATCH | `/orders/:id/status` | Atualiza status do pedido | ✅ |
| PATCH | `/orders/:id/payment-status` | Atualiza status de pagamento | ✅ |

### 🏥 Health Check

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Status da aplicação |
| GET | `/health/ready` | Readiness probe |
| GET | `/health/live` | Liveness probe |

## 📊 Contratos de Dados

### AddToCartDto
```typescript
{
  productId: string;
  quantity: number;
}
```

### UpdateCartDto
```typescript
{
  quantity: number;
}
```

### CheckoutDto
```typescript
{
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}
```

### Order Entity
```typescript
{
  id: string;
  buyerId: string;
  status: OrderStatus;
  paymentStatus: string;
  total: number;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}
```

### OrderItem Entity
```typescript
{
  id: string;
  productId: string;
  quantity: number;
  price: number;
  orderId: string;
}
```

## 📈 Monitoramento

### Métricas Prometheus

- `http_requests_total`: Total de requisições HTTP
- `http_request_duration_seconds`: Duração das requisições
- `cart_operations_total`: Operações de carrinho
- `order_operations_total`: Operações de pedidos
- `circuit_breaker_state`: Estado do circuit breaker

### Dashboards Grafana

Acesse: `http://localhost:3000`

- **Checkout Dashboard**: Métricas do serviço
- **Business Metrics**: Métricas de negócio
- **Infrastructure**: Métricas de infraestrutura

### Tracing Jaeger

Acesse: `http://localhost:16686`

- Traces distribuídos
- Performance analysis
- Dependency mapping

## 🧪 Testes

### Executar Testes

```bash
# Testes unitários
npm run test

# Testes com coverage
npm run test:cov

# Testes end-to-end
npm run test:e2e

# Testes em watch mode
npm run test:watch
```

### Estrutura de Testes

```
test/
├── app.e2e-spec.ts          # Testes E2E
├── jest-e2e.json           # Configuração Jest E2E
src/
├── **/*.spec.ts            # Testes unitários
└── **/*.controller.spec.ts # Testes de controllers
```

## 🚀 Deploy

### Script de Deploy

```bash
# Executa o script de deploy
./deploy.sh
```

### Deploy Manual

```bash
# Build da aplicação
npm run build

# Executa migrações
npm run migration:run

# Inicia em produção
npm run start:prod
```

### Variáveis de Ambiente para Produção

```env
NODE_ENV=production
PORT=3003
DB_HOST=your-production-db-host
JWT_SECRET=your-production-secret
USERS_SERVICE_URL=https://users.yourdomain.com
PRODUCTS_SERVICE_URL=https://products.yourdomain.com
PAYMENTS_SERVICE_URL=https://payments.yourdomain.com
```

## 🔧 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco**
   - Verifique se o PostgreSQL está rodando
   - Confirme as credenciais no `.env`

2. **Erro de autenticação**
   - Verifique o `JWT_SECRET`
   - Confirme se o Users Service está acessível

3. **Circuit Breaker aberto**
   - Verifique a saúde dos serviços externos
   - Aguarde o timeout de recuperação

### Logs

```bash
# Logs da aplicação
docker-compose logs -f checkout-service

# Logs do banco
docker-compose logs -f checkout-db
```

## 📚 Documentação Adicional

- [Swagger UI](http://localhost:3003/api) - Documentação interativa da API
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ para o Marketplace API**