import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser'; // 👈 Agregado

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // usar raw body solo para el webhook
  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

  // El resto de la app sí usa bodyParser normal
  app.use(bodyParser.json());

  //CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('ExtremeGym')
    .setDescription('Documentación de mi API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
