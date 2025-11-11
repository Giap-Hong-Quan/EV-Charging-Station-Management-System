import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "../config.js";

// 👥 User Service Proxy
export function setupRoutes_user(app) {
  app.use(
    "/gateway/api/v1/user-service",
    createProxyMiddleware({
      target: config.userService.baseUrl, // http://user_service:8082
      changeOrigin: true,
      pathRewrite: { "^/gateway/api/v1/user-service": "/api/v1" },
      onProxyReq: (proxyReq, req) => {
        console.log(`➡️ [User] ${req.method} ${req.originalUrl} → ${proxyReq.path}`);
      },
      onProxyRes: (proxyRes, req) => {
        console.log(`✅ [User] ${req.method} ${req.originalUrl} → ${proxyRes.statusCode}`);
      },
      onError: (err, req, res) => {
        console.error(`❌ [User] Proxy error: ${err.message}`);
        res.status(503).json({
          error: "User Service Unavailable",
          message: err.message,
        });
      },
    })
  );
}
