import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "../config.js";

// 🚗 Booking Service Proxy
export function setupRoutes_booking(app) {
  console.log(`🔧 Setting up Booking proxy: /gateway/api/v1/booking-service -> ${config.bookingService.baseUrl}`);
  app.use(
    "/gateway/api/v1/booking-service",
    createProxyMiddleware({
      target: config.bookingService.baseUrl,
      changeOrigin: true,
      pathRewrite: { "^/": "/api/v1/" },
      logLevel: "debug", // 👈 Thêm dòng này
      onProxyReq: (proxyReq, req) => {
        console.log(`➡️ [Booking] ${req.method} ${req.originalUrl} → ${proxyReq.getHeader('host')}${proxyReq.path}`);
      },
      onProxyRes: (proxyRes, req) => {
        console.log(`✅ [Booking] ${req.method} ${req.originalUrl} → ${proxyRes.statusCode}`);
      },
      onError: (err, req, res) => {
        console.error(`❌ [Booking] Proxy error: ${err.message}`);
        console.error(`❌ Target was: ${config.bookingService.baseUrl}`);
        res.status(503).json({
          error: "Booking Service Unavailable",
          message: err.message,
          target: config.bookingService.baseUrl
        });
      },
    })
  );
}
