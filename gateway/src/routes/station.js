import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "../config.js";

export function setupRoutes_station(app) {
  console.log(`🔧 Setting up Station proxy: /gateway/api/v1/station-service -> ${config.stationService.baseUrl}`);
  
  app.use(
    "/gateway/api/v1/station-service",
    createProxyMiddleware({
      target: config.stationService.baseUrl,
      changeOrigin: true,
      pathRewrite: { "^/gateway/api/v1/station-service": "/api/v1" },
      logLevel: "debug", // 👈 Thêm dòng này
      onProxyReq: (proxyReq, req) => {
        console.log(`➡️ [Station] ${req.method} ${req.originalUrl} → ${proxyReq.getHeader('host')}${proxyReq.path}`);
      },
      onProxyRes: (proxyRes, req) => {
        console.log(`✅ [Station] ${req.method} ${req.originalUrl} → ${proxyRes.statusCode}`);
      },
      onError: (err, req, res) => {
        console.error(`❌ [Station] Proxy error: ${err.message}`);
        console.error(`❌ Target was: ${config.stationService.baseUrl}`);
        res.status(503).json({
          error: "Station Service Unavailable",
          message: err.message,
          target: config.stationService.baseUrl
        });
      },
    })
  );
}