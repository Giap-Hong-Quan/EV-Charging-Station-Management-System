# Quick Start Guide - API Gateway Integration

## 🚀 Start All Services

```bash
# Start API Gateway, Booking Service, and MySQL
docker-compose up -d
```

## 📍 Service Endpoints

### API Gateway (Main Entry Point)
- **URL**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API Info**: http://localhost:3000/api
- **API Docs**: http://localhost:3000/api/docs

### Booking Service (Direct Access)
- **URL**: http://localhost:5000
- **Endpoint**: http://localhost:5000/api/v1/bookings

### MySQL Database
- **Port**: 3307
- **Host**: localhost
- **Database**: evcsms_db

## ✅ Test the API Gateway

### 1. Check Health
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "service": "API Gateway",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### 2. View API Documentation
```bash
curl http://localhost:3000/api/docs
```

### 3. Get All Bookings (via Gateway)
```bash
curl http://localhost:3000/api/v1/bookings
```

### 4. Create a Booking (via Gateway)
```bash
curl -X POST http://localhost:3000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "stationId": "station456",
    "startTime": "2024-01-15T10:00:00Z",
    "duration": 60
  }'
```

## 📊 View Logs

```bash
# API Gateway logs
docker-compose logs -f api_gateway

# Booking Service logs
docker-compose logs -f booking_service

# All services
docker-compose logs -f
```

## 🛠️ Service Management

### Stop All Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild Services
```bash
docker-compose up -d --build
```

## 🎯 Architecture

```
Client → API Gateway (Port 3000) → Booking Service (Port 5000) → MySQL (Port 3307)
```

## 📝 Notes

- API Gateway acts as the single entry point
- All requests should go through port 3000
- Port 5000 is for direct access (internal use)
- Rate limiting: 100 requests per 15 minutes per IP
- CORS enabled for all origins

## 🔧 Troubleshooting

### Services Not Starting
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs
```

### Database Connection Issues
```bash
# Restart MySQL
docker-compose restart evcs_mysql

# Rebuild all services
docker-compose up -d --build
```

## 🎉 Success!

If you see all services running:
```
api_gateway     Up
booking_service Up
evcs_mysql      Up
```

Your API Gateway is successfully integrated! 🎊

