import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 BU SATIR HER ŞEYİ DÜZELTİR
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Codyol CRM API')
    .setDescription('CRM Backend API Documentation')
    .setVersion('1.0')
    .addSecurity('JWT-auth', {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Sadece JWT token gir (Bearer otomatik eklenir)',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      requestInterceptor: (req: { headers: { Authorization?: string } }) => {
        if (
          req.headers.Authorization &&
          !req.headers.Authorization.startsWith('Bearer ')
        ) {
          req.headers.Authorization = `Bearer ${req.headers.Authorization}`;
        }
        return req;
      },
    },
  });

  await app.listen(3000);
}

bootstrap();

