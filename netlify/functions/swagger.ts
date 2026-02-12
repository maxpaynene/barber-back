import swaggerUi from 'swagger-ui-express';
import express from 'express';
import serverless from 'serverless-http';

const app = express();

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Barberia API',
    version: '1.0.0',
    description: 'API para gestión de barbería',
  },
  servers: [
    {
      url: '/.netlify/functions/api',
      description: 'Netlify Functions API',
    },
  ],
};

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export const handler = serverless(app);
