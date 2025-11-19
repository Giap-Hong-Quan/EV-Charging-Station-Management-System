import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "../config.js";

// 📊 Analytics Service Proxy
export function setupRoutes_analytics(app) {

   console.log(`🔧 Setting up Analytics proxy: /gateway/api/v1/analytics-service -> ${config.analyticsService.baseUrl}`);
  
  app.use(
     "/gateway/api/v1/analytics-service",
    createProxyMiddleware({
      target: config.analyticsService.baseUrl,
      changeOrigin: true,
      pathRewrite: { "^/": "/api/v1/" },
      logLevel: "debug", // 👈 Thêm dòng này
      onProxyReq: (proxyReq, req) => {
        console.log(`➡️ [Analytics] ${req.method} ${req.originalUrl} → ${proxyReq.getHeader('host')}${proxyReq.path}`);
      },
      onProxyRes: (proxyRes, req) => {
        console.log(`✅ [Analytics] ${req.method} ${req.originalUrl} → ${proxyRes.statusCode}`);
      },
      onError: (err, req, res) => {
        console.error(`❌ [Analytics] Proxy error: ${err.message}`);
        console.error(`❌ Target was: ${config.analyticsService.baseUrl}`);
        res.status(503).json({
          error: "Analytics Service Unavailable",
          message: err.message,
          target: config.analyticsService.baseUrl
        });
      },
    })
  );
}
