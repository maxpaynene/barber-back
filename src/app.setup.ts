import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { buildSwaggerHTML, buildSwaggerInitJS } from '@nestjs/swagger/dist/swagger-ui/swagger-ui';
import * as yaml from 'js-yaml';
import type { Request, Response } from 'express';

export const GLOBAL_PREFIX = 'api';
export const SWAGGER_PATH = 'api-docs';

export const SWAGGER_DOCUMENT = 'SWAGGER_DOCUMENT';
export const SWAGGER_OPTIONS = 'SWAGGER_OPTIONS';

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

  app.setGlobalPrefix(GLOBAL_PREFIX);

  const config = new DocumentBuilder()
    .setTitle('Barbería API')
    .setDescription('Documentación del sistema de gestión de barbería (MVP)')
    .setVersion('1')
    .addTag('services')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const SWAGGER_UI_VERSION = '5.17.14';
const SWAGGER_UI_CDN = `https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_UI_VERSION}`;

const escapeRegExp = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const swaggerOptions = {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Barbería Docs',
  };

  const httpAdapter = app.getHttpAdapter();

  const sendHtml = (req: Request, res: Response): void => {
    // Los assets de swagger-ui (CSS, JS bundle, standalone preset) se sirven desde
    // el CDN público. swagger-ui-init.js se sirve desde esta misma lambda con
    // el spec del OpenAPI embebido. Eso evita depender de useStaticAssets,
    // que falla en Netlify Functions con swagger-ui-express.
    const proto =
      (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
    const host =
      (req.headers['x-forwarded-host'] as string) ||
      req.headers.host ||
      '';
    const selfUrl = `${proto}://${host}/${GLOBAL_PREFIX}/${SWAGGER_PATH}`;
    const baseUrl = SWAGGER_UI_CDN + '/';
    const initUrl = `${selfUrl}/swagger-ui-init.js`;
    const rawHtml = buildSwaggerHTML(baseUrl, swaggerOptions);
    const html = rawHtml
      .replace(
        new RegExp(`${escapeRegExp(baseUrl)}swagger-ui-init\\.js`),
        initUrl,
      )
      .replace(
        new RegExp(`${escapeRegExp(baseUrl)}swagger-ui\\.css`),
        `${SWAGGER_UI_CDN}/swagger-ui.css`,
      );
    res.type('text/html; charset=utf-8').send(html);
  };

  const sendInit = (_req: Request, res: Response): void => {
    res
      .type('application/javascript; charset=utf-8')
      .send(buildSwaggerInitJS(document, swaggerOptions));
  };

  const sendJson = (_req: Request, res: Response): void => {
    res.type('application/json; charset=utf-8').send(document);
  };

  const sendYaml = (_req: Request, res: Response): void => {
    res.type('text/yaml; charset=utf-8').send(yaml.dump(document));
  };

  const get = httpAdapter.get.bind(httpAdapter);
  get([`/${GLOBAL_PREFIX}/${SWAGGER_PATH}`, `/${GLOBAL_PREFIX}/${SWAGGER_PATH}/`], sendHtml);
  get(`/${GLOBAL_PREFIX}/${SWAGGER_PATH}-json`, sendJson);
  get(`/${GLOBAL_PREFIX}/${SWAGGER_PATH}-yaml`, sendYaml);
  get(`/${GLOBAL_PREFIX}/${SWAGGER_PATH}/swagger-ui-init.js`, sendInit);
  get(`/${GLOBAL_PREFIX}/${SWAGGER_PATH}/index.json`, sendJson);
  get(`/${GLOBAL_PREFIX}/${SWAGGER_PATH}/index.yaml`, sendYaml);

  app.use(
    `/${GLOBAL_PREFIX}/${SWAGGER_PATH}`,
    (
      req: import('express').Request,
      res: import('express').Response,
      next: import('express').NextFunction,
    ): void => {
      if (req.method !== 'GET') return next();
      if (req.path === '/' || req.path === '') return sendHtml(req as Request, res);
      next();
    },
  );
};