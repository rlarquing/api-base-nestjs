import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    cors:true
  });
  app.use(cookieParser());
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
  await app.listen(AppModule.port);
}
bootstrap();
