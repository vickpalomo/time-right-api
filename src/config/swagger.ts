import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Time Right API',
      version: '1.0.0',
      description: 'API para el juego Time It Right',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Ambiente de desarrollo',
      },
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
  },
  apis: ['./src/**/*.ts'],
};

export const specs = swaggerJsdoc(options);