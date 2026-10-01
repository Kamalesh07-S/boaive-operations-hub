// src/config/swagger.ts - OpenAPI/Swagger configuration
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Boaive Operations Hub API',
      version: '1.0.0',
      description: 'REST API for Boaive Operations Hub - Internal CRM & Operations Management System',
      contact: { name: 'Boaive Technologies', email: 'admin@boaive.com' },
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
