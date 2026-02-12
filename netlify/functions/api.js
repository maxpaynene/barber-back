// @ts-check
const { handler } = require('../../dist/lambda');
// Exporta el handler para NestJS
exports.handler = handler;

// Para Swagger, crea una ruta específica
// @ts-ignore
exports.swagger = async (_event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Swagger disponible en /' }),
  };
};
