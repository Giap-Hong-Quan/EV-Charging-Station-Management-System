import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "./config.js";

export function setupRoutes_station(app) {
  // Station Service Routes
  app.use(
    "/gateway/api/v1/stations",
    createProxyMiddleware({
      target: config.stationService.baseUrl,
      changeOrigin: true,
      pathRewrite: {
        "^/": "/api/v1/stations/",
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`📤 Proxying ${req.method} ${req.url} -> ${proxyReq.path}`);
        console.log(`🔗 Target URL: ${config.stationService.baseUrl}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`📥 Response ${proxyRes.statusCode} from ${req.url}`);
      },
      onError: (err, req, res) => {
        console.error(`❌ Proxy error for ${req.url}:`, err.message);
        res.status(503).json({
          error: "Service Unavailable",
          message: "Station service is temporarily unavailable",
          timestamp: new Date().toISOString()
        });
      }
    })
  );
  app.use(
    "/gateway/api/v1/stations/delete",
    createProxyMiddleware({
      target: config.bookingService.baseUrl,
      changeOrigin: true,
      pathRewrite: {
        "^/": "/api/v1/stations/delete/",
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`📤 Proxying ${req.method} ${req.url} -> ${proxyReq.path}`);
        console.log(`🔗 Target URL: ${config.stationService.baseUrl}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`📥 Response ${proxyRes.statusCode} from ${req.url}`);
      },
      onError: (err, req, res) => {
        console.error(`❌ Proxy error for ${req.url}:`, err.message);
        res.status(503).json({
          error: "Service Unavailable",
          message: "Station service is temporarily unavailable",
          timestamp: new Date().toISOString()
        });
      }
    })
  );

  app.use(
    "/gateway/api/v1/points",
    createProxyMiddleware({
      target: config.stationService.baseUrl,
      changeOrigin: true,
      // pathRewrite: { "^/": "/api/v1/bookings" },
      // pathRewrite: { 
      //   "^/gateway/api/v1/orders": "/api/v1/bookings"
      // },
      pathRewrite: {
        "^/": "/api/v1/points/",
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`📤 Proxying ${req.method} ${req.url} -> ${proxyReq.path}`);
        console.log(`🔗 Target URL: ${config.stationService.baseUrl}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`📥 Response ${proxyRes.statusCode} from ${req.url}`);
      },
      onError: (err, req, res) => {
        console.error(`❌ Proxy error for ${req.url}:`, err.message);
        res.status(503).json({
          error: "Service Unavailable",
          message: "Station service is temporarily unavailable",
          timestamp: new Date().toISOString()
        });
      }
    })
  );

  // Root API endpoint
  app.get("/api", (req, res) => {
    res.json({
      name: "EVCS API Gateway",
      version: "1.0.0",
      endpoints: {
        stations: "/gateway/api/v1/stations"
      },
      documentation: "/api/docs"
    });
  });

  // API documentation endpoint
  app.get("/api/docs", (req, res) => {
    res.json({
      title: "EVCS API Gateway Documentation",
      version: "1.0.0",
      services: {
        booking: {
          baseUrl: "/gateway/api/v1/stations",
          description: "Booking management service",
          endpoints: {
            "POST /gateway/api/v1/bookings": "Create a new booking",
            "GET /gateway/api/v1/bookings": "Get all bookings",
            "GET /gateway/api/v1/bookings/:id": "Get booking by ID"
          }
        }
      }
    });
  });
}

