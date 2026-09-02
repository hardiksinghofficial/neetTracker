import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';

const server = express();
let isInitialized = false;

async function bootstrapServerless() {
  if (!isInitialized) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    
    app.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-access-code', 'x-access-mode'],
    });

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    const config = new DocumentBuilder()
      .setTitle('NEET Prep Tracker API')
      .setDescription('Serverless API for NEET 2027 Study & Performance Tracker')
      .setVersion('2.0')
      .addApiKey({ type: 'apiKey', name: 'x-access-code', in: 'header' }, 'access-code')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.init();
    isInitialized = true;
  }
  return server;
}

export default async function handler(req: any, res: any) {
  const app = await bootstrapServerless();
  return app(req, res);
}
