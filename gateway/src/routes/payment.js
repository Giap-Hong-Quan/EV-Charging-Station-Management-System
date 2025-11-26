import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "../config.js";

export function setupRoutes_payment(app) {
  console.log(`🔧 Setting up Payment proxy: /gateway/api/v1/payment-service -> ${config.paymentService.baseUrl}`);
  
  app.use(
    "/gateway/api/v1/payment-service",
    createProxyMiddleware({
      target: config.paymentService.baseUrl,
      changeOrigin: true,
      pathRewrite: { "^/": "/api/v1/" },
      logLevel: "debug", // 👈 Thêm dòng này
      onProxyReq: (proxyReq, req) => {
        console.log(`➡️ [Payment] ${req.method} ${req.originalUrl} → ${proxyReq.getHeader('host')}${proxyReq.path}`);
      },
      onProxyRes: (proxyRes, req) => {
        console.log(`✅ [Payment] ${req.method} ${req.originalUrl} → ${proxyRes.statusCode}`);
      },
      onError: (err, req, res) => {
        console.error(`❌ [Payment] Proxy error: ${err.message}`);
        console.error(`❌ Target was: ${config.paymentService.baseUrl}`);
        res.status(503).json({
          error: "Payment Service Unavailable",
          message: err.message,
          target: config.paymentService.baseUrl
        });
      },
    })
  );
}