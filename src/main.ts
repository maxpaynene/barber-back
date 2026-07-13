import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp, GLOBAL_PREFIX, SWAGGER_PATH } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await setupApp(app);
  await app.listen(3000);

  console.log(`Swagger is running on: ${await app.getUrl()}/${GLOBAL_PREFIX}/${SWAGGER_PATH}`);
  console.log(`Application is running on: ${await app.getUrl()}/${GLOBAL_PREFIX}/`);
}

void bootstrap();