import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "../config.js";

// 🚗 Booking Service Proxy
export function setupRoutes_booking(app) {
  app.use(
    "/gateway/api/v1/booking-service",
    createProxyMiddleware({
      target: config.bookingService.baseUrl, // http://booking_service:5000
      changeOrigin: true,
      pathRewrite: { "^/gateway/api/v1/booking-service": "/api/v1" },
      onProxyReq: (proxyReq, req) => {
        console.log(`➡️ [Booking] ${req.method} ${req.originalUrl} → ${proxyReq.path}`);
      },
      onProxyRes: (proxyRes, req) => {
        console.log(`✅ [Booking] ${req.method} ${req.originalUrl} → ${proxyRes.statusCode}`);
      },
      onError: (err, req, res) => {
        console.error(`❌ [Booking] Proxy error: ${err.message}`);
        res.status(503).json({
          error: "Booking Service Unavailable",
          message: err.message,
        });
      },
    })
  );
}
