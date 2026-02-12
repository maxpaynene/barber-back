import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import express from 'express';
import { Handler, Context, Callback } from 'aws-lambda';

let cachedServer: Handler;

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    nestApp.enableCors();
    await nestApp.init();

    cachedServer = serverlessExpress({ app: expressApp });
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return cachedServer(event, context, callback);
};
