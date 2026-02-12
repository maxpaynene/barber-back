const { handler } = require('../../dist/lambda');
// Exporta el handler para NestJS
exports.handler = handler;

// Para Swagger, crea una ruta específica
exports.swagger = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Swagger disponible en /api-docs' }),
  };
};
