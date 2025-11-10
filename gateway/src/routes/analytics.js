import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "../config.js";

// 📊 Analytics Service Proxy
export function setupRoutes_analytics(app) {
  app.use(
    "/gateway/api/v1/analytics-service",
    createProxyMiddleware({
      target: config.analyticsService.baseUrl, // http://analytics_reporting_service:5002
      changeOrigin: true,
      pathRewrite: { "^/gateway/api/v1/analytics-service": "/api/v1" },
      onProxyReq: (proxyReq, req) => {
        console.log(`➡️ [Analytics] ${req.method} ${req.originalUrl} → ${proxyReq.path}`);
      },
      onProxyRes: (proxyRes, req) => {
        console.log(`✅ [Analytics] ${req.method} ${req.originalUrl} → ${proxyRes.statusCode}`);
      },
      onError: (err, req, res) => {
        console.error(`❌ [Analytics] Proxy error: ${err.message}`);
        res.status(503).json({
          error: "Analytics Service Unavailable",
          message: err.message,
        });
      },
    })
  );
}
