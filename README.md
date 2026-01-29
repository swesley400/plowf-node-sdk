# @plowf/sdk

SDK oficial Node.js para integração com a API do Plowf - Cobranças PIX, Transferências e Webhooks.

[![npm version](https://badge.fury.io/js/@plowf%2Fsdk.svg)](https://www.npmjs.com/package/@plowf/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## Índice

- [Instalação](#instalação)
- [Quick Start](#quick-start)
- [Configuração](#configuração)
- [Recursos](#recursos)
  - [Cobranças (Payments)](#cobranças-payments)
  - [Transferências (Transfers)](#transferências-transfers)
  - [Webhooks](#webhooks)
- [Interfaces e Tipos](#interfaces-e-tipos)
- [Tratamento de Erros](#tratamento-de-erros)
- [Exemplos Completos](#exemplos-completos)

---

## Instalação

```bash
npm install @plowf/sdk
```

```bash
yarn add @plowf/sdk
```

```bash
pnpm add @plowf/sdk
```

**Requisitos:** Node.js >= 16.0.0

---

## Quick Start

```typescript
import { PlowfClient } from '@plowf/sdk';

const plowf = new PlowfClient({
    apiKey: 'sua_api_key',
});

// Criar uma cobrança PIX
const charge = await plowf.payments.create({
    type: 'pix',
    value: 1500, // R$ 15,00 em centavos
});

console.log('PIX Copia e Cola:', charge.data.payment?.payload);
```

---

## Configuração

### PlowfConfig

| Propriedade | Tipo | Obrigatório | Padrão | Descrição |
|-------------|------|-------------|--------|-----------|
| `apiKey` | `string` | ✅ | - | Sua chave de API do Plowf |
| `timeout` | `number` | ❌ | `30000` | Timeout das requisições em ms |
| `retries` | `number` | ❌ | `3` | Número de tentativas em caso de falha |
| `rejectUnauthorized` | `boolean` | ❌ | `true` | Verificação SSL (use `false` apenas em dev) |

```typescript
const plowf = new PlowfClient({
    apiKey: 'ak_sua_chave_aqui',
    timeout: 60000,
    retries: 5,
    rejectUnauthorized: true, // false apenas para desenvolvimento local
});
```

---

## Recursos

### Cobranças (Payments)

Gerencie cobranças PIX (recebimentos).

#### Métodos Disponíveis

| Método | Descrição |
|--------|-----------|
| `list(params?)` | Lista cobranças com paginação e filtros |
| `get(uuid)` | Busca uma cobrança pelo UUID |
| `create(data)` | Cria uma nova cobrança PIX |
| `refund(uuid, data?)` | Estorna uma cobrança (total ou parcial) |

#### Listar Cobranças

```typescript
const response = await plowf.payments.list({
    page: 1,
    per_page: 20,
    status: 'PAID',
    type: 'PIX',
});

console.log('Total:', response.meta.total);
console.log('Cobranças:', response.data);
```

#### Criar Cobrança

```typescript
const charge = await plowf.payments.create({
    type: 'pix',
    value: 10000, // R$ 100,00 em centavos
    external_ref: 'PEDIDO-12345',
    final_beneficiary: {
        name: 'João da Silva',
        document: '12345678900',
    },
});

// Dados do PIX gerado
console.log('UUID:', charge.data.uuid);
console.log('Status:', charge.data.status);
console.log('PIX Copia e Cola:', charge.data.payment?.payload);
```

#### Buscar Cobrança

```typescript
const charge = await plowf.payments.get('770e8400-e29b-41d4-a716-446655440000');
console.log('Status:', charge.data.status);
```

#### Estornar Cobrança

```typescript
// Estorno total
await plowf.payments.refund('770e8400-e29b-41d4-a716-446655440000');

// Estorno parcial
await plowf.payments.refund('770e8400-e29b-41d4-a716-446655440000', {
    value: 5000, // R$ 50,00
});
```

---

### Transferências (Transfers)

Gerencie transferências PIX (envios).

#### Métodos Disponíveis

| Método | Descrição |
|--------|-----------|
| `list(params?)` | Lista transferências com paginação e filtros |
| `get(uuid)` | Busca uma transferência pelo UUID |
| `create(data)` | Cria uma nova transferência PIX |

#### Listar Transferências

```typescript
const response = await plowf.transfers.list({
    page: 1,
    per_page: 20,
    status: 'PAID',
});

console.log('Total:', response.meta.total);
```

#### Criar Transferência

```typescript
const transfer = await plowf.transfers.create({
    value: 5000, // R$ 50,00 em centavos
    pix_key: 'email@exemplo.com',
    account_uuid: '785f6c70-1402-4d49-9ff3-8224b16aa497', // opcional
    external_ref: 'TRANSF-001',
    final_beneficiary: {
        name: 'Maria Santos',
        document: '98765432100',
    },
});

console.log('UUID:', transfer.data.uuid);
console.log('Status:', transfer.data.status);
```

#### Buscar Transferência

```typescript
const transfer = await plowf.transfers.get('550e8400-e29b-41d4-a716-446655440000');
console.log('End-to-End:', transfer.data.transfer?.end_to_end);
```

---

### Webhooks

Gerencie webhooks para receber notificações de eventos.

#### Métodos Disponíveis

| Método | Descrição |
|--------|-----------|
| `list(params?)` | Lista webhooks com paginação e filtros |
| `get(uuid)` | Busca um webhook pelo UUID |
| `create(data)` | Cria um novo webhook |
| `delete(uuid)` | Remove um webhook |

#### Listar Webhooks

```typescript
const response = await plowf.webhooks.list({
    status: 'ACTIVE',
});
```

#### Criar Webhook

```typescript
const webhook = await plowf.webhooks.create({
    url: 'https://api.seusite.com/webhooks/plowf',
    token: 'seu_token_secreto', // opcional, para validação
});

console.log('UUID:', webhook.data.uuid);
```

#### Deletar Webhook

```typescript
await plowf.webhooks.delete('e1afe0f4-9358-4a50-b0fd-55912ca86ee1');
```

---

## Interfaces e Tipos

### Configuração

```typescript
interface PlowfConfig {
    apiKey: string;
    timeout?: number;
    retries?: number;
    rejectUnauthorized?: boolean;
}
```

### Cobranças

```typescript
interface Charge {
    uuid: string;
    value: number;
    total_value: number;
    fees: number;
    currency: string;
    status: ChargeStatus;
    type: ChargeType;
    payment: PaymentDetails | null;
    external_ref: string | null;
    final_beneficiary: FinalBeneficiary | null;
    history: StatusHistory[];
    created_at: string;
    updated_at: string;
}

interface CreateChargeData {
    type: 'pix';
    value: number;
    external_ref?: string;
    final_beneficiary?: FinalBeneficiary;
}

interface ListChargesParams {
    page?: number;
    per_page?: number;
    status?: ChargeStatus;
    type?: ChargeType;
}

interface RefundChargeData {
    value?: number; // Se não informado, estorna o valor total
}
```

### Transferências

```typescript
interface Transfer {
    uuid: string;
    value: number;
    fees: number;
    currency: string;
    status: TransferStatus;
    type: TransferType;
    pix_key: string;
    pix_holder_document: string;
    external_ref: string | null;
    final_beneficiary: FinalBeneficiary | null;
    transfer: TransferDetails | null;
    history: StatusHistory[];
    created_at: string;
}

interface CreateTransferData {
    value: number;
    pix_key: string;
    account_uuid?: string;
    external_ref?: string;
    final_beneficiary?: FinalBeneficiary;
}

interface ListTransfersParams {
    page?: number;
    per_page?: number;
    status?: TransferStatus;
    type?: TransferType;
}
```

### Webhooks

```typescript
interface Webhook {
    uuid: string;
    url: string;
    token: string;
    status: WebhookStatus;
    created_at: string;
}

interface CreateWebhookData {
    url: string;
    token?: string;
}

interface ListWebhooksParams {
    page?: number;
    per_page?: number;
    status?: WebhookStatus;
}
```

### Tipos Comuns

```typescript
// Status de Cobranças e Transferências
type ChargeStatus = 
    | 'UNDEFINED'
    | 'PENDING'
    | 'PROCESSING'
    | 'PAID'
    | 'FAILED'
    | 'REFUNDED'
    | 'PARTIALLY_REFUNDED'
    | 'CANCELLED'
    | 'EXPIRED';

type TransferStatus = ChargeStatus;

// Status de Webhooks
type WebhookStatus = 'ACTIVE' | 'INACTIVE';

// Tipos de Cobrança/Transferência
type ChargeType = 'UNDEFINED' | 'PIX';
type TransferType = 'UNDEFINED' | 'PIX';

// Beneficiário Final
interface FinalBeneficiary {
    name: string;
    document: string;
}

// Histórico de Status
interface StatusHistory {
    status: string;
    created_at: string;
}

// Paginação
interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}
```

### Detalhes de Pagamento PIX

```typescript
interface PaymentDetails {
    uuid: string;
    value: number;
    type: ChargeType;
    status: string;
    payload: string; // PIX Copia e Cola
    pix: PixDetails | null;
    expires_at: string;
    created_at: string;
    updated_at: string;
}

interface PixDetails {
    sender: Account | null;
    receiver: Account | null;
    txid: string;
    value: number;
    type: 'QR_DYNAMIC' | 'QR_STATIC';
    status: string;
    expires_at: string;
    created_at: string;
    updated_at: string;
}
```

---

## Tratamento de Erros

O SDK fornece classes de erro específicas para cada tipo de falha:

```typescript
import { 
    PlowfClient,
    PlowfError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ValidationError,
    ServerError,
} from '@plowf/sdk';

try {
    await plowf.payments.create({ type: 'pix', value: -100 });
} catch (error) {
    if (error instanceof ValidationError) {
        // Erro 422 - Dados inválidos
        console.log('Campos inválidos:', error.data);
    } else if (error instanceof AuthenticationError) {
        // Erro 401 - Token inválido ou expirado
        console.log('Verifique sua API Key');
    } else if (error instanceof AuthorizationError) {
        // Erro 403 - Sem permissão
        console.log('Sem permissão para esta ação');
    } else if (error instanceof NotFoundError) {
        // Erro 404 - Recurso não encontrado
        console.log('Recurso não existe');
    } else if (error instanceof ServerError) {
        // Erro 500 - Erro interno
        console.log('Erro no servidor, tente novamente');
    } else if (error instanceof PlowfError) {
        // Outros erros da API
        console.log('Erro:', error.message);
        console.log('Status:', error.status);
        console.log('Código:', error.code);
        console.log('Dados:', error.data);
    }
}
```

### Classes de Erro

| Classe | HTTP Status | Descrição |
|--------|-------------|-----------|
| `AuthenticationError` | 401 | Token inválido ou expirado |
| `AuthorizationError` | 403 | Sem permissão para o recurso |
| `NotFoundError` | 404 | Recurso não encontrado |
| `ValidationError` | 422 | Dados de entrada inválidos |
| `ServerError` | 500 | Erro interno do servidor |
| `PlowfError` | * | Classe base para todos os erros |

### Interfaces de Erro

```typescript
// Classe base para todos os erros
class PlowfError extends Error {
    message: string;   // Mensagem de erro
    status: number;    // Código HTTP
    code: string;      // Código interno (ex: 'VALIDATION_ERROR')
    data: unknown;     // Dados adicionais da API
}

// Erro 401 - Token inválido ou expirado
class AuthenticationError extends PlowfError {
    status: 401;
    code: 'UNAUTHENTICATED';
}

// Erro 403 - Sem permissão para o recurso
class AuthorizationError extends PlowfError {
    status: 403;
    code: 'UNAUTHORIZED';
}

// Erro 404 - Recurso não encontrado
class NotFoundError extends PlowfError {
    status: 404;
    code: 'NOT_FOUND';
}

// Erro 422 - Dados de entrada inválidos
class ValidationError extends PlowfError {
    status: 422;
    code: 'VALIDATION_ERROR';
}

// Erro 500 - Erro interno do servidor
class ServerError extends PlowfError {
    status: 500;
    code: 'SERVER_ERROR';
}
```

---

## Exemplos Completos

### Fluxo de Cobrança PIX

```typescript
import { PlowfClient, ValidationError } from '@plowf/sdk';

const plowf = new PlowfClient({ apiKey: 'sua_api_key' });

async function criarCobranca(pedidoId: string, valor: number) {
    try {
        // 1. Criar cobrança
        const response = await plowf.payments.create({
            type: 'pix',
            value: valor,
            external_ref: pedidoId,
        });

        const charge = response.data;
        
        // 2. Retornar dados do PIX
        return {
            uuid: charge.uuid,
            pixCopiaCola: charge.payment?.payload,
            status: charge.status,
            expiresAt: charge.payment?.expires_at,
        };
    } catch (error) {
        if (error instanceof ValidationError) {
            throw new Error(`Dados inválidos: ${JSON.stringify(error.data)}`);
        }
        throw error;
    }
}

async function verificarPagamento(uuid: string) {
    const response = await plowf.payments.get(uuid);
    return response.data.status === 'PAID';
}
```

### Fluxo de Transferência PIX

```typescript
import { PlowfClient } from '@plowf/sdk';

const plowf = new PlowfClient({ apiKey: 'sua_api_key' });

async function enviarPix(chavePix: string, valor: number, referencia: string) {
    const response = await plowf.transfers.create({
        value: valor,
        pix_key: chavePix,
        external_ref: referencia,
    });

    return {
        uuid: response.data.uuid,
        status: response.data.status,
        endToEnd: response.data.transfer?.end_to_end,
    };
}
```

### Configurar Webhook

```typescript
import { PlowfClient } from '@plowf/sdk';

const plowf = new PlowfClient({ apiKey: 'sua_api_key' });

async function configurarWebhook() {
    // Listar webhooks existentes
    const { data: webhooks } = await plowf.webhooks.list();
    
    // Remover webhooks antigos
    for (const webhook of webhooks) {
        if (webhook.status === 'INACTIVE') {
            await plowf.webhooks.delete(webhook.uuid);
        }
    }

    // Criar novo webhook
    const response = await plowf.webhooks.create({
        url: 'https://api.seusite.com/webhooks/plowf',
        token: 'token_para_validacao',
    });

    console.log('Webhook criado:', response.data.uuid);
}
```

---

## Suporte

- **Documentação da API:** [https://docs.plowf.com](https://docs.plowf.com)
- **Issues:** [GitHub Issues](https://github.com/plowf/sdk-node/issues)

## Licença

MIT © Plowf
