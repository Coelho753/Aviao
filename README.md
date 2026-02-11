# Aviao Flight Monitor API

Backend em Node.js com Express para monitoramento e busca de passagens aéreas, pronto para consumo por frontend externo e deploy em serviços como Render ou Railway.

## Requisitos

- Node.js 18+
- PostgreSQL

## Configuração

1. Copie o arquivo `.env.example` para `.env`.
2. Ajuste as variáveis conforme o seu ambiente.

```bash
cp .env.example .env
```

### Variáveis de ambiente

- `PORT`: porta do servidor.
- `DATABASE_URL`: string de conexão do PostgreSQL.
- `AMADEUS_CLIENT_ID` / `AMADEUS_CLIENT_SECRET`: credenciais para API Amadeus (opcional).
- `USE_MOCK_PROVIDER`: `true` para usar dados mock.
- `SYNC_ROUTES`: rotas para sincronização automática (`GRU-GIG,GRU-FOR,GRU-REC,GRU-SSA`).
- `SYNC_DAYS_AHEAD`: dias à frente para consultar no job.
- `DEFAULT_ORIGIN` / `DEFAULT_DESTINATION`: rota padrão quando `SYNC_ROUTES` não estiver definida.

## Executando

```bash
npm install
npm run dev
```

## Endpoints

### GET `/api/flights/search`

Parâmetros obrigatórios:

- `origin`
- `destination`
- `date` (YYYY-MM-DD)

Parâmetro opcional:

- `maxPrice`

Exemplo:

```
GET /api/flights/search?origin=GRU&destination=GIG&date=2024-10-20&maxPrice=900
```

Resposta:

```json
[
  {
    "airline": "GOL",
    "price": 780,
    "origin": "GRU",
    "destination": "GIG",
    "date": "2024-10-20",
    "departureTime": "08:00",
    "arrivalTime": "10:40",
    "duration": "2h40m",
    "bookingProvider": "Google Flights",
    "purchaseUrl": "https://www.google.com/travel/flights?hl=pt-BR#flt=GRU.GIG.2024-10-20"
  }
]
```

### GET `/api/flights/airports`

Retorna aeroportos suportados para popular selects/autocomplete no frontend.

### GET `/api/flights/search-config`

Retorna configurações para o frontend, incluindo `syncDaysAhead` para limitar o datepicker e a lista de aeroportos disponíveis.

## Job de sincronização

Um job agendado roda a cada 30 minutos para atualizar o banco de dados com dados de passagens. Quando não há credenciais, o sistema usa o provider mock configurável.
