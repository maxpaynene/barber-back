/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import serverlessExpress from '@vendia/serverless-express'; // o @codegenie/serverless-express
import express from 'express';
import { Handler, Context, Callback } from 'aws-lambda';

let cachedServer: Handler;

// src/lambda.ts
export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  // PARCHE CRÍTICO PARA NETLIFY
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
    nestApp.enableCors();
    await nestApp.init();
    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer(event, context, callback);
};
