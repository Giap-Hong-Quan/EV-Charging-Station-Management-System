import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "../config.js";

// ⚡ Charging Session Service Proxy
export function setupRoutes_session(app) {
  console.log(`🔧 Setting up Session proxy: /gateway/api/v1/session-service -> ${config.sessionService.baseUrl}`);
  app.use(
    "/gateway/api/v1/session-service",
    createProxyMiddleware({
      target: config.sessionService.baseUrl,
      changeOrigin: true,
      pathRewrite: { "^/": "/api/v1/" },
      logLevel: "debug", // 👈 Thêm dòng này
      onProxyReq: (proxyReq, req) => {
        console.log(`➡️ [Session] ${req.method} ${req.originalUrl} → ${proxyReq.getHeader('host')}${proxyReq.path}`);
      },
      onProxyRes: (proxyRes, req) => {
        console.log(`✅ [Session] ${req.method} ${req.originalUrl} → ${proxyRes.statusCode}`);
      },
      onError: (err, req, res) => {
        console.error(`❌ [Session] Proxy error: ${err.message}`);
        console.error(`❌ Target was: ${config.sessionService.baseUrl}`);
        res.status(503).json({
          error: "Session Service Unavailable",
          message: err.message,
          target: config.sessionService.baseUrl
        });
      },
    })
  );
}