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
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Property: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            owner: { $ref: '#/components/schemas/User' },
            title: { type: 'string' },
            description: { type: 'string' },
            type: { type: 'string', enum: ['apartment', 'house', 'land', 'commercial'] },
            listingType: { type: 'string', enum: ['sale', 'rent'] },
            price: { type: 'number' },
            currency: { type: 'string', example: 'TRY' },
            size: { type: 'number' },
            viewCount: { type: 'integer' },
            images: {
              type: 'array',
              items: { type: 'string', format: 'uri' }
            },
            features: {
              type: 'object',
              properties: {
                rooms: { type: 'integer' },
                bathrooms: { type: 'integer' },
                floor: { type: 'integer' },
                heating: { type: 'string' }
              }
            },
            location: {
              type: 'object',
              properties: {
                city: { type: 'string' },
                district: { type: 'string' },
                address: { type: 'string' }
              }
            },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: []
  },
  apis: ['./src/routes/**/*.js', './src/app.js']
};
