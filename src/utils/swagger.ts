import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Employee Crud APIs',
      version: '1.0.0',
      description: 'A simple  Employee  with Swagger documentation',
    },
    servers: [
      {
        url: 'http://localhost:5000/',
      },
    ],
  },
  apis: ['./src/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express, _PORT: string | undefined) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};


