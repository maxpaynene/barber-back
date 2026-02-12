import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Barbería API')
    .setDescription('Documentación del sistema de gestión de barbería (MVP)')
    .setVersion('1.0')
    .addTag('services')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Barbería Docs',
    useGlobalPrefix: false,
  });

  await app.listen(3000);
  console.log(`Swagger is running on: ${await app.getUrl()}/api/docs`);
  console.log(`Application is running on: ${await app.getUrl()}/api`);
}

void bootstrap();
