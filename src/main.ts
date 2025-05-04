import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ApiKeyGuard } from './shared/guards/api-key.guard';
import { IdPipe } from './shared/pipes/id.pipe';
import { DuplicateFilter } from './shared/filters/duplicate.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
