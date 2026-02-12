const express = require('express');
const serverless = require('serverless-http');
const swaggerUi = require('swagger-ui-express');
const { handler } = require('../../dist/lambda');

const app = express();

// Documentación de Swagger
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
      description: 'Netlify Functions',
    },
  ],
};

// Rutas
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', (req, res) => handler(req, res));

exports.handler = serverless(app);
