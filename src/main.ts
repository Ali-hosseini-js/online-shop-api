import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
// import { ApiKeyGuard } from './shared/guards/api-key.guard';
import { IdPipe } from './shared/pipes/id.pipe';
import { DuplicateFilter } from './shared/filters/duplicate.filter';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
// const csrf = require('als-csrf');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(process.env.COOKIE_SECRET));
  //its just for local try. it is not necessary for production
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    optionsSuccessStatus: 200,
  });
  app.use(helmet());
  // app.use(csrf());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalPipes(new IdPipe());
  app.useGlobalFilters(new DuplicateFilter());
  // app.useGlobalGuards(new ApiKeyGuard());

  const config = new DocumentBuilder().setTitle('online shop').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);
  await app.listen(process.env.PORT ?? 3100);
}
bootstrap();
