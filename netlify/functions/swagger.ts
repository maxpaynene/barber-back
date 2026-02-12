// eslint-disable-next-line @typescript-eslint/require-await
export const handler = async () => {
  const swaggerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Barberia API - Swagger UI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css">
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
    <script>
    window.onload = function() {
        SwaggerUIBundle({
            spec: {
                openapi: '3.0.0',
                info: {
                    title: 'Barberia API',
                    version: '1.0.0',
                    description: 'API para gestión de barbería'
                },
                servers: [{ url: '/.netlify/functions/api' }]
            },
            dom_id: '#swagger-ui',
            presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
            layout: "StandaloneLayout"
        });
    };
    </script>
</body>
</html>
  `;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: swaggerHtml,
  };
};
