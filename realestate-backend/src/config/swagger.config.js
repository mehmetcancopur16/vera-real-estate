/**
 * Swagger JSDoc options — extend as routes are documented.
 */
export const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Vera Real Estate API',
      version: '1.0.0',
      description: 'Emlak portalı backend API'
    },
    servers: [{ url: '/api' }]
  },
  apis: ['./src/routes/**/*.js', './src/app.js']
};
