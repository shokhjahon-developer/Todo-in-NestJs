import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as basicAuth from 'express-basic-auth';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const configServise = app.get<ConfigService>(ConfigService);
  const port = +configServise.get<string>('PORT');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.use(
    'api/docs',
    basicAuth({
      challenge: true,
      users: {
        admin: configServise.get<string>('DOCS_PASS'),
      },
    }),
  );

  app.enableVersioning();

  const config = new DocumentBuilder()
    .setTitle('Todo List')
    .setDescription('description of the list of tasks')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(
      `Documentation is available at http://localhost:${port}/api/docs`,
    );
  });
}
bootstrap();
