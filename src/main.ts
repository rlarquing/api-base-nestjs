import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {BadRequestException, ValidationPipe} from "@nestjs/common";
import {ValidationError} from "class-validator";

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    cors:true
  });
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
      })
  );
  await app.listen(AppModule.port);
}
bootstrap();
