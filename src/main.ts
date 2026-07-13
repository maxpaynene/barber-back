import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173'],
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

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('Barbería API')
    .setDescription('Documentación del sistema de gestión de barbería (MVP)')
    .setVersion('1.0')
    .addTag('services')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Barbería Docs',
    useGlobalPrefix: true,
  });

  await app.listen(3000);

  console.log(`Swagger is running on: ${await app.getUrl()}/${globalPrefix}/api-docs`);
  console.log(`Application is running on: ${await app.getUrl()}/${globalPrefix}/`);
}

void bootstrap();
