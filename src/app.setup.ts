import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const GLOBAL_PREFIX = 'api';
export const SWAGGER_PATH = 'api-docs';

export const setupApp = async (app: INestApplication): Promise<void> => {
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.setGlobalPrefix(GLOBAL_PREFIX, {
    exclude: [`${GLOBAL_PREFIX}/${SWAGGER_PATH}`],
  });

  const config = new DocumentBuilder()
    .setTitle('Barbería API')
    .setDescription('Documentación del sistema de gestión de barbería (MVP)')
    .setVersion('1')
    .addTag('services')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${GLOBAL_PREFIX}/${SWAGGER_PATH}`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Barbería Docs',
  });
};