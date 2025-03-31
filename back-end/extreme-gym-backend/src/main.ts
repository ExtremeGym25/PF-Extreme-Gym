import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { auth } from 'express-openid-connect';
import { config as auth0Config } from './config/auth0.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder().setTitle('ExtremeGym')
  .setDescription('Documentación de mi API')
  .setVersion('1.0')
  .addTag('Users')
  .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(auth(auth0Config));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
