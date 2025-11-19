// src/config/swagger.js
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function setupSwagger(app) {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Station Management Service API",
        version: "1.0.0",
        description: "API quản lý trạm sạc, điểm sạc và sự cố bảo trì",
      },
      servers: [
        { url: "http://localhost:5001" },
      ],
    },
    // ✅ Sửa đường dẫn - dùng path tuyệt đối
    apis: [
      join(__dirname, '../routes/*.js'),
      join(__dirname, '../routes/**/*.js')
    ],
  };

  const swaggerSpec = swaggerJsdoc(options);
  
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}