/**
 * OpenAPI 3.0 — Vera Real Estate API + JWT Bearer
 */
export const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Vera Real Estate API',
      version: '1.0.0',
      description: 'Emlak portalı backend API dökümantasyonu'
    },
    servers: [{ url: '/' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Header: Authorization: Bearer <access_token>'
        }
      }
    },
    security: []
  },
  apis: ['./src/routes/**/*.js', './src/app.js']
};
