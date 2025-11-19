import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "../config.js";

export function setupRoutes_user(app) {
   console.log(`🔧 Setting up User proxy: /gateway/api/v1/user-service -> ${config.userService.baseUrl}`);
  app.use(
    "/gateway/api/v1/user-service",
    createProxyMiddleware({
      target: config.userService.baseUrl,
      changeOrigin: true,
      pathRewrite: { "^/": "/api/v1/" },
      logLevel: "debug", // 👈 Thêm dòng này
      onProxyReq: (proxyReq, req) => {
        console.log(`➡️ [User] ${req.method} ${req.originalUrl} → ${proxyReq.getHeader('host')}${proxyReq.path}`);
      },
      onProxyRes: (proxyRes, req) => {
        console.log(`✅ [User] ${req.method} ${req.originalUrl} → ${proxyRes.statusCode}`);
      },
      onError: (err, req, res) => {
        console.error(`❌ [User] Proxy error: ${err.message}`);
        console.error(`❌ Target was: ${config.userService.baseUrl}`);
        res.status(503).json({
          error: "User Service Unavailable",
          message: err.message,
          target: config.userService.baseUrl
        });
      },
    })
  );
}
