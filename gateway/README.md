# API Gateway Service

API Gateway for EVCS Microservices Architecture.

## Features

- **Request Routing**: Routes requests to appropriate microservices
- **Security**: Helmet.js for security headers
- **CORS**: Cross-origin resource sharing support
- **Rate Limiting**: Prevents abuse with request rate limiting
- **Logging**: Request and response logging
- **Health Checks**: Service health monitoring
- **Error Handling**: Centralized error handling

## Configuration

Environment variables can be configured in `.env` file:

```env
GATEWAY_PORT=3000
BOOKING_SERVICE_URL=http://booking_service:5000
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## Running the Service

### Development

```bash
cd gateway
npm install
npm run dev
```

### Production (Docker)

```bash
docker-compose up -d api_gateway
```

## API Endpoints

- **Health Check**: `GET /health`
- **API Info**: `GET /api`
- **Documentation**: `GET /api/docs`
- **Bookings**: `GET/POST /api/v1/bookings/*`

## Architecture

```
Client Request
    ↓
API Gateway (Port 3000)
    ↓
Booking Service (Port 5000)
    ↓
MySQL Database
```

## Middleware

### Logger Middleware
Logs all incoming requests with timestamp, method, URL, IP, and user agent.

### Error Handler
Centralized error handling for all API errors.

### Rate Limiter
Limits requests to prevent abuse (default: 100 requests per 15 minutes).

### Security
Helmet.js adds security headers to all responses.

## Adding New Services

To add a new microservice:

1. Add proxy configuration in `gateway/src/routes.js`
2. Update `gateway/src/config.js` with service URL
3. Add service to `docker-compose.yml`
4. Update documentation in `/api/docs` endpoint

