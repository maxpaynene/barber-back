/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../../src/app.module';
import express from 'express';
import serverless from 'serverless-http';

let cachedServer: any;

async function bootstrapServer() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    const config = new DocumentBuilder()
      .setTitle('Barberia API')
      .setDescription('API para gestión de barbería')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('', app, document);

    await app.init();
    cachedServer = serverless(expressApp);
  }
  return cachedServer;
}

export const handler = async (event: any, context: any) => {
  const server = await bootstrapServer();
  return server(event, context);
};
