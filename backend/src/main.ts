import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for all origins in production/staging
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-code', 'x-access-mode'],
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('NEET Prep Tracker API')
    .setDescription('Production API for NEET 2027 Study & Performance Tracker')
    .setVersion('2.0')
    .addApiKey({ type: 'apiKey', name: 'x-access-code', in: 'header' }, 'access-code')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 NEET Tracker Backend running on port ${port}`);
}

if (!process.env.VERCEL) {
  await bootstrap();
}

export { bootstrap };
