import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "../config.js";

export function setupRoutes_user(app) {
  console.log(`🔧 Setting up User proxy: /gateway/api/v1/user-service -> ${config.userService.baseUrl}`);
  
  app.use(
    "/gateway/api/v1/user-service",
    createProxyMiddleware({
      target: config.userService.baseUrl,
      changeOrigin: true,
      pathRewrite: { 
        "^/gateway/api/v1/user-service": "/api/v1"
      },
      logLevel: "debug",
      onProxyReq: (proxyReq, req) => {
        console.log(`➡️ [User] ${req.method} ${req.originalUrl}`);
        console.log(`   → Target: ${proxyReq.getHeader('host')}${proxyReq.path}`);
      },
      onProxyRes: (proxyRes, req) => {
        console.log(`✅ [User] ${req.method} ${req.originalUrl} → ${proxyRes.statusCode}`);
      },
      onError: (err, req, res) => {
        console.error(`❌ [User] Proxy error: ${err.message}`);
        console.error(`❌ Target was: ${config.userService.baseUrl}`);
        console.error(`❌ Original URL: ${req.originalUrl}`);
        res.status(503).json({
          error: "User Service Unavailable",
          message: err.message,
          target: config.userService.baseUrl,
          originalUrl: req.originalUrl
        });
      },
    })
  );
}