# Checkout Service

Microserviço responsável pelo gerenciamento de carrinho de compras e processamento de pedidos do marketplace.

## Funcionalidades

- Gerenciamento de carrinho de compras
- Criação e processamento de pedidos
- Integração com microserviços de produtos e pagamentos
- Validação de estoque em tempo real
- Cálculo de totais e impostos
- API REST com documentação Swagger

## Tecnologias

- NestJS
- TypeORM
- PostgreSQL
- JWT (JSON Web Tokens)
- Axios (HTTP client)
- Swagger/OpenAPI
- Jest (testes)

## Instalação

```bash
npm install
```

## Configuração

Configure as variáveis de ambiente:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=checkout_db
PORT=3003
JWT_SECRET=your-secret-key
PRODUCTS_SERVICE_URL=http://localhost:3001
PAYMENTS_SERVICE_URL=http://localhost:3004
NODE_ENV=development
```

## Execução

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run start:prod
```

## Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

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

### Documentação

Acesse a documentação Swagger em: `http://localhost:3003/api`

## Estrutura do Projeto

```
src/
├── orders/
│   ├── entities/
│   │   ├── order.entity.ts
│   │   └── order-item.entity.ts
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── orders.module.ts
├── cart/
│   ├── entities/
│   │   └── cart.entity.ts
│   ├── cart.controller.ts
│   ├── cart.service.ts
│   └── cart.module.ts
├── services/
│   ├── products.service.ts
│   └── payments.service.ts
├── auth/
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   └── strategies/
│       └── jwt.strategy.ts
├── common/
│   └── dto/
│       ├── create-order.dto.ts
│       ├── add-to-cart.dto.ts
│       └── update-cart.dto.ts
├── config/
│   └── database.config.ts
├── app.module.ts
└── main.ts
```

## Modelo de Dados

### Order

- `id`: UUID (chave primária)
- `buyerId`: ID do comprador
- `status`: Status do pedido (pending/confirmed/processing/shipped/delivered/cancelled)
- `totalAmount`: Valor total do pedido
- `shippingAddress`: Endereço de entrega
- `billingAddress`: Endereço de cobrança
- `paymentMethod`: Método de pagamento
- `paymentStatus`: Status do pagamento
- `paymentId`: ID do pagamento
- `shippingCost`: Custo de frete
- `taxAmount`: Valor dos impostos
- `discountAmount`: Valor do desconto
- `notes`: Observações do pedido
- `trackingNumber`: Número de rastreamento
- `estimatedDeliveryDate`: Data estimada de entrega
- `items`: Itens do pedido
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

### OrderItem

- `id`: UUID (chave primária)
- `orderId`: ID do pedido
- `productId`: ID do produto
- `productName`: Nome do produto
- `productPrice`: Preço do produto no momento da compra
- `quantity`: Quantidade comprada
- `totalPrice`: Preço total do item
- `sellerId`: ID do vendedor

### Cart

- `id`: UUID (chave primária)
- `userId`: ID do usuário
- `productId`: ID do produto
- `productName`: Nome do produto
- `productPrice`: Preço do produto
- `quantity`: Quantidade no carrinho
- `sellerId`: ID do vendedor
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

## Status de Pedidos

- **PENDING**: Pedido pendente
- **CONFIRMED**: Pedido confirmado
- **PROCESSING**: Pedido em processamento
- **SHIPPED**: Pedido enviado
- **DELIVERED**: Pedido entregue
- **CANCELLED**: Pedido cancelado

## Integração com Outros Microserviços

### Products Service
- Validação de produtos e estoque
- Atualização de estoque após compra
- Verificação de disponibilidade

### Payments Service
- Processamento de pagamentos
- Validação de métodos de pagamento
- Confirmação de transações

## Fluxo de Checkout

1. **Adicionar ao Carrinho**: Usuário adiciona produtos ao carrinho
2. **Validar Estoque**: Sistema verifica disponibilidade dos produtos
3. **Criar Pedido**: Usuário finaliza compra criando um pedido
4. **Processar Pagamento**: Sistema processa pagamento via microserviço de pagamentos
5. **Atualizar Estoque**: Estoque é reduzido após confirmação do pagamento
6. **Limpar Carrinho**: Carrinho é limpo após sucesso do pedido

## Autenticação

O serviço utiliza JWT (JSON Web Tokens) para autenticação. Para acessar endpoints protegidos, inclua o token no header:

```
Authorization: Bearer <token>
```

## Validações

- Produtos devem estar ativos e com estoque suficiente
- Quantidades devem ser positivas
- Endereços de entrega e cobrança são obrigatórios
- Método de pagamento deve ser válido

## Tratamento de Erros

- Validação de estoque em tempo real
- Rollback automático em caso de falha no pagamento
- Cancelamento de pedido em caso de erro
- Mensagens de erro descritivas para o usuário