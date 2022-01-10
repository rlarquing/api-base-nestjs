import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { PermisoService } from './security/service';
import { parseController } from '../lib/parse-controller';
import { TypeORMExceptionFilter } from './shared/filter/typeorm-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: AppModule.cors,
  });
  app.useGlobalFilters(new TypeORMExceptionFilter());
  if (AppModule.logger) {
    app.useLogger(AppModule.loggerProvider);
  }
  app.setGlobalPrefix('api');
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API-BASE')
    .setDescription('Api básica con Nestjs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors);
      },
    }),
  );
  await app.listen(AppModule.port);
  const isDevelopmentEnv = process.env.NODE_ENV !== 'production';
  if (isDevelopmentEnv) {
    const application = await app;
    const permisoService = application.get(PermisoService);
    await parseController(permisoService);
  }
}
bootstrap();
