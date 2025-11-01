# EVCS Booking Service with API Gateway

Electric Vehicle Charging Station (EVCS) Booking Service with integrated API Gateway.

## Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ API Gateway │ ← Port 3000
│  (Routing)  │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Booking   │ ← Port 5000
│   Service   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   MySQL DB  │ ← Port 3307
└─────────────┘
```

## Features

### API Gateway
- **Single Entry Point**: All API requests go through the gateway
- **Request Routing**: Routes to appropriate microservices
- **Security**: Helmet.js security headers
- **CORS**: Cross-origin resource sharing support
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Logging**: Request/response logging
- **Health Checks**: Service health monitoring
- **Error Handling**: Centralized error handling

### Booking Service
- **RESTful API**: Create, read bookings
- **MySQL Database**: Sequelize ORM
- **Validation**: Joi schema validation

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)

### Quick Start

1. **Start all services using Docker Compose:**

```bash
docker-compose up -d
```

2. **Check services status:**

```bash
docker-compose ps
```

3. **View logs:**

```bash
# API Gateway logs
docker-compose logs -f api_gateway

# Booking Service logs
docker-compose logs -f booking_service

# MySQL logs
docker-compose logs -f evcs_mysql
```

4. **Access the services:**

- API Gateway: http://localhost:3000
- API Health Check: http://localhost:3000/health
- API Info: http://localhost:3000/api
- API Docs: http://localhost:3000/api/docs
- Booking Service (direct): http://localhost:5000

### API Endpoints

#### Through API Gateway (Recommended)

```bash
# Get all bookings
curl http://localhost:3000/api/v1/bookings

# Get booking by ID
curl http://localhost:3000/api/v1/bookings/1

# Create booking
curl -X POST http://localhost:3000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "stationId": "station456",
    "startTime": "2024-01-15T10:00:00Z",
    "duration": 60
  }'
```

#### Direct to Booking Service

```bash
curl http://localhost:5000/api/v1/bookings
```

## Development

### Run Booking Service Locally

```bash
# Install dependencies
npm install

# Start service
npm run dev

# Service will run on http://localhost:5000
```

### Run API Gateway Locally

```bash
cd gateway

# Install dependencies
npm install

# Start gateway
npm run dev

# Gateway will run on http://localhost:3000
```

## Project Structure

```
booking_service/
├── gateway/                  # API Gateway service
│   ├── src/
│   │   ├── config.js        # Gateway configuration
│   │   ├── server.js        # Gateway server
│   │   ├── routes.js        # Service routing
│   │   └── middleware/      # Gateway middleware
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── src/
│   ├── config/
│   │   └── mysql.js         # Database configuration
│   ├── controllers/
│   │   └── booking.controller.js
│   ├── models/
│   │   └── booking.model.js
│   ├── routes/
│   │   └── booking.router.js
│   ├── service/
│   │   └── booking_service.js
│   ├── app.js
│   └── server.js
├── docker-compose.yml       # Orchestration
├── Dockerfile
└── package.json
```

## Configuration

### Environment Variables

#### API Gateway

```env
GATEWAY_PORT=3000
BOOKING_SERVICE_URL=http://booking_service:5000
CORS_ORIGIN=*
```

#### Booking Service

```env
PORT=5000
MYSQL_HOST=evcs_mysql
MYSQL_USER=root
MYSQL_PASSWORD=292902
MYSQL_DB=evcsms_db
```

### Ports

- **3000**: API Gateway (external)
- **5000**: Booking Service (internal/external)
- **3307**: MySQL Database (external)

## Services

### 1. API Gateway

**Purpose**: Single entry point for all API requests

**Features**:
- Request routing to microservices
- Security headers (Helmet)
- CORS handling
- Rate limiting (100 req/15min)
- Request/response logging
- Centralized error handling

**Endpoints**:
- `GET /health` - Health check
- `GET /api` - API information
- `GET /api/docs` - API documentation
- `GET /api/v1/bookings/*` - Proxy to booking service

### 2. Booking Service

**Purpose**: Handle booking operations

**Features**:
- RESTful API
- MySQL database
- Sequelize ORM
- Request validation
- Error handling

**Endpoints**:
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings` - Get all bookings
- `GET /api/v1/bookings/:id` - Get booking by ID

### 3. MySQL Database

**Purpose**: Data persistence

**Database**: `evcsms_db`

## Monitoring

### Health Checks

```bash
# Gateway health
curl http://localhost:3000/health

# Booking service health
curl http://localhost:5000/
```

### Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs api_gateway
docker-compose logs booking_service

# Follow logs
docker-compose logs -f
```

## Troubleshooting

### Service not starting

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs service_name

# Restart service
docker-compose restart service_name
```

### Database connection issues

```bash
# Check MySQL container
docker-compose logs evcs_mysql

# Restart MySQL
docker-compose restart evcs_mysql

# Rebuild services
docker-compose up -d --build
```

## Adding New Services

To add a new microservice to the architecture:

1. Create service in new directory
2. Add service to `docker-compose.yml`
3. Configure proxy in `gateway/src/routes.js`
4. Update gateway configuration in `gateway/src/config.js`
5. Update documentation in `gateway/src/routes.js` (docs endpoint)

## License

ISC

