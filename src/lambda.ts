import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import serverlessExpress from '@vendia/serverless-express';
import express from 'express';
import { Handler, Context, Callback } from 'aws-lambda';
import { setupApp } from './app.setup';

let cachedServer: Handler;

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  event.requestContext = event.requestContext || {};
  event.requestContext.elb = event.requestContext.elb || {};
  if (event.multiValueHeaders && !event.headers) {
    event.headers = Object.keys(event.multiValueHeaders).reduce((headers, key) => {
      headers[key] = event.multiValueHeaders[key].join(', ');
      return headers;
    }, {});
  }

  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    await setupApp(nestApp);
    await nestApp.init();
    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer(event, context, callback);
};