import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp, GLOBAL_PREFIX, SWAGGER_PATH } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await setupApp(app);
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  console.log(`Swagger UI: ${await app.getUrl()}/${SWAGGER_PATH}`);
  console.log(`Application: ${await app.getUrl()}/${GLOBAL_PREFIX}/`);
}

void bootstrap();